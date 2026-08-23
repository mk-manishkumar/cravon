"use client";

import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { Star, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Restaurant = {
  _id: string;
  name: string;
  image?: string;
  rating?: number;
  deliveryTime?: number;
  address?: string;
  // you can add cuisines later
};

export default function RestaurantGrid() {
  const {
    data: restaurants,
    isLoading,
    isError,
  } = useQuery<Restaurant[]>({
    queryKey: ["active-restaurants"],
    queryFn: publicService.getActiveRestaurants,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {["skel-1", "skel-2", "skel-3", "skel-4", "skel-5", "skel-6", "skel-7", "skel-8"].map((id) => (
          <div key={id} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-2xl mb-4"></div>
            <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-10 text-red-500">Failed to load restaurants. Please try again later.</div>;
  }

  if (!restaurants || restaurants.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No restaurants found</h3>
        <p className="text-gray-500">We are currently onboarding partners. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {restaurants.map((restaurant) => (
        <Link key={restaurant._id} href={`/restaurants/${restaurant._id}`} className="group cursor-pointer flex flex-col gap-3">
          <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-sm">
            {restaurant.image ? <Image src={restaurant.image} alt={restaurant.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-300">No Image</div>}

            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="px-1">
            <h3 className="text-lg font-bold text-gray-900 truncate">{restaurant.name}</h3>

            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 bg-green-600 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                <Star className="w-3 h-3 fill-white" />
                <span>{restaurant.rating && restaurant.rating > 0 ? restaurant.rating.toFixed(1) : "New"}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime || "30-40"} mins</span>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-1 truncate">{restaurant.address || "Local Area"}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
