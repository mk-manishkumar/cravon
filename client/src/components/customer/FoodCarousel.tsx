"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface FoodCarouselProps {
  readonly title: string;
  readonly filter: "veg" | "nonveg" | "franchise";
}

export default function FoodCarousel({ title, filter }: Readonly<FoodCarouselProps>) {
  const { data: foods, isLoading } = useQuery({
    queryKey: ["exploreFoods", filter],
    queryFn: () => publicService.exploreFoods(filter),
  });

  const { addItem, items, updateQuantity, replaceCart } = useCartStore();

  const getQuantity = (itemId: string) => {
    return items.find((i) => i.id === itemId)?.quantity || 0;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddToCart = (food: any) => {
    const item = {
      id: food._id,
      name: food.name,
      price: food.price,
      quantity: 1,
      isVeg: food.isVeg,
    };

    const added = addItem(item, food.restaurantId, food.restaurantName);
    if (!added) {
      if (window.confirm("Your cart contains items from another restaurant. Clear cart and add this item?")) {
        replaceCart(item, food.restaurantId, food.restaurantName);
        toast.success("Cart replaced");
      }
    } else {
      toast.success("Added to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!foods || foods.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 px-6 max-w-7xl mx-auto">{title}</h2>
      
      {/* Horizontal carousel */}
      <div className="flex overflow-x-auto gap-6 px-6 pb-6 snap-x hide-scrollbar max-w-7xl mx-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {foods.map((food: any) => (
          <div key={food._id} className="snap-start shrink-0 w-65 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
            <div className="relative w-full h-40 bg-gray-50">
              {food.image ? (
                <Image src={food.image} alt={food.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-orange-200">
                  <Star className="w-8 h-8 opacity-50" />
                </div>
              )}
              
              {/* Veg/Non-Veg Icon overlay */}
              <div className="absolute top-3 left-3 bg-white p-1 rounded shadow-sm">
                <div className={`w-3 h-3 flex items-center justify-center border rounded-sm ${food.isVeg !== false ? "border-green-600" : "border-red-600"}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${food.isVeg !== false ? "bg-green-600" : "bg-red-600"}`}></div>
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col grow">
              <h3 className="font-bold text-gray-900 line-clamp-1 mb-1" title={food.name}>{food.name}</h3>
              <p className="font-semibold text-gray-800 mb-2">₹{food.price}</p>
              
              {/* Restaurant Name */}
              <p className="text-xs text-gray-500 line-clamp-1 mb-4 mt-auto">
                By {food.restaurantName}
              </p>

              {/* Add Button */}
              <div className="mt-auto">
                {getQuantity(food._id) > 0 ? (
                  <div className="w-full bg-[#FF7A30] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(255,122,48,0.3)] flex items-center justify-between overflow-hidden">
                    <button type="button" onClick={() => updateQuantity(food._id, -1)} className="px-4 py-1.5 hover:bg-black/10 cursor-pointer text-lg leading-none transition-colors">-</button>
                    <span className="text-sm font-bold">{getQuantity(food._id)}</span>
                    <button type="button" onClick={() => updateQuantity(food._id, 1)} className="px-4 py-1.5 hover:bg-black/10 cursor-pointer text-lg leading-none transition-colors">+</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => handleAddToCart(food)} className="w-full cursor-pointer bg-[#FF7A30] hover:bg-[#FF8E4D] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(255,122,48,0.3)] transition-transform active:scale-[0.98] py-1.5 uppercase text-sm">
                    ADD
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
