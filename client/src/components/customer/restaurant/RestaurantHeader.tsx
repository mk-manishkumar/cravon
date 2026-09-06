import Image from "next/image";
import { Star, MapPin, Clock } from "lucide-react";
import dynamic from "next/dynamic";
import { getRestaurantStatus } from "@/utils/restaurantUtils";

const MapWidget = dynamic(() => import("@/components/partner/MapWidget"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-800/50 animate-pulse flex items-center justify-center text-sm font-bold text-white">Loading Map...</div>,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RestaurantHeader({ restaurant }: { readonly restaurant: any }) {
  const currentStatus = getRestaurantStatus(restaurant);

  return (
    <div className="relative w-full h-75 md:h-100 bg-gray-900">
      {restaurant.image && <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover opacity-60" />}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>

      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-black mb-1">{restaurant.name}</h1>
            {restaurant.franchiseName && (
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[13px] font-bold tracking-wide uppercase bg-[#FF3D57] text-white shadow-md">{restaurant.franchiseName}</span>
              </div>
            )}
            {!restaurant.franchiseName && <div className="mb-3"></div>}

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/90 mb-4">
              <div className="relative group flex items-center gap-1 cursor-pointer">
                <MapPin className="w-4 h-4" />
                <span className="border-b border-dashed border-white/50 pb-0.5 hover:text-[#FF3D57] hover:border-[#FF3D57] transition-colors">{restaurant.address || "Local Area"}</span>

                {/* Hover Map Tooltip */}
                <div className="absolute top-full left-0 mt-3 w-90 h-60 bg-[#1A1A1A] rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-white/20 overflow-hidden pointer-events-none origin-top-left transform scale-95 group-hover:scale-100">
                  <MapWidget lat={restaurant.location?.coordinates?.[1] || 28.6139} lng={restaurant.location?.coordinates?.[0] || 77.209} readOnly={true} />
                  <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-md text-[13px] font-bold text-white px-4 py-2.5 rounded-xl shadow-lg z-1000 truncate border border-white/10 text-center">{restaurant.address}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-md text-white">
                <Star className="w-4 h-4 fill-white" />
                <span>{restaurant.rating && restaurant.rating > 0 ? restaurant.rating.toFixed(1) : "New"}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime || "30-40"} mins</span>
              </div>

              {/* Status Tag */}
              <div className="flex-1 min-w-4 hidden sm:block"></div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[13px] font-bold tracking-wide uppercase text-white shadow-md ${currentStatus.color}`}>{currentStatus.text}</span>
            </div>

            <div className="flex flex-col gap-1.5 text-sm font-medium opacity-80 border-t border-white/20 pt-4 mt-2">
              {restaurant.operatingDays && restaurant.operatingDays.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white/90">Open Days:</span>
                  <span>{restaurant.operatingDays.map((d: string) => d.substring(0, 3)).join(", ")}</span>
                </div>
              )}

              {restaurant.mealTimings && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-1">
                  {restaurant.mealTimings.breakfast?.open && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white/90">Breakfast:</span>
                      <span>
                        {restaurant.mealTimings.breakfast.open} - {restaurant.mealTimings.breakfast.close}
                      </span>
                    </div>
                  )}
                  {restaurant.mealTimings.lunch?.open && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white/90">Lunch:</span>
                      <span>
                        {restaurant.mealTimings.lunch.open} - {restaurant.mealTimings.lunch.close}
                      </span>
                    </div>
                  )}
                  {restaurant.mealTimings.dinner?.open && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white/90">Dinner:</span>
                      <span>
                        {restaurant.mealTimings.dinner.open} - {restaurant.mealTimings.dinner.close}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
