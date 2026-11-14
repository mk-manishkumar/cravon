import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Restaurant from "../models/restaurant.model.js";
import Order from "../models/order.model.js";
import { ApiError } from "../utils/errorHandler.js";

// Helper to recalculate and sync the restaurant's cumulative rating and review count
export const syncRestaurantRating = async (restaurantId: string | mongoose.Types.ObjectId) => {
  const rId = new mongoose.Types.ObjectId(restaurantId.toString());

  const stats = await Review.aggregate([
    { $match: { restaurant: rId } },
    {
      $group: {
        _id: "$restaurant",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    const avgRating = Number(stats[0].avgRating.toFixed(1));
    const count = stats[0].count;
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: avgRating,
      reviewCount: count,
    });
    return { rating: avgRating, reviewCount: count };
  }

  // Fallback: If no written reviews, check if menu items have ratings
  const restaurant = await Restaurant.findById(restaurantId);
  if (restaurant) {
    const ratedMenuItems = (restaurant.menu ?? []).filter((m) => (m.rating || 0) > 0);
    const menuAvg =
      ratedMenuItems.length > 0
        ? Number((ratedMenuItems.reduce((sum, m) => sum + (m.rating || 0), 0) / ratedMenuItems.length).toFixed(1))
        : 0;
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: menuAvg,
      reviewCount: 0,
    });
    return { rating: menuAvg, reviewCount: 0 };
  }

  return { rating: 0, reviewCount: 0 };
};

interface GetReviewsOptions {
  page?: number;
  limit?: number;
  starFilter?: number;
  sortBy?: "recent" | "highest" | "lowest";
}

// Retrieves all reviews for a restaurant with filtering, sorting, pagination, and rating breakdown
export const getRestaurantReviewsService = async (restaurantId: string, options: GetReviewsOptions = {}) => {
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  const rId = new mongoose.Types.ObjectId(restaurantId);
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Math.min(50, Number(options.limit) || 10));
  const skip = (page - 1) * limit;

  // Build filter query
  const query: any = { restaurant: rId };
  const starFilter = Number(options.starFilter);
  if (!Number.isNaN(starFilter) && starFilter >= 1 && starFilter <= 5) {
    query.rating = starFilter;
  }

  // Build sort
  let sort: any = { createdAt: -1 };
  if (options.sortBy === "highest") {
    sort = { rating: -1, createdAt: -1 };
  } else if (options.sortBy === "lowest") {
    sort = { rating: 1, createdAt: -1 };
  }

  // Fetch reviews and total count matching filter
  const [rawReviews, totalFiltered] = await Promise.all([
    Review.find(query)
      .populate("user", "firstName lastName profilePicture isVerified")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments(query),
  ]);

  // Determine which reviewers have completed delivered orders with this restaurant
  const userIds = rawReviews.map((r: any) => r.user?._id).filter(Boolean);
  const deliveredUserIds = await Order.find({
    restaurant: rId,
    user: { $in: userIds },
    orderStatus: "delivered",
  }).distinct("user");
  const deliveredUserSet = new Set(deliveredUserIds.map((id) => id.toString()));

  const reviews = rawReviews.map((r: any) => ({
    ...r,
    isVerifiedBuyer: r.user?._id ? deliveredUserSet.has(r.user._id.toString()) : false,
  }));

  // Aggregate comprehensive rating summary and 5-star to 1-star breakdown
  const aggregateSummary = await Review.aggregate([
    { $match: { restaurant: rId } },
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },
  ]);

  const breakdown: Record<number, { count: number; percentage: number }> = {
    5: { count: 0, percentage: 0 },
    4: { count: 0, percentage: 0 },
    3: { count: 0, percentage: 0 },
    2: { count: 0, percentage: 0 },
    1: { count: 0, percentage: 0 },
  };

  let totalAllReviews = 0;
  let totalRatingSum = 0;

  for (const item of aggregateSummary) {
    const star = Number(item._id);
    const count = Number(item.count);
    if (star >= 1 && star <= 5) {
      breakdown[star].count = count;
      totalAllReviews += count;
      totalRatingSum += star * count;
    }
  }

  if (totalAllReviews > 0) {
    for (let s = 1; s <= 5; s++) {
      breakdown[s].percentage = Math.round((breakdown[s].count / totalAllReviews) * 100);
    }
  }

  const averageRating =
    totalAllReviews > 0 ? Number((totalRatingSum / totalAllReviews).toFixed(1)) : 0;

  return {
    reviews,
    summary: {
      averageRating,
      totalReviews: totalAllReviews,
      breakdown,
    },
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(totalFiltered / limit) || 1,
      totalFiltered,
    },
  };
};

// Gets the logged-in user's review for this restaurant, if any
export const getUserRestaurantReviewService = async (restaurantId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  const review = await Review.findOne({
    restaurant: restaurantId,
    user: userId,
  })
    .populate("user", "firstName lastName profilePicture isVerified")
    .lean();

  if (!review) return null;

  const hasDeliveredOrder = await Order.exists({
    restaurant: restaurantId,
    user: userId,
    orderStatus: "delivered",
  });

  return {
    ...review,
    isVerifiedBuyer: Boolean(hasDeliveredOrder),
  };
};

interface CreateReviewDTO {
  rating: number;
  comment?: string;
  tags?: string[];
}

// Creates or updates a user's review for a restaurant
export const createOrUpdateReviewService = async (restaurantId: string, userId: string, data: CreateReviewDTO) => {
  if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
    throw new ApiError(400, "Invalid restaurant ID");
  }

  const numericRating = Number(data.rating);
  if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new ApiError(400, "Rating must be between 1 and 5");
  }

  const restaurantExists = await Restaurant.exists({ _id: restaurantId });
  if (!restaurantExists) {
    throw new ApiError(404, "Restaurant not found");
  }

  // Sanitize comment and tags
  const comment = data.comment ? data.comment.trim().slice(0, 1000) : "";
  const tags = Array.isArray(data.tags) ? data.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 5) : [];

  const review = await Review.findOneAndUpdate(
    { restaurant: restaurantId, user: userId },
    {
      rating: numericRating,
      comment,
      tags,
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  ).populate("user", "firstName lastName profilePicture");

  // Sync restaurant aggregate rating
  const updatedStats = await syncRestaurantRating(restaurantId);

  return {
    review,
    restaurantRating: updatedStats.rating,
    reviewCount: updatedStats.reviewCount,
  };
};

// Deletes a review
export const deleteReviewService = async (restaurantId: string, reviewId: string, userId: string) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new ApiError(400, "Invalid review ID");
  }

  const review = await Review.findOne({ _id: reviewId, restaurant: restaurantId });
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.user.toString() !== userId) {
    throw new ApiError(403, "You can only delete your own review");
  }

  await Review.deleteOne({ _id: reviewId });

  // Sync restaurant aggregate rating
  const updatedStats = await syncRestaurantRating(restaurantId);

  return {
    deletedReviewId: reviewId,
    restaurantRating: updatedStats.rating,
    reviewCount: updatedStats.reviewCount,
  };
};
