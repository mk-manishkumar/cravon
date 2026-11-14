"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquarePlus, Edit3 } from "lucide-react";
import { reviewService, ReviewItem, ReviewFilters } from "@/services/review.service";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { ReviewForm, RatingSummaryCard, ReviewFilterBar, ReviewCard, ReviewEmptyState, ReviewSkeleton, ReviewLoadMore, DEFAULT_REVIEW_PAGE_LIMIT } from "./reviews";

interface ReviewSectionProps {
  readonly restaurantId: string;
  readonly restaurantName: string;
}

export default function ReviewSection({ restaurantId, restaurantName }: ReviewSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Filter & pagination state
  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    limit: DEFAULT_REVIEW_PAGE_LIMIT,
    sortBy: "recent",
  });

  // Review Form open/collapse state
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 1. Fetch reviews list and summary
  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["restaurant-reviews", restaurantId, filters],
    queryFn: () => reviewService.getRestaurantReviews(restaurantId, filters),
    enabled: !!restaurantId,
  });

  // 2. Fetch logged in user's review for this restaurant (if logged in)
  const { data: myReview } = useQuery({
    queryKey: ["my-restaurant-review", restaurantId, user?.id],
    queryFn: () => reviewService.getUserReview(restaurantId),
    enabled: !!user && !!restaurantId,
  });

  const handleOpenForm = () => {
    if (!user) {
      router.push(`/auth/login?redirect=/restaurants/${restaurantId}#reviews`);
      return;
    }
    setIsFormOpen(true);
  };

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: (data: { rating: number; comment?: string; tags?: string[] }) => reviewService.submitReview(restaurantId, data),
    onSuccess: (data) => {
      toast.success(data?.review ? "Review submitted successfully!" : "Thank you for your review!");
      setIsFormOpen(false);
      queryClient.invalidateQueries({ queryKey: ["restaurant-reviews", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["my-restaurant-review", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", restaurantId] });
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosErr.response?.data?.message || axiosErr.message || "Failed to submit review";
      toast.error(msg);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(restaurantId, reviewId),
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["restaurant-reviews", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["my-restaurant-review", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["restaurant", restaurantId] });
    },
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } }; message?: string };
      const msg = axiosErr.response?.data?.message || axiosErr.message || "Failed to delete review";
      toast.error(msg);
    },
  });

  const summary = reviewsData?.summary;
  const reviews = reviewsData?.reviews || [];
  const pagination = reviewsData?.pagination;

  return (
    <div id="reviews" className="max-w-4xl mx-auto px-6 py-12 scroll-mt-24 border-t border-gray-100">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
            Reviews & Ratings
            {summary && summary.totalReviews > 0 && <span className="text-sm font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">{summary.totalReviews}</span>}
          </h2>
          <p className="text-sm text-gray-500 mt-1">Real dining and delivery experiences from verified food lovers</p>
        </div>

        <button type="button" onClick={handleOpenForm} className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-[#FF7A30] to-[#FF3D57] hover:from-[#e66a25] hover:to-[#e6354c] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer">
          {myReview ? (
            <>
              <Edit3 className="w-4 h-4" />
              Edit Your Review
            </>
          ) : (
            <>
              <MessageSquarePlus className="w-4 h-4" />
              Write a Review
            </>
          )}
        </button>
      </div>

      {/* Review Form Drawer / Card */}
      {isFormOpen && <ReviewForm key={myReview?._id || "new-review"} restaurantName={restaurantName} isEditing={Boolean(myReview)} isPending={submitMutation.isPending} initialRating={myReview?.rating || 5} initialComment={myReview?.comment || ""} initialTags={myReview?.tags || []} onClose={() => setIsFormOpen(false)} onSubmit={(data) => submitMutation.mutate(data)} />}

      {/* Ratings Overview Summary Card */}
      {summary && (
        <RatingSummaryCard
          summary={summary}
          selectedStar={filters.starFilter}
          onToggleStar={(star) =>
            setFilters((prev) => ({
              ...prev,
              page: 1,
              limit: DEFAULT_REVIEW_PAGE_LIMIT,
              starFilter: prev.starFilter === star ? undefined : star,
            }))
          }
        />
      )}

      {/* Filter and Sort Bar */}
      <ReviewFilterBar
        starFilter={filters.starFilter}
        sortBy={filters.sortBy}
        onFilterStar={(star) =>
          setFilters((p) => ({
            ...p,
            page: 1,
            limit: DEFAULT_REVIEW_PAGE_LIMIT,
            starFilter: star,
          }))
        }
        onSortChange={(sort) =>
          setFilters((p) => ({
            ...p,
            page: 1,
            sortBy: sort,
          }))
        }
      />

      {/* Loading Skeleton */}
      {isLoading && <ReviewSkeleton />}

      {/* Empty State */}
      {!isLoading && reviews.length === 0 && (
        <ReviewEmptyState
          restaurantName={restaurantName}
          starFilter={filters.starFilter}
          onClearFilter={() =>
            setFilters((p) => ({
              ...p,
              page: 1,
              limit: DEFAULT_REVIEW_PAGE_LIMIT,
              starFilter: undefined,
            }))
          }
          onOpenForm={handleOpenForm}
        />
      )}

      {/* Reviews List */}
      {!isLoading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((rev: ReviewItem) => {
            const isMyReview = Boolean(user?.id && rev.user?._id === user.id);

            return <ReviewCard key={rev._id} review={rev} isMyReview={isMyReview} isDeletePending={deleteMutation.isPending} onEdit={handleOpenForm} onDelete={(reviewId) => deleteMutation.mutate(reviewId)} />;
          })}
        </div>
      )}

      {/* Progressive In-Place Review Loading */}
      {pagination && (
        <ReviewLoadMore
          loadedCount={reviews.length}
          totalFiltered={pagination.totalFiltered}
          onLoadMore={() =>
            setFilters((p) => ({
              ...p,
              limit: (p.limit || DEFAULT_REVIEW_PAGE_LIMIT) + DEFAULT_REVIEW_PAGE_LIMIT,
            }))
          }
        />
      )}
    </div>
  );
}
