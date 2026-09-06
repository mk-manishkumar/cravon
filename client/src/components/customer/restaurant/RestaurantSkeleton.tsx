export default function RestaurantSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-64 bg-gray-200 rounded-3xl mb-8"></div>
      <div className="h-10 w-1/2 bg-gray-200 rounded mb-4"></div>
      <div className="h-6 w-1/3 bg-gray-200 rounded mb-12"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["skel-menu-1", "skel-menu-2", "skel-menu-3", "skel-menu-4"].map((id) => (
          <div key={id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
            <div className="space-y-2 w-2/3">
              <div className="h-6 bg-gray-200 w-1/2 rounded"></div>
              <div className="h-4 bg-gray-200 w-full rounded"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
