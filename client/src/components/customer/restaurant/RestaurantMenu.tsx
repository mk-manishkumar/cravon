"use client";

import Image from "next/image";
import { Star, Plus, Minus } from "lucide-react";
import { useState } from "react";

export interface MenuItemType {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  isVeg?: boolean;
}

export interface RestaurantType {
  _id?: string;
  name?: string;
  menu?: MenuItemType[];
}

interface RestaurantMenuProps {
  restaurant: RestaurantType;
  getQuantity: (itemId: string) => number;
  updateQuantity: (itemId: string, delta: number) => void;
  handleAddToCart: (menuItem: MenuItemType, quantity?: number) => void;
}

interface MenuItemCardProps {
  item: MenuItemType;
  handleAddToCart: (item: MenuItemType, quantity?: number) => void;
}

function MenuItemCard({ item, handleAddToCart }: Readonly<MenuItemCardProps>) {
  const [count, setCount] = useState(1);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => Math.max(1, c - 1));

  const onAdd = () => {
    handleAddToCart(item, count);
    setCount(1);
  };

  return (
    <div className="flex justify-between items-stretch p-6 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
      <div className="flex-1 pr-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-4 h-4 flex items-center justify-center border-2 rounded-sm ${item.isVeg !== false ? "border-green-600" : "border-red-600"}`}>
              <div className={`w-2 h-2 rounded-full ${item.isVeg !== false ? "bg-green-600" : "bg-red-600"}`}></div>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
          </div>
          <p className="font-semibold text-gray-800 mb-2">₹{item.price}</p>
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
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-200">
            <Star className="w-8 h-8 opacity-50" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function RestaurantMenu({ restaurant, handleAddToCart }: Readonly<RestaurantMenuProps>) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        Menu <span className="text-gray-400 text-lg font-normal">({restaurant.menu?.length || 0} items)</span>
      </h2>

      {!restaurant.menu || restaurant.menu.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">This restaurant hasn&apos;t added any menu items yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurant.menu.map((item: MenuItemType, idx: number) => (
            <MenuItemCard key={item._id || `menu-${idx}`} item={item} handleAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
