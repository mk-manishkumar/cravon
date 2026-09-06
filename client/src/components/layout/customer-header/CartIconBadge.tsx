"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";

export default function CartIconBadge() {
  const [mounted, setMounted] = useState(false);
  const cartItemCount = useCartStore((state) => state.items.length);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <Link href="/checkout" className="relative flex items-center gap-2 text-gray-700 hover:text-[#FF3D57] transition-colors">
      <div className="relative">
        <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
        {mounted && cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-[#FF3D57] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartItemCount}</span>}
      </div>
      <span className="hidden sm:block font-bold text-[14px]">Cart</span>
    </Link>
  );
}
