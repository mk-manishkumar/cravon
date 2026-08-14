"use client";

import { useState } from "react";
import { Check, Sparkles, Zap, Building2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { loadRazorpay } from "@/utils/loadRazorpay";
import { paymentService } from "@/services/payment.service";

const TIERS = [
  {
    id: "free",
    name: "Starter",
    price: "₹0",
    description: "Perfect for new partners testing the waters.",
    features: ["Up to 3 Restaurant Listings", "No staff accounts", "Basic Analytics", "Standard Support"],
    icon: <Sparkles className="w-6 h-6 text-[#888]" />,
    buttonText: "Current Plan",
    popular: false,
  },
  {
    id: "mid",
    name: "Professional",
    price: "₹4,000",
    period: "/month",
    description: "Ideal for growing businesses with multiple locations.",
    features: ["Up to 50 Restaurant Listings", "3 Staff Accounts", "Advanced Analytics", "Priority Support", "Custom Branding"],
    icon: <Zap className="w-6 h-6 text-[#FF7A30]" />,
    buttonText: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "advanced",
    name: "Enterprise",
    price: "₹8,000",
    period: "/month",
    description: "For large scale operations and franchises.",
    features: ["Up to 100 Restaurant Listings", "10 Staff Accounts", "Enterprise Analytics", "24/7 Dedicated Support", "Custom Branding", "API Access"],
    icon: <Building2 className="w-6 h-6 text-white" />,
    buttonText: "Upgrade to Enterprise",
    popular: false,
  },
];

export default function PricingPage() {
  const user = useAuthStore((state) => state.user);
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string) => {
    if (tierId === "free") return; // Already on free

    try {
      setLoadingTier(tierId);
      const res = await loadRazorpay();

      if (!res) {
        toast.error("Razorpay SDK failed to load. Check your connection.");
        return;
      }

      // 1. Create order on server
      const orderResponse = await paymentService.createOrder(tierId);
      const order = orderResponse.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
        amount: order.amount,
        currency: order.currency,
        name: "Cravon Partners",
        description: `Upgrade to ${tierId === "mid" ? "Professional" : "Enterprise"} Plan`,
        order_id: order.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              tierId,
            });
            toast.success("Payment successful! Your account has been upgraded.");
            // Optionally reload or invalidate queries here
            window.location.reload();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Payment verification failed");
          }
        },
        prefill: {
          name: user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "",
          email: user?.email || "",
        },
        theme: {
          color: "#FF7A30",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp1 = new (window as any).Razorpay(options);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp1.on("payment.failed", function (response: any) {
        toast.error(`Payment Failed: ${response.error.description}`);
      });

      rzp1.open();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="flex-1 p-8 text-white max-w-7xl mx-auto w-full">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
        <p className="text-xl text-[#888]">Choose the plan that fits your business needs. Upgrade anytime as you grow.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {TIERS.map((tier) => {
          let buttonClass = "bg-white text-black hover:bg-gray-200";
          if (tier.popular) {
            buttonClass = "bg-[#FF7A30] text-white hover:bg-[#FF7A30]/90 hover:shadow-[0_0_20px_rgba(255,122,48,0.3)]";
          } else if (tier.id === "free") {
            buttonClass = "bg-[#222] text-[#888] cursor-not-allowed";
          }

          return (
            <div key={tier.id} className={`relative flex flex-col p-8 rounded-3xl border transition-all duration-300 ${tier.popular ? "bg-linear-to-b from-[#FF7A30]/10 to-[#111] border-[#FF7A30] shadow-[0_0_40px_rgba(255,122,48,0.15)] scale-105 z-10" : "bg-[#111] border-[#222] hover:border-[#333]"}`}>
              {tier.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF7A30] text-white text-xs font-bold rounded-full uppercase tracking-wider">Most Popular</div>}

              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl ${tier.popular ? "bg-[#FF7A30]/20" : "bg-[#222]"}`}>{tier.icon}</div>
                <h3 className="text-2xl font-bold">{tier.name}</h3>
              </div>

              <p className="text-[#888] text-sm mb-6 min-h-10">{tier.description}</p>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.period && <span className="text-[#888] font-medium">{tier.period}</span>}
              </div>

              <button type="button" onClick={() => handleSubscribe(tier.id)} disabled={tier.id === "free" || loadingTier === tier.id} className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center ${buttonClass}`}>
                {loadingTier === tier.id ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : tier.buttonText}
              </button>

              <div className="mt-8 pt-8 border-t border-[#222] flex-1">
                <p className="font-semibold mb-4">What&apos;s included:</p>
                <ul className="space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-[#ccc]">
                      <Check className={`w-5 h-5 shrink-0 ${tier.popular ? "text-[#FF7A30]" : "text-white"}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
