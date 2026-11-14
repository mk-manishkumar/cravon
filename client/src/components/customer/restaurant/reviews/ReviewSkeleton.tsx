export default function ReviewSkeleton() {
  return (
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
  );
}
