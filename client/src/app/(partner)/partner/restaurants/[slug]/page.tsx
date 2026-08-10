"use client";

import { useQuery } from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurant.service";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DashboardMenuDisplay from "../components/DashboardMenuDisplay";

export default function RestaurantMenuPage() {
  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["myRestaurant"],
    queryFn: async () => {
      const response = await restaurantService.getMyRestaurant();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7A30]"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex-1 p-8 text-white max-w-5xl mx-auto w-full">
        <p className="text-red-500">Restaurant not found.</p>
        <Link href="/partner/restaurants" className="text-[#FF7A30] hover:underline mt-4 inline-block">Back to Restaurants</Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 text-white max-w-5xl mx-auto w-full">
      <div className="mb-6">
        <Link href="/partner/restaurants" className="inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#FF7A30] transition-colors">
          <ArrowLeft size={16} /> Back to Restaurants
        </Link>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{restaurant.name} Menu</h1>
          <p className="text-[#888] mt-1">Manage and view all menu items</p>
        </div>
      </div>

      {restaurant.menu && restaurant.menu.length > 0 ? (
        <DashboardMenuDisplay menu={restaurant.menu} />
      ) : (
        <div className="bg-[#111] border border-[#222] rounded-3xl p-12 text-center mt-6">
          <p className="text-[#888]">No menu items found for this restaurant.</p>
        </div>
      )}
    </div>
  );
}
