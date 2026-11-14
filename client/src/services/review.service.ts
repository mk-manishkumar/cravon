import api from "../lib/axios";

export interface ReviewUser {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  isVerified?: boolean;
}

export interface ReviewItem {
  _id: string;
  restaurant: string;
  user: ReviewUser;
  rating: number;
  comment?: string;
  tags?: string[];
  isVerifiedBuyer?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RatingBreakdownItem {
  count: number;
  percentage: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  breakdown: Record<number, RatingBreakdownItem>;
}

export interface GetReviewsResponse {
  reviews: ReviewItem[];
  summary: ReviewSummary;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalFiltered: number;
  };
}

export interface ReviewFilters {
  page?: number;
  limit?: number;
  starFilter?: number;
  sortBy?: "recent" | "highest" | "lowest";
}

export const reviewService = {
  // Get all reviews for a restaurant with filtering, sorting, pagination, and breakdown summary
  getRestaurantReviews: async (restaurantId: string, filters: ReviewFilters = {}): Promise<GetReviewsResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.limit) params.set("limit", String(filters.limit));
    if (filters.starFilter) params.set("starFilter", String(filters.starFilter));
    if (filters.sortBy) params.set("sortBy", filters.sortBy);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get(`/reviews/restaurant/${restaurantId}${queryString}`);
    return response.data.data;
  },

  // Get the logged in user's review for this restaurant
  getUserReview: async (restaurantId: string): Promise<ReviewItem | null> => {
    try {
      const response = await api.get(`/reviews/restaurant/${restaurantId}/me`);
      return response.data.data;
    } catch {
      return null;
    }
  },

  // Create or update a review
  submitReview: async (
    restaurantId: string,
    data: { rating: number; comment?: string; tags?: string[] }
  ): Promise<{ review: ReviewItem; restaurantRating: number; reviewCount: number }> => {
    const response = await api.post(`/reviews/restaurant/${restaurantId}`, data);
    return response.data.data;
  },

  // Delete a review
  deleteReview: async (
    restaurantId: string,
    reviewId: string
  ): Promise<{ deletedReviewId: string; restaurantRating: number; reviewCount: number }> => {
    const response = await api.delete(`/reviews/restaurant/${restaurantId}/${reviewId}`);
    return response.data.data;
  },
};
