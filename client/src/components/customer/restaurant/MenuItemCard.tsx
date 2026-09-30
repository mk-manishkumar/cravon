"use client";

import Image from "next/image";
import { Star, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { MenuItemType } from "./RestaurantMenu";

interface MenuItemCardProps {
  item: MenuItemType;
  handleAddToCart: (item: MenuItemType, quantity?: number) => void;
}

export default function MenuItemCard({ item, handleAddToCart }: Readonly<MenuItemCardProps>) {
  const [count, setCount] = useState(1);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => Math.max(1, c - 1));

  const onAdd = () => {
    handleAddToCart(item, count);
    setCount(1);
  };

  return (
    <div id={`food-${item._id}`} className="flex justify-between items-stretch p-6 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow scroll-mt-24">
      <div className="flex-1 pr-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-4 h-4 flex items-center justify-center border-2 rounded-sm ${item.isVeg !== false ? "border-green-600" : "border-red-600"}`}>
              <div className={`w-2 h-2 rounded-full ${item.isVeg !== false ? "bg-green-600" : "bg-red-600"}`}></div>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <p className="font-semibold text-gray-800">₹{item.price}</p>
            {item.rating && (
              <div className="flex items-center gap-1 bg-orange-50 px-1.5 py-0.5 rounded text-orange-700">
                <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                <span className="text-xs font-bold">{item.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          {item.description && <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center border border-[#FF7A30] rounded-xl overflow-hidden h-9 w-27.5 shrink-0">
            <button type="button" onClick={decrement} className="cursor-pointer h-full flex-1 flex items-center justify-center text-[#FF7A30] hover:bg-orange-50 transition-colors">
              <Minus size={16} strokeWidth={3} />
            </button>
            <span className="text-sm font-bold w-6 text-center flex items-center justify-center h-full leading-none">{count}</span>
            <button type="button" onClick={increment} className="cursor-pointer h-full flex-1 flex items-center justify-center text-[#FF7A30] hover:bg-orange-50 transition-colors">
              <Plus size={16} strokeWidth={3} />
            </button>
          </div>
          <button type="button" onClick={onAdd} className="cursor-pointer h-9 px-6 bg-[#FF7A30] hover:bg-[#FF8E4D] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(255,122,48,0.3)] transition-transform active:scale-[0.98] text-sm uppercase flex items-center justify-center">
            ADD
          </button>
        </div>
      </div>

      <div className="shrink-0 w-36 relative overflow-hidden rounded-xl">
        {item.image ? (
          <Image src={item.image} alt={item.name} fill sizes="144px" className="object-cover" />
        ) : (
          <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-200">
            <Star className="w-8 h-8 opacity-50" />
          </div>
        )}
      </div>
    </div>
  );
}
