"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import FoodCarouselCard from "./FoodCarouselCard";
import { publicService } from "@/services/public.service";
import { useLocationStore } from "@/store/locationStore";
import { useRef, useEffect } from "react";

interface FoodCarouselProps {
  readonly title: string;
  readonly filter: "veg" | "nonveg" | "franchise";
}

export default function FoodCarousel({ title, filter }: FoodCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { city } = useLocationStore();

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 800; // Scroll by roughly 3 cards
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const { data: foods, isLoading } = useQuery({
    queryKey: ["exploreFoods", filter, city],
    queryFn: () => publicService.exploreFoods(filter, city),
  });

  useEffect(() => {
    if (!foods || foods.length === 0) return;

    const intervalId = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        const scrollAmount = 800;

        // If we've reached the end, snap back to the start smoothly
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainerRef.current.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        } else {
          // Otherwise keep scrolling right
          scrollContainerRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      }
    }, 4000); // 4 seconds per auto-scroll

    return () => clearInterval(intervalId);
  }, [foods]);

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!foods || foods.length === 0) return null;

  return (
    <div className="mb-12 relative">
      <div className="flex justify-between items-center mb-6 px-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

        {/* Desktop Scroll Buttons */}
        <div className="hidden md:flex gap-2">
          <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Horizontal carousel */}
      <div ref={scrollContainerRef} className="flex overflow-x-auto gap-6 px-6 pb-6 snap-x hide-scrollbar max-w-7xl mx-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {foods.map((food: any) => (
          <FoodCarouselCard key={food._id} food={food} filter={filter} />
        ))}
      </div>
    </div>
  );
}
