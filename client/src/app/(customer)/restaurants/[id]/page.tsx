"use client";

import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star, MapPin, Clock } from "lucide-react";
import { useEffect } from "react";
import dynamic from "next/dynamic";

const MapWidget = dynamic(() => import("@/components/partner/MapWidget"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-800/50 animate-pulse flex items-center justify-center text-sm font-bold text-white">Loading Map...</div>,
});

interface TimeWindow {
  open: string;
  close: string;
}

interface RestaurantData {
  operatingDays?: string[];
  mealTimings?: {
    breakfast?: TimeWindow;
    lunch?: TimeWindow;
    dinner?: TimeWindow;
  };
  operatingHours?: TimeWindow;
  [key: string]: unknown; // Allow other properties
}

function parseTimeStr(timeStr: string | undefined): number | null {
  if (!timeStr) return null;
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/.exec(timeStr.trim());
  if (!match) return null;
  let hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  const period = match[3]?.toUpperCase();
  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

function checkTimeWindow(currentMinutes: number, window?: TimeWindow) {
  if (!window?.open || !window?.close) return { isOpen: false, closingSoon: false };

  const openMins = parseTimeStr(window.open);
  const closeMins = parseTimeStr(window.close);

  if (openMins === null || closeMins === null) return { isOpen: false, closingSoon: false };

  if (currentMinutes >= openMins && currentMinutes < closeMins) {
    return { isOpen: true, closingSoon: closeMins - currentMinutes <= 30 };
  }
  return { isOpen: false, closingSoon: false };
}

function getRestaurantStatus(restaurant?: RestaurantData | null) {
  if (!restaurant) return { text: "Close", color: "bg-[#FF3D57]" };

  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "long" });

  if (restaurant.operatingDays?.length && !restaurant.operatingDays.includes(currentDay)) {
    return { text: "Close", color: "bg-[#FF3D57]" };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let isOpen = false;
  let closingSoon = false;

  if (restaurant.mealTimings) {
    const meals = [restaurant.mealTimings.breakfast, restaurant.mealTimings.lunch, restaurant.mealTimings.dinner];
    for (const meal of meals) {
      const status = checkTimeWindow(currentMinutes, meal);
      if (status.isOpen) {
        isOpen = true;
        closingSoon = status.closingSoon;
        break;
      }
    }
  } else if (restaurant.operatingHours) {
    const status = checkTimeWindow(currentMinutes, restaurant.operatingHours);
    isOpen = status.isOpen;
    closingSoon = status.closingSoon;
  }

  if (isOpen && closingSoon) return { text: "Close in 30 minutes", color: "bg-[#FF3D57]" };
  if (isOpen) return { text: "Open", color: "bg-green-600" };
  return { text: "Close", color: "bg-[#FF3D57]" };
}

export default function RestaurantDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: restaurant,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => publicService.getRestaurantById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (restaurant?.name) document.title = `${restaurant.name} | Cravon`;
    else document.title = "Restaurant Menu | Cravon";
  }, [restaurant?.name]);

  if (isLoading) {
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

  if (isError || !restaurant) {
    return <div className="text-center py-20 text-red-500 font-medium">Restaurant not found or is currently inactive.</div>;
  }

  const currentStatus = getRestaurantStatus(restaurant);

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen pb-24">
      {/* Header Banner */}
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

      {/* Menu Section */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          Menu <span className="text-gray-400 text-lg font-normal">({restaurant.menu?.length || 0} items)</span>
        </h2>

        {!restaurant.menu || restaurant.menu.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">This restaurant hasn&apos;t added any menu items yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {restaurant.menu.map((item: any, idx: number) => (
              <div key={item._id || `menu-${idx}`} className="flex justify-between items-start p-6 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-4 h-4 flex items-center justify-center border-2 rounded-sm ${item.isVeg !== false ? "border-green-600" : "border-red-600"}`}>
                      <div className={`w-2 h-2 rounded-full ${item.isVeg !== false ? "bg-green-600" : "bg-red-600"}`}></div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  </div>
                  <p className="font-semibold text-gray-800 mb-2">₹{item.price}</p>
                  {item.description && <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>}
                </div>

                <div className="relative shrink-0 w-30 h-30">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover rounded-xl" />
                  ) : (
                    <div className="w-full h-full bg-orange-50 rounded-xl flex items-center justify-center text-orange-200">
                      <Star className="w-8 h-8 opacity-50" />
                    </div>
                  )}

                  <button type="button" className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] bg-white text-green-600 font-bold border border-gray-200 shadow-md py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase text-sm cursor-pointer">
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
