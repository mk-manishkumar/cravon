"use client";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import { getRestaurantStatus } from "@/utils/restaurantUtils";
import { useCheckoutPayment } from "@/hooks/useCheckoutPayment";
import CheckoutAccountBox from "@/components/customer/checkout/CheckoutAccountBox";
import CheckoutAddressBox from "@/components/customer/checkout/CheckoutAddressBox";
import CheckoutPaymentBox from "@/components/customer/checkout/CheckoutPaymentBox";
import CheckoutCartSummary from "@/components/customer/checkout/CheckoutCartSummary";

type PaymentMethod = "online" | "cod";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { items, restaurantId, restaurantName, updateQuantity, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const { handlePayment: processPayment } = useCheckoutPayment();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!isAuthLoading && !user) router.push("/auth/login?redirect=/checkout");
  }, [user, isAuthLoading, router]);

  const { data: restaurant, isLoading: isRestaurantLoading } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => publicService.getRestaurantById(restaurantId as string),
    enabled: !!restaurantId,
  });

  if (!mounted || isAuthLoading || !user) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-64 h-64 relative mb-6">
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">Empty Cart</div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">You can go to home page to view more restaurants</p>
        <button onClick={() => router.push("/")} className="bg-orange-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors uppercase text-sm cursor-pointer">
          See Restaurants near you
        </button>
      </div>
    );
  }

  const isRestaurantOpen = restaurant ? getRestaurantStatus(restaurant).isOpen : false;
  const subtotal = getSubtotal();
  const deliveryFee = 40;
  const taxes = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + deliveryFee + taxes;

  // Handle payment
  const handlePayment = () => processPayment({ selectedAddressIndex, paymentMethod, setIsProcessing });

  return (
    <div className="min-h-screen bg-[#e9ecee] py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Account, Address, Payment */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <CheckoutAccountBox user={user} />
          <CheckoutAddressBox user={user} selectedAddressIndex={selectedAddressIndex} setSelectedAddressIndex={setSelectedAddressIndex} />
          <CheckoutPaymentBox isRestaurantLoading={isRestaurantLoading} isRestaurantOpen={isRestaurantOpen} isProcessing={isProcessing} user={user} grandTotal={grandTotal} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} handlePayment={handlePayment} />
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-4">
          <CheckoutCartSummary restaurant={restaurant} restaurantName={restaurantName} items={items} subtotal={subtotal} deliveryFee={deliveryFee} taxes={taxes} grandTotal={grandTotal} updateQuantity={updateQuantity} />
        </div>
      </div>
    </div>
  );
}
