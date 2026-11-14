"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { STAR_LABELS, SUGGESTED_TAGS, MAX_COMMENT_LENGTH, MAX_TAGS_ALLOWED } from "./constants";

interface ReviewFormProps {
  readonly restaurantName: string;
  readonly isEditing: boolean;
  readonly isPending: boolean;
  readonly initialRating?: number;
  readonly initialComment?: string;
  readonly initialTags?: string[];
  readonly onClose: () => void;
  readonly onSubmit: (data: { rating: number; comment?: string; tags?: string[] }) => void;
}

export default function ReviewForm({ restaurantName, isEditing, isPending, initialRating = 5, initialComment = "", initialTags = [], onClose, onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(initialComment);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < MAX_TAGS_ALLOWED ? [...prev, tag] : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      rating,
      comment: comment.trim() || undefined,
      tags: selectedTags,
    });
  };

  return (
    <div className="mb-10 bg-linear-to-br from-orange-50/70 via-white to-amber-50/50 p-6 md:p-8 rounded-2xl border border-orange-200/80 shadow-md animate-in fade-in duration-200">
      {/* Form Header */}
      <div className="flex items-center justify-between pb-4 border-b border-orange-100 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{isEditing ? "Update Your Review" : `Write a Review for ${restaurantName}`}</h3>
          <p className="text-xs text-gray-500 mt-0.5">Your honest rating helps fellow foodies make great choices</p>
        </div>
        <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer" aria-label="Close review form">
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Star Rating Picker */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= (hoverRating || rating);
                return (
                  <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} className="p-1 -m-1 transition-transform hover:scale-120 cursor-pointer" aria-label={`Rate ${star} star`}>
                    <Star className={`w-8 h-8 transition-colors ${isFilled ? "fill-amber-400 text-amber-400 drop-shadow-xs" : "text-gray-300 hover:text-amber-300"}`} />
                  </button>
                );
              })}
            </div>
            <span className="text-sm font-bold text-amber-700 bg-amber-100/70 px-3 py-1 rounded-full">{STAR_LABELS[hoverRating || rating]}</span>
          </div>
        </div>

        {/* 2. Highlight Tags */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">What did you like? (Optional, select up to {MAX_TAGS_ALLOWED})</label>
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
            <span className="text-[11px] text-gray-400">
              {comment.length} / {MAX_COMMENT_LENGTH}
            </span>
          </div>
          <textarea id="review-comment-input" rows={3} maxLength={MAX_COMMENT_LENGTH} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share more details about taste, portion size, hygiene, or delivery speed..." className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent transition-all shadow-2xs resize-none" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-linear-to-r from-[#FF7A30] to-[#FF3D57] hover:opacity-95 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50">
            {isPending ? "Submitting..." : isEditing ? "Update Review" : "Publish Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
