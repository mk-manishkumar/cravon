import { CreditCard, Clock } from "lucide-react";
import { User as AuthUser } from "@/store/authStore";

interface CheckoutPaymentBoxProps {
  isRestaurantLoading: boolean;
  isRestaurantOpen: boolean;
  isProcessing: boolean;
  user: AuthUser | null;
  grandTotal: number;
  handlePayment: () => void;
}

export default function CheckoutPaymentBox({
  isRestaurantLoading,
  isRestaurantOpen,
  isProcessing,
  user,
  grandTotal,
  handlePayment,
}: Readonly<CheckoutPaymentBoxProps>) {
  let paymentContent;
  if (isRestaurantLoading) {
    paymentContent = <div className="animate-pulse h-12 bg-gray-200 rounded-lg w-full"></div>;
  } else if (!isRestaurantOpen) {
    paymentContent = (
      <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg font-medium flex items-center gap-2">
        <Clock className="w-5 h-5" /> Restaurant is currently closed. You cannot proceed to pay.
      </div>
    );
  } else {
    paymentContent = (
      <button
        onClick={handlePayment}
        disabled={isProcessing || !user?.addresses || user.addresses.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl text-lg uppercase tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? "Processing..." : `Proceed to Pay (₹${grandTotal})`}
      </button>
    );
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="bg-black text-white p-2 rounded flex items-center justify-center">
          <CreditCard className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Details</h2>
          <p className="text-sm text-gray-500 mb-6">Pay securely via Razorpay (UPI, Cards, NetBanking)</p>
          {paymentContent}
        </div>
      </div>
    </div>
  );
}
