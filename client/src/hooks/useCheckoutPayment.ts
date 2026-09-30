import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axiosInstance from "@/lib/axios";
import { loadRazorpay } from "@/lib/razorpay";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

interface PaymentOptions {
  selectedAddressIndex: number;
  paymentMethod: "online" | "cod";
  setIsProcessing: (isProcessing: boolean) => void;
}

export function useCheckoutPayment() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, restaurantId, restaurantName, clearCart } = useCartStore();

  const handlePayment = async ({ selectedAddressIndex, paymentMethod, setIsProcessing }: PaymentOptions) => {
    if (!user?.addresses || user.addresses.length === 0) {
      return toast.error("Please add a delivery address in your profile first.");
    }

    setIsProcessing(true);
    const selectedAddress = user.addresses[selectedAddressIndex];

    try {
      // 1. Create Order on Backend
      const res = await axiosInstance.post("/orders/create", {
        restaurantId,
        items: items.map((i) => ({ menuItemId: i.id, name: i.name, quantity: i.quantity })),
        deliveryAddress: {
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
        },
        paymentMethod,
      });

      const orderData = res.data.data;

      // ── COD Flow ──
      if (paymentMethod === "cod") {
        toast.success("Order placed successfully! Pay on delivery.");
        clearCart();
        router.push("/orders");
        return;
      }

      // ── Online (Razorpay) Flow ──
      const { razorpayOrderId, amount, currency } = orderData;

      // Load Razorpay
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // Open Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Cravon",
        description: `Order from ${restaurantName}`,
        order_id: razorpayOrderId,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          try {
            // Verify Payment on Backend
            await axiosInstance.post("/orders/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful! Order placed.");
            clearCart();
            router.push("/orders");
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
          color: "#FF7A30",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.error("Payment cancelled");
          },
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

  return { handlePayment };
}
