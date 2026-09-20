"use client";

import { useState } from "react";
import { Search, MapPin, Star, ChefHat, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import Link from "next/link";

import { useLocationStore } from "@/store/locationStore";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const { city } = useLocationStore();

  const { data: results, isLoading, isFetching } = useQuery({
    queryKey: ["restaurantSearch", debouncedQuery, city],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      let url = `/public/search?q=${encodeURIComponent(debouncedQuery)}`;
      if (city && city !== "Select City") url += `&city=${encodeURIComponent(city)}`;
      const res = await api.get(url);
      return res.data?.data || [];
    },
    enabled: debouncedQuery.length > 0,
  });

  const renderDropdownContent = () => {
    if (isLoading || isFetching) {
      return (
        <div className="p-8 text-center text-gray-500 flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
          <p>Searching for deliciousness...</p>
        </div>
      );
    }

    if (results?.length > 0) {
      return (
        <div className="flex flex-col">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100 text-sm font-bold text-gray-500 uppercase tracking-wider">
            Restaurants & Dishes
          </div>
          <div className="divide-y divide-gray-50">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {results.map((restaurant: any) => (
              <Link
                key={restaurant._id}
                href={`/restaurants/${restaurant._id}`}
                className="flex items-center gap-4 p-5 hover:bg-orange-50 transition-colors group cursor-pointer"
              >
                {restaurant.image ? (
                  <Image src={restaurant.image} alt={restaurant.name} width={64} height={64} className="w-16 h-16 rounded-xl object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors truncate">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    {restaurant.rating > 0 && (
                      <span className="flex items-center gap-1 font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {restaurant.rating}
                      </span>
                    )}
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5" />
                      {restaurant.address || "No address"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-900 font-bold text-lg">No results found</p>
        <p className="text-gray-500 mt-1">Try searching for a different restaurant or dish</p>
      </div>
    );
  };

  return (
    <div className="relative w-full z-50 flex-1">
      <div className="relative flex items-center bg-gray-100 hover:bg-gray-200/80 rounded-xl overflow-hidden border border-transparent focus-within:border-orange-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(255,122,48,0.1)] transition-all h-10.5">
        <div className="pl-4 text-gray-500">
          <Search className="w-4.5 h-4.5" />
        </div>
        <input
          type="text"
          className="w-full h-full py-2 px-3 text-[14px] outline-none text-gray-800 placeholder-gray-500 bg-transparent"
          placeholder="Search for restaurants or dishes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button onClick={() => setQuery("")} className="pr-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden max-h-[60vh] overflow-y-auto">
          {renderDropdownContent()}
        </div>
      )}
    </div>
  );
}
