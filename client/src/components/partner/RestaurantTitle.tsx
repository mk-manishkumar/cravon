"use client";

import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";

export default function RestaurantTitle({ restaurantId }: Readonly<{ restaurantId: string }>) {
  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => publicService.getRestaurantById(restaurantId),
  });

  if (isLoading) {
    return <div className="h-9 w-64 bg-[#222] animate-pulse rounded-md mb-6"></div>;
  }

  return (
    <h1 className="text-3xl font-bold text-white mb-6">
      {restaurant?.name || "Restaurant Dashboard"}
    </h1>
  );
}
