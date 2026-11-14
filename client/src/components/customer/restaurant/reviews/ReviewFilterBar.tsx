"use client";

import { Filter, Star } from "lucide-react";
import { SORT_OPTIONS } from "./constants";

interface ReviewFilterBarProps {
  readonly starFilter?: number;
  readonly sortBy?: "recent" | "highest" | "lowest";
  readonly onFilterStar: (star?: number) => void;
  readonly onSortChange: (sort: "recent" | "highest" | "lowest") => void;
}

export default function ReviewFilterBar({ starFilter, sortBy = "recent", onFilterStar, onSortChange }: ReviewFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
      {/* Star Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        <button type="button" onClick={() => onFilterStar(undefined)} className={`px-3 py-1 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${!starFilter ? "bg-gray-900 text-white border-gray-900 shadow-2xs" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
          All
        </button>
        {[5, 4, 3, 2, 1].map((star) => (
          <button key={star} type="button" onClick={() => onFilterStar(starFilter === star ? undefined : star)} className={`px-2.5 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 transition-colors cursor-pointer ${starFilter === star ? "bg-amber-500 text-white border-amber-500 shadow-2xs" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>
            {star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </button>
        ))}
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-2 self-end sm:self-auto">
        <span className="text-xs font-semibold text-gray-500">Sort by:</span>
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value as "recent" | "highest" | "lowest")} className="text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-[#FF7A30] cursor-pointer">
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
