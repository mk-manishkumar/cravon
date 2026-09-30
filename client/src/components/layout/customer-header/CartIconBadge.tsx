"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";

export default function CartIconBadge() {
  const [mounted, setMounted] = useState(false);
  const cartItemCount = useCartStore((state) => state.items.length);

  const cartItems = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const restaurantName = useCartStore((state) => state.restaurantName);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div className="relative group">
      <Link href="/checkout" className="relative flex items-center gap-2 text-gray-700 hover:text-[#FF3D57] transition-colors py-2">
        <div className="relative">
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          {mounted && cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-[#FF3D57] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartItemCount}</span>}
        </div>
        <span className="hidden sm:block font-bold text-[14px]">Cart</span>
      </Link>

      {/* Hover Dropdown */}
      {mounted && (
        <div className="absolute top-full right-0 pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div className="bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden transform origin-top-right scale-95 group-hover:scale-100 transition-all duration-200">
            {cartItems.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-sm">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-20" />
                Your cart is empty
              </div>
            ) : (
              <div className="flex flex-col max-h-[60vh]">
                <div className="p-3 border-b border-gray-100 bg-gray-50">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Order</p>
                  <p className="text-sm font-bold text-gray-900 truncate">{restaurantName}</p>
                </div>
                <div className="p-3 overflow-y-auto flex flex-col gap-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 flex shrink-0 items-center justify-center border rounded-sm ${item.isVeg !== false ? "border-green-600" : "border-red-600"}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg !== false ? "bg-green-600" : "bg-red-600"}`}></div>
                          </div>
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                        </div>
                        <p className="text-xs text-gray-500 ml-4.5 mt-0.5">₹{item.price} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900 shrink-0">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-gray-700">Subtotal</span>
                    <span className="text-lg font-black text-gray-900">₹{getSubtotal()}</span>
                  </div>
                  <Link href="/checkout" className="block w-full py-2.5 bg-[#FF3D57] hover:bg-[#E6374E] text-white text-center font-bold rounded-lg transition-colors shadow-sm text-sm">
                    PROCEED TO CHECKOUT
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
