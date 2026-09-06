"use client";

import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { publicService } from "@/services/public.service";
import axiosInstance from "@/lib/axios";
import { loadRazorpay } from "@/lib/razorpay";

import { getRestaurantStatus } from "@/utils/restaurantUtils";

import CheckoutAccountBox from "@/components/customer/checkout/CheckoutAccountBox";
import CheckoutAddressBox from "@/components/customer/checkout/CheckoutAddressBox";
import CheckoutPaymentBox from "@/components/customer/checkout/CheckoutPaymentBox";
import CheckoutCartSummary from "@/components/customer/checkout/CheckoutCartSummary";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, restaurantId, restaurantName, updateQuantity, clearCart, getSubtotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!user) {
      router.push("/auth/login?redirect=/checkout");
    }
  }, [user, router]);

  const { data: restaurant, isLoading: isRestaurantLoading } = useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => publicService.getRestaurantById(restaurantId as string),
    enabled: !!restaurantId,
  });

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-64 h-64 relative mb-6">
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-400">Empty Cart</div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-sm">You can go to home page to view more restaurants</p>
        <button onClick={() => router.push("/")} className="bg-orange-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors uppercase text-sm">
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

  const handlePayment = async () => {
    if (!user?.addresses || user.addresses.length === 0) {
      return toast.error("Please add a delivery address in your profile first.");
    }

    setIsProcessing(true);
    const selectedAddress = user.addresses[selectedAddressIndex];

    try {
      // 1. Create Order on Backend
      const res = await axiosInstance.post("/orders/create", {
        restaurantId,
        items: items.map((i) => ({ menuItemId: i.id, quantity: i.quantity })),
        deliveryAddress: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
        },
      });

      const { razorpayOrderId, amount, currency } = res.data.data;

      // 2. Load Razorpay
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // 3. Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Cravon",
        description: `Order from ${restaurantName}`,
        order_id: razorpayOrderId,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            // 4. Verify Payment on Backend
            await axiosInstance.post("/orders/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful! Order placed.");
            clearCart();
            router.push("/orders"); // Assuming there will be an orders page
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Payment verification failed.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.phone || "",
        },
        theme: {
          color: "#f97316", // Orange-500
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Razorpay = (window as any).Razorpay;
      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function () {
        toast.error("Payment failed or cancelled.");
        setIsProcessing(false);
      });

      rzp1.open();
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = error as any;
      toast.error(err.response?.data?.message || err.message || "Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e9ecee] py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Account, Address, Payment */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <CheckoutAccountBox user={user} />
          <CheckoutAddressBox user={user} selectedAddressIndex={selectedAddressIndex} setSelectedAddressIndex={setSelectedAddressIndex} />
          <CheckoutPaymentBox isRestaurantLoading={isRestaurantLoading} isRestaurantOpen={isRestaurantOpen} isProcessing={isProcessing} user={user} grandTotal={grandTotal} handlePayment={handlePayment} />
        </div>

        {/* RIGHT COLUMN: Cart Summary */}
        <div className="lg:col-span-4">
          <CheckoutCartSummary restaurant={restaurant} restaurantName={restaurantName} items={items} subtotal={subtotal} deliveryFee={deliveryFee} taxes={taxes} grandTotal={grandTotal} updateQuantity={updateQuantity} />
        </div>
      </div>
    </div>
  );
}
