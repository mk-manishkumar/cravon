"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, CheckCircle2, ThumbsUp, Edit3, Trash2 } from "lucide-react";
import { ReviewItem } from "@/services/review.service";

interface ReviewCardProps {
  readonly review: ReviewItem;
  readonly isMyReview: boolean;
  readonly isDeletePending: boolean;
  readonly onEdit: () => void;
  readonly onDelete: (reviewId: string) => void;
}

export default function ReviewCard({ review, isMyReview, isDeletePending, onEdit, onDelete }: ReviewCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const reviewDate = new Date(review.createdAt);

  const handleDelete = () => {
    onDelete(review._id);
    setShowDeleteConfirm(false);
  };

  return (
    <div className={`p-5 md:p-6 bg-white border rounded-2xl transition-shadow hover:shadow-xs ${isMyReview ? "border-orange-200 bg-orange-50/20" : "border-gray-100 shadow-2xs"}`}>
      {/* User Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#FF7A30] to-[#FF3D57] text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0 overflow-hidden">{review.user?.profilePicture ? <Image src={review.user.profilePicture} alt={`${review.user.firstName || "User"}'s profile`} width={40} height={40} className="w-full h-full object-cover" /> : <span>{review.user?.firstName ? review.user.firstName.charAt(0).toUpperCase() : "U"}</span>}</div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">
                {review.user?.firstName} {review.user?.lastName}
              </span>
              {isMyReview && <span className="text-[10px] font-extrabold uppercase tracking-wide bg-[#FF3D57] text-white px-2 py-0.5 rounded-full">You</span>}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              {review.isVerifiedBuyer ? (
                <span className="flex items-center gap-1 text-emerald-600 font-semibold" title="Ordered & delivered from this restaurant">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Purchase
                </span>
              ) : review.user?.isVerified ? (
                <span className="flex items-center gap-1 text-blue-600 font-medium" title="Verified account">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified User
                </span>
              ) : null}
              {(review.isVerifiedBuyer || review.user?.isVerified) && <span>•</span>}
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
          <span>{review.rating}.0</span>
        </div>
      </div>

      {/* Tags */}
      {review.tags && review.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {review.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full">
              <ThumbsUp className="w-3 h-3 text-orange-500" /> {tag}
            </span>
          ))}
        </div>
      )}

      {/* Comment */}
      {review.comment && <p className="text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line">{review.comment}</p>}

      {/* Owner Actions */}
      {isMyReview && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-3 text-xs font-semibold">
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2 animate-in fade-in">
              <span className="text-gray-500 text-[11px]">Delete this review?</span>
              <button type="button" onClick={handleDelete} disabled={isDeletePending} className="text-red-600 hover:text-red-700 font-bold cursor-pointer disabled:opacity-50">
                Yes, Delete
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                Cancel
              </button>
            </div>
          ) : (
            <>
              <button type="button" onClick={onEdit} className="text-gray-600 hover:text-gray-900 flex items-center gap-1 cursor-pointer transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(true)} className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
