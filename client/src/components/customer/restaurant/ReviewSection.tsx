"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, MessageSquarePlus, Trash2, Edit3, CheckCircle2, ThumbsUp, X, Filter } from "lucide-react";
import { reviewService, ReviewItem, ReviewFilters } from "@/services/review.service";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ReviewSectionProps {
  restaurantId: string;
  restaurantName: string;
}

const STAR_LABELS: Record<number, string> = {
  1: "Poor 😞",
  2: "Fair 😐",
  3: "Good 🙂",
  4: "Very Good 😊",
  5: "Excellent! 🌟",
};

const SUGGESTED_TAGS = ["Delicious Food 😋", "Super Fast Delivery ⚡", "Fresh Ingredients 🥗", "Great Packaging 📦", "Value for Money 💰", "Generous Portions 🍲", "Clean & Hygienic 🧼", "Polite Staff 👍"];

export default function ReviewSection({ restaurantId, restaurantName }: Readonly<ReviewSectionProps>) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // Filter & pagination state
  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    limit: 6,
    sortBy: "recent",
  });

  // Review Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [formComment, setFormComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  // Populate form if user has an existing review when opening form
  const handleOpenForm = () => {
    if (!user) {
      router.push(`/auth/login?redirect=/restaurants/${restaurantId}#reviews`);
      return;
    }

    if (myReview) {
      setFormRating(myReview.rating);
      setFormComment(myReview.comment || "");
      setSelectedTags(myReview.tags || []);
    } else {
      setFormRating(5);
      setFormComment("");
      setSelectedTags([]);
    }
    setIsFormOpen(true);
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 5 ? [...prev, tag] : prev));
  };

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: () =>
      reviewService.submitReview(restaurantId, {
        rating: formRating,
        comment: formComment,
        tags: selectedTags,
      }),
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
      setDeleteConfirmId(null);
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
      {isFormOpen && (
        <div className="mb-10 bg-linear-to-br from-orange-50/70 via-white to-amber-50/50 p-6 md:p-8 rounded-2xl border border-orange-200/80 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-orange-100 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{myReview ? "Update Your Review" : "Write a Review for " + restaurantName}</h3>
              <p className="text-xs text-gray-500 mt-0.5">Your honest rating helps fellow foodies make great choices</p>
            </div>
            <button type="button" onClick={() => setIsFormOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* 1. Star Rating Picker */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || formRating);
                    return (
                      <button key={star} type="button" onClick={() => setFormRating(star)} onMouseEnter={() => setHoverRating(star)} className="p-1 -m-1 transition-transform hover:scale-120 cursor-pointer" aria-label={`Rate ${star} star`}>
                        <Star className={`w-8 h-8 transition-colors ${isFilled ? "fill-amber-400 text-amber-400 drop-shadow-xs" : "text-gray-300 hover:text-amber-300"}`} />
                      </button>
                    );
                  })}
                </div>
                <span className="text-sm font-bold text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full">{STAR_LABELS[hoverRating || formRating]}</span>
              </div>
            </div>

            {/* 2. Highlight Tags */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">What did you like? (Optional, select up to 5)</label>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button key={tag} type="button" onClick={() => handleToggleTag(tag)} className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${isSelected ? "bg-[#FF3D57] text-white border-[#FF3D57] shadow-xs" : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Review Comment */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="review-comment-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Detailed Review (Optional)
                </label>
                <span className="text-[11px] text-gray-400">{formComment.length} / 1000</span>
              </div>
              <textarea id="review-comment-input" rows={3} maxLength={1000} value={formComment} onChange={(e) => setFormComment(e.target.value)} placeholder="Share more details about taste, portion size, hygiene, or delivery speed..." className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent transition-all shadow-2xs resize-none" />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" onClick={() => setIsFormOpen(false)} disabled={submitMutation.isPending} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="button" onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending} className="px-6 py-2.5 bg-linear-to-r from-[#FF7A30] to-[#FF3D57] hover:opacity-95 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50">
                {submitMutation.isPending ? "Submitting..." : myReview ? "Update Review" : "Publish Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ratings Overview Summary Card */}
      {summary && summary.totalReviews > 0 ? (
        <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 md:p-8 mb-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Big Score */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r md:border-gray-200 md:pr-6">
            <span className="text-5xl font-black text-gray-900 tracking-tight">{summary.averageRating.toFixed(1)}</span>
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`w-5 h-5 ${star <= Math.round(summary.averageRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
              ))}
            </div>
            <p className="text-xs font-semibold text-gray-500">
              Based on {summary.totalReviews} {summary.totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>

          {/* Breakdown Bars */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const item = summary.breakdown[star] || { count: 0, percentage: 0 };
              const isSelected = filters.starFilter === star;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: 1,
                      limit: 6,
                      starFilter: isSelected ? undefined : star,
                    }))
                  }
                  className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1 rounded-lg transition-colors ${isSelected ? "bg-amber-100/70 font-bold" : "hover:bg-gray-100"}`}
                >
                  <span className="w-8 text-right font-bold text-gray-700 flex items-center justify-end gap-1">
                    {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${isSelected ? "bg-amber-500" : star >= 4 ? "bg-emerald-500" : star === 3 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${item.percentage}%` }} />
                  </div>
                  <span className="w-14 text-right text-gray-500 text-[11px] font-medium">
                    {item.count} ({item.percentage}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Filter and Sort Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button type="button" onClick={() => setFilters((p) => ({ ...p, page: 1, limit: 6, starFilter: undefined }))} className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${!filters.starFilter ? "bg-gray-900 text-white border-gray-900 shadow-2xs" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
            All
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() =>
                setFilters((p) => ({
                  ...p,
                  page: 1,
                  limit: 6,
                  starFilter: p.starFilter === star ? undefined : star,
                }))
              }
              className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ${filters.starFilter === star ? "bg-amber-500 text-white border-amber-500 shadow-2xs" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
            >
              {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-semibold text-gray-500">Sort by:</span>
          <select
            value={filters.sortBy || "recent"}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                page: 1,
                sortBy: e.target.value as "recent" | "highest" | "lowest",
              }))
            }
            className="text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-[#FF7A30] cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 bg-white border border-gray-100 rounded-2xl animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-28 h-4 bg-gray-200 rounded" />
                  <div className="w-20 h-3 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="w-full h-12 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && reviews.length === 0 && (
        <div className="text-center py-16 px-4 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-orange-100 text-[#FF7A30] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <Star className="w-8 h-8 fill-[#FF7A30]" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{filters.starFilter ? `No ${filters.starFilter}-star reviews found` : "No reviews yet"}</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">{filters.starFilter ? "Try resetting the filter to view all customer reviews." : `Be the very first food lover to share an experience with ${restaurantName}!`}</p>
          {filters.starFilter ? (
            <button type="button" onClick={() => setFilters((p) => ({ ...p, page: 1, limit: 6, starFilter: undefined }))} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
              Clear Filter
            </button>
          ) : (
            <button type="button" onClick={handleOpenForm} className="px-5 py-2.5 bg-linear-to-r from-[#FF7A30] to-[#FF3D57] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer">
              Write First Review
            </button>
          )}
        </div>
      )}

      {/* Reviews List */}
      {!isLoading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((rev: ReviewItem) => {
            const isMyReview = Boolean(user?.id && rev.user?._id === user.id);
            const reviewDate = new Date(rev.createdAt);

            return (
              <div key={rev._id} className={`p-5 md:p-6 bg-white border rounded-2xl transition-shadow hover:shadow-xs ${isMyReview ? "border-orange-200 bg-orange-50/20" : "border-gray-100 shadow-2xs"}`}>
                {/* User Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#FF7A30] to-[#FF3D57] text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0 overflow-hidden">{rev.user?.profilePicture ? <Image src={rev.user.profilePicture} alt={`${rev.user.firstName || "User"}'s profile`} width={40} height={40} className="w-full h-full object-cover" /> : <span>{rev.user?.firstName ? rev.user.firstName.charAt(0).toUpperCase() : "U"}</span>}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">
                          {rev.user?.firstName} {rev.user?.lastName}
                        </span>
                        {isMyReview && <span className="text-[10px] font-extrabold uppercase tracking-wide bg-[#FF3D57] text-white px-2 py-0.5 rounded-full">You</span>}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                        {rev.isVerifiedBuyer ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold" title="Ordered & delivered from this restaurant">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Purchase
                          </span>
                        ) : rev.user?.isVerified ? (
                          <span className="flex items-center gap-1 text-blue-600 font-medium" title="Verified account">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Verified User
                          </span>
                        ) : null}
                        {(rev.isVerifiedBuyer || rev.user?.isVerified) && <span>•</span>}
                        <span>
                          {reviewDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg text-amber-800 font-extrabold text-xs shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                {/* Tags */}
                {rev.tags && rev.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {rev.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
                        <ThumbsUp className="w-3 h-3 text-orange-500" /> {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Comment */}
                {rev.comment && <p className="text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line">{rev.comment}</p>}

                {/* Owner Actions */}
                {isMyReview && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-3 text-xs font-semibold">
                    {deleteConfirmId === rev._id ? (
                      <div className="flex items-center gap-2 animate-in fade-in">
                        <span className="text-gray-500 text-[11px]">Delete this review?</span>
                        <button type="button" onClick={() => deleteMutation.mutate(rev._id)} disabled={deleteMutation.isPending} className="text-red-600 hover:text-red-700 font-bold cursor-pointer">
                          Yes, Delete
                        </button>
                        <button type="button" onClick={() => setDeleteConfirmId(null)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <button type="button" onClick={handleOpenForm} className="text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer transition-colors">
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button type="button" onClick={() => setDeleteConfirmId(rev._id)} className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Progressive In-Place Review Loading */}
      {pagination && reviews.length < pagination.totalFiltered && (
        <div className="flex flex-col items-center justify-center gap-2 mt-8">
          <button type="button" onClick={() => setFilters((p) => ({ ...p, limit: (p.limit || 6) + 6 }))} className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-2 active:scale-[0.98]">
            <span>Load More Reviews</span>
            <span className="text-[11px] text-gray-500 font-normal">({pagination.totalFiltered - reviews.length} remaining)</span>
          </button>
          <span className="text-[11px] text-gray-400">
            Showing {reviews.length} of {pagination.totalFiltered} reviews
          </span>
        </div>
      )}

      {pagination && pagination.totalFiltered > 6 && reviews.length >= pagination.totalFiltered && <div className="text-center mt-8 text-xs text-gray-400 font-medium">Showing all {pagination.totalFiltered} reviews ✓</div>}
    </div>
  );
}
