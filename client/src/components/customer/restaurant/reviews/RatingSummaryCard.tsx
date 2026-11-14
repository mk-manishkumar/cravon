"use client";

import { Star } from "lucide-react";
import { ReviewSummary } from "@/services/review.service";

interface RatingSummaryCardProps {
  readonly summary: ReviewSummary;
  readonly selectedStar?: number;
  readonly onToggleStar: (star: number) => void;
}

export default function RatingSummaryCard({ summary, selectedStar, onToggleStar }: RatingSummaryCardProps) {
  if (!summary || summary.totalReviews === 0) {
    return null;
  }

  const roundedAverage = Math.round(summary.averageRating);

  return (
    <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-6 md:p-8 mb-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
      {/* Big Score Block */}
      <div className="md:col-span-4 flex flex-col items-center justify-center text-center md:border-r md:border-gray-200 md:pr-6">
        <span className="text-5xl font-black text-gray-900 tracking-tight">{summary.averageRating.toFixed(1)}</span>
        <div className="flex items-center gap-1 my-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={`w-5 h-5 ${star <= roundedAverage ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
          ))}
        </div>
        <p className="text-xs font-semibold text-gray-500">
          Based on {summary.totalReviews} {summary.totalReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Breakdown Bars Block */}
      <div className="md:col-span-8 space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const item = summary.breakdown[star] || { count: 0, percentage: 0 };
          const isSelected = selectedStar === star;

          return (
            <button key={star} type="button" onClick={() => onToggleStar(star)} className={`w-full flex items-center gap-3 text-xs group cursor-pointer p-1 rounded-lg transition-colors ${isSelected ? "bg-amber-100/70 font-bold" : "hover:bg-gray-100"}`}>
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
  );
}
