"use client";

import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

import RestaurantHeader from "@/components/customer/restaurant/RestaurantHeader";
import RestaurantMenu from "@/components/customer/restaurant/RestaurantMenu";
import ReplaceCartModal from "@/components/customer/restaurant/ReplaceCartModal";
import RestaurantSkeleton from "@/components/customer/restaurant/RestaurantSkeleton";

export default function RestaurantPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem, items, updateQuantity, replaceCart } = useCartStore();

  const [showReplaceModal, setShowReplaceModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingItem, setPendingItem] = useState<any>(null);

  const {
    data: restaurant,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant", params.id],
    queryFn: () => publicService.getRestaurantById(params.id as string),
    enabled: !!params.id,
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
  const handleAddToCart = (menuItem: any) => {
    const item = {
      id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: 1,
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
      <RestaurantHeader restaurant={restaurant} />

      <RestaurantMenu restaurant={restaurant} getQuantity={getQuantity} updateQuantity={updateQuantity} handleAddToCart={handleAddToCart} />

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
