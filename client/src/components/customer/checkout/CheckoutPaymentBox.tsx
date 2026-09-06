import { CreditCard, Clock, Banknote } from "lucide-react";
import { User as AuthUser } from "@/store/authStore";

type PaymentMethod = "online" | "cod";

interface CheckoutPaymentBoxProps {
  isRestaurantLoading: boolean;
  isRestaurantOpen: boolean;
  isProcessing: boolean;
  user: AuthUser | null;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  handlePayment: () => void;
}

function SelectedIndicator() {
  return (
    <div className="ml-auto w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}

function PaymentOption({ method, selected, icon, title, description, setPaymentMethod }: Readonly<{ method: PaymentMethod; selected: boolean; icon: React.ReactNode; title: string; description: string; setPaymentMethod: (method: PaymentMethod) => void }>) {
  return (
    <button type="button" onClick={() => setPaymentMethod(method)} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${selected ? "border-green-500 bg-green-50 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"}`}>
      <div className={`p-2 rounded-lg ${selected ? "bg-green-100" : "bg-gray-100"}`}>{icon}</div>
      <div className="text-left">
        <p className={`text-sm font-bold ${selected ? "text-green-700" : "text-gray-700"}`}>{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      {selected && <SelectedIndicator />}
    </button>
  );
}

function PaymentOptions({ isProcessing, user, grandTotal, paymentMethod, setPaymentMethod, handlePayment }: Readonly<Omit<CheckoutPaymentBoxProps, "isRestaurantLoading" | "isRestaurantOpen">>) {
  let buttonText = `Proceed to Pay (₹${grandTotal})`;
  if (isProcessing) buttonText = "Processing...";
  else if (paymentMethod === "cod") buttonText = `Place Order (₹${grandTotal})`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <PaymentOption method="online" selected={paymentMethod === "online"} icon={<CreditCard className={`w-5 h-5 ${paymentMethod === "online" ? "text-green-600" : "text-gray-500"}`} />} title="Pay Online" description="UPI, Cards, NetBanking" setPaymentMethod={setPaymentMethod} />
        <PaymentOption method="cod" selected={paymentMethod === "cod"} icon={<Banknote className={`w-5 h-5 ${paymentMethod === "cod" ? "text-green-600" : "text-gray-500"}`} />} title="Cash on Delivery" description="Pay when delivered" setPaymentMethod={setPaymentMethod} />
      </div>
      <button onClick={handlePayment} disabled={isProcessing || !user?.addresses || user.addresses.length === 0} className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl text-lg uppercase tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
        {buttonText}
      </button>
    </div>
  );
}

function PaymentContent({ isRestaurantLoading, isRestaurantOpen, ...props }: Readonly<CheckoutPaymentBoxProps>) {
  if (isRestaurantLoading) return <div className="animate-pulse h-12 bg-gray-200 rounded-lg w-full" />;
  if (!isRestaurantOpen)
    return (
      <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg font-medium flex items-center gap-2">
        <Clock className="w-5 h-5" /> Restaurant is currently closed. You cannot proceed to pay.
      </div>
    );
  return <PaymentOptions {...props} />;
}

export default function CheckoutPaymentBox({ isRestaurantLoading, isRestaurantOpen, isProcessing, user, grandTotal, paymentMethod, setPaymentMethod, handlePayment }: Readonly<CheckoutPaymentBoxProps>) {
  const paymentContent = <PaymentContent isRestaurantLoading={isRestaurantLoading} isRestaurantOpen={isRestaurantOpen} isProcessing={isProcessing} user={user} grandTotal={grandTotal} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} handlePayment={handlePayment} />;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
      <div className="flex items-start gap-4">
        <div className="bg-black text-white p-2 rounded flex items-center justify-center">
          <CreditCard className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Method</h2>
          <p className="text-sm text-gray-500 mb-6">Choose how you&apos;d like to pay</p>
          {paymentContent}
        </div>
      </div>
    </div>
  );
}
