"use client";

import { useEffect } from "react";
import MenuItemCard from "./MenuItemCard";

export interface MenuItemType {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  isVeg?: boolean;
  rating?: number;
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

export default function RestaurantMenu({ restaurant, handleAddToCart }: Readonly<RestaurantMenuProps>) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
    }
  }, [restaurant]);

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

