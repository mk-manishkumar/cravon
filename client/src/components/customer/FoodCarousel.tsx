"use client";

import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRef, useState } from "react";

interface FoodCarouselProps {
  readonly title: string;
  readonly filter: "veg" | "nonveg" | "franchise";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FoodCarouselCard({ food, handleAddToCart }: Readonly<{ food: any; handleAddToCart: (food: any, quantity?: number) => void }>) {
  const [count, setCount] = useState(1);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => Math.max(1, c - 1));

  const onAdd = () => {
    handleAddToCart(food, count);
    setCount(1);
  };

  return (
    <div className="snap-start shrink-0 w-65 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
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
        <h3 className="font-bold text-gray-900 line-clamp-1 mb-1" title={food.name}>
          {food.name}
        </h3>
        <p className="font-semibold text-gray-800 mb-2">₹{food.price}</p>

        {/* Restaurant Name */}
        <p className="text-xs text-gray-500 line-clamp-1 mb-4 mt-auto">By {food.restaurantName}</p>

        {/* Add Button & Counter */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center border border-[#FF7A30] rounded-xl overflow-hidden h-9 w-27.5 shrink-0">
            <button type="button" onClick={decrement} className="cursor-pointer h-full flex-1 flex items-center justify-center text-[#FF7A30] hover:bg-orange-50 transition-colors">
              <Minus size={16} strokeWidth={3} />
            </button>
            <span className="text-sm font-bold w-6 text-center flex items-center justify-center h-full leading-none">{count}</span>
            <button type="button" onClick={increment} className="cursor-pointer h-full flex-1 flex items-center justify-center text-[#FF7A30] hover:bg-orange-50 transition-colors">
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
          <button type="button" onClick={onAdd} className="cursor-pointer h-9 flex-1 bg-[#FF7A30] hover:bg-[#FF8E4D] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(255,122,48,0.3)] transition-transform active:scale-[0.98] text-sm uppercase flex items-center justify-center">
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FoodCarousel({ title, filter }: FoodCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuthStore();

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
    queryKey: ["exploreFoods", filter],
    queryFn: () => publicService.exploreFoods(filter),
  });

  const { addItem, replaceCart } = useCartStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddToCart = (food: any, quantity: number = 1) => {
    const item = {
      id: food._id,
      name: food.name,
      price: food.price,
      quantity: quantity,
      isVeg: food.isVeg,
    };

    if (!user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem("pendingCartItem", JSON.stringify({ item, restaurantId: food.restaurantId }));
      }
      router.push(`/auth/login?redirect=/restaurants/${food.restaurantId}`);
      return;
    }

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
    <div className="mb-12 relative group">
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
          <FoodCarouselCard key={food._id} food={food} handleAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  );
}
