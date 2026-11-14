import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { getRestaurantReviewsService, getUserRestaurantReviewService, createOrUpdateReviewService, deleteReviewService } from "../services/review.service.js";

// Fetch all reviews for a restaurant (Public)
export const getRestaurantReviews = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const { page, limit, starFilter, sortBy } = req.query;

  const data = await getRestaurantReviewsService(restaurantId, {
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
    starFilter: starFilter ? Number(starFilter) : undefined,
    sortBy: sortBy as "recent" | "highest" | "lowest",
  });

  res.status(200).json({
    status: "success",
    data,
  });
});

// Fetch current user's review for a restaurant (Authenticated)
export const getUserRestaurantReview = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const userId = (req as any).user.id;

  const review = await getUserRestaurantReviewService(restaurantId, userId);

  res.status(200).json({
    status: "success",
    data: review,
  });
});

// Create or update a review for a restaurant (Authenticated)
export const createOrUpdateRestaurantReview = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const userId = (req as any).user.id;
  const { rating, comment, tags } = req.body;

  const result = await createOrUpdateReviewService(restaurantId, userId, {
    rating,
    comment,
    tags,
  });

  res.status(200).json({
    status: "success",
    message: "Review submitted successfully!",
    data: result,
  });
});

// Delete a user's review (Authenticated)
export const deleteRestaurantReview = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId, reviewId } = req.params;
  const userId = (req as any).user.id;

  const result = await deleteReviewService(restaurantId, reviewId, userId);

  res.status(200).json({
    status: "success",
    message: "Review deleted successfully",
    data: result,
  });
});
