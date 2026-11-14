"use client";

interface ReviewLoadMoreProps {
  readonly loadedCount: number;
  readonly totalFiltered: number;
  readonly onLoadMore: () => void;
}

export default function ReviewLoadMore({ loadedCount, totalFiltered, onLoadMore }: ReviewLoadMoreProps) {
  if (totalFiltered <= 0) return null;

  if (loadedCount < totalFiltered) {
    const remaining = totalFiltered - loadedCount;
    return (
      <div className="flex flex-col items-center justify-center gap-2 mt-8">
        <button type="button" onClick={onLoadMore} className="px-6 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-2 active:scale-[0.98]">
          <span>Load More Reviews</span>
          <span className="text-[11px] text-gray-500 font-normal">({remaining} remaining)</span>
        </button>
        <span className="text-[11px] text-gray-400">
          Showing {loadedCount} of {totalFiltered} reviews
        </span>
      </div>
    );
  }

  if (totalFiltered > 6 && loadedCount >= totalFiltered) {
    return <div className="text-center mt-8 text-xs text-gray-400 font-medium">Showing all {totalFiltered} reviews ✓</div>;
  }

  return null;
}
