"use client";

import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

import RestaurantHeader from "@/components/customer/restaurant/RestaurantHeader";
import RestaurantMenu from "@/components/customer/restaurant/RestaurantMenu";
import ReplaceCartModal from "@/components/customer/restaurant/ReplaceCartModal";
import RestaurantSkeleton from "@/components/customer/restaurant/RestaurantSkeleton";
import ReviewSection from "@/components/customer/restaurant/ReviewSection";

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem, items, updateQuantity, replaceCart } = useCartStore();

  const [showReplaceModal, setShowReplaceModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingItem, setPendingItem] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<"menu" | "reviews">("menu");

  const scrollToSection = useCallback((sectionId: "menu" | "reviews") => {
    setActiveSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleScrollToReviews = useCallback(() => {
    scrollToSection("reviews");
  }, [scrollToSection]);

  // ScrollSpy to highlight active section as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const reviewsEl = document.getElementById("reviews");
      if (reviewsEl) {
        const rect = reviewsEl.getBoundingClientRect();
        if (rect.top <= 240) {
          setActiveSection("reviews");
        } else {
          setActiveSection("menu");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if page loaded with #reviews hash
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#reviews") {
      const timer = setTimeout(() => {
        handleScrollToReviews();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [handleScrollToReviews]);

  const {
    data: restaurant,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant", params.id],
    queryFn: () => publicService.getRestaurantById(params.id as string),
    enabled: !!params.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  // Auto-add logic for guests returning from login
  useEffect(() => {
    if (user && restaurant) {
      const pendingStr = localStorage.getItem("pendingCartItem");
      if (pendingStr) {
        try {
          const parsed = JSON.parse(pendingStr);
          if (parsed.restaurantId === restaurant._id) {
            const added = addItem(parsed.item, restaurant._id, restaurant.name);
            if (!added) {
              // eslint-disable-next-line react-hooks/set-state-in-effect
              setPendingItem(parsed.item);
              setShowReplaceModal(true);
            } else {
              toast.success(`${parsed.item.name} added to cart!`);
            }
          }
        } catch (e) {
          console.error(e);
        }
        localStorage.removeItem("pendingCartItem");
      }
    }
  }, [user, restaurant, addItem]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAddToCart = (menuItem: any, quantity: number = 1) => {
    const item = {
      id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: quantity,
      isVeg: menuItem.isVeg,
    };

    if (!user) {
      localStorage.setItem("pendingCartItem", JSON.stringify({ item, restaurantId: restaurant._id }));
      router.push(`/auth/login?redirect=/restaurants/${restaurant._id}`);
      return;
    }

    const added = addItem(item, restaurant._id, restaurant.name);
    if (!added) {
      setPendingItem(item);
      setShowReplaceModal(true);
    } else {
      toast.success("Added to cart");
    }
  };

  const getQuantity = (itemId: string) => {
    return items.find((i) => i.id === itemId)?.quantity || 0;
  };

  useEffect(() => {
    if (restaurant?.name) document.title = `${restaurant.name} | Cravon`;
    else document.title = "Restaurant Menu | Cravon";
  }, [restaurant?.name]);

  if (isLoading || !restaurant) {
    return <RestaurantSkeleton />;
  }

  if (isError || !restaurant) {
    return <div className="text-center py-20 text-red-500 font-medium">Restaurant not found or is currently inactive.</div>;
  }

  return (
    <div className="bg-white text-gray-900 font-sans min-h-screen pb-24">
      <RestaurantHeader restaurant={restaurant} onViewReviews={handleScrollToReviews} />

      {/* Sticky Quick-Jump Navigation Bar */}
      <div className="sticky top-0 md:top-16 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
        <div className="max-w-4xl mx-auto px-6 flex items-center gap-6 md:gap-8">
          <button type="button" onClick={() => scrollToSection("menu")} className={`py-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeSection === "menu" ? "border-[#FF3D57] text-[#FF3D57]" : "border-transparent text-gray-500 hover:text-gray-900"}`}>
            <span>🍽️ Menu</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">{restaurant.menu?.length || 0}</span>
          </button>

          <button type="button" onClick={() => scrollToSection("reviews")} className={`py-4 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeSection === "reviews" ? "border-[#FF3D57] text-[#FF3D57]" : "border-transparent text-gray-500 hover:text-gray-900"}`}>
            <span>⭐ Reviews & Ratings</span>
            {restaurant.reviewCount && restaurant.reviewCount > 0 ? <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">{restaurant.reviewCount}</span> : null}
          </button>
        </div>
      </div>

      {/* Menu Section */}
      <section id="menu" className="scroll-mt-32">
        <RestaurantMenu restaurant={restaurant} getQuantity={getQuantity} updateQuantity={updateQuantity} handleAddToCart={handleAddToCart} />
      </section>

      {/* Review Section (Same Continuous Page) */}
      <ReviewSection restaurantId={restaurant._id} restaurantName={restaurant.name} />

      {showReplaceModal && (
        <ReplaceCartModal
          pendingItem={pendingItem}
          restaurant={restaurant}
          replaceCart={replaceCart}
          onClose={() => {
            setShowReplaceModal(false);
            setPendingItem(null);
          }}
        />
      )}
    </div>
  );
}
