"use client";

import { Star } from "lucide-react";

interface ReviewEmptyStateProps {
  readonly restaurantName: string;
  readonly starFilter?: number;
  readonly onClearFilter: () => void;
  readonly onOpenForm: () => void;
}

export default function ReviewEmptyState({ restaurantName, starFilter, onClearFilter, onOpenForm }: ReviewEmptyStateProps) {
  return (
    <div className="text-center py-16 px-4 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
      <div className="w-16 h-16 bg-orange-100 text-[#FF7A30] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xs">
        <Star className="w-8 h-8 fill-[#FF7A30]" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{starFilter ? `No ${starFilter}-star reviews found` : "No reviews yet"}</h3>
      <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">{starFilter ? "Try resetting the filter to view all customer reviews." : `Be the very first food lover to share an experience with ${restaurantName}!`}</p>
      {starFilter ? (
        <button type="button" onClick={onClearFilter} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
          Clear Filter
        </button>
      ) : (
        <button type="button" onClick={onOpenForm} className="px-5 py-2.5 bg-linear-to-r from-[#FF7A30] to-[#FF3D57] hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer">
          Write First Review
        </button>
      )}
    </div>
  );
}
