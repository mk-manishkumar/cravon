import { MapPin, CheckCircle2 } from "lucide-react";
import { User as AuthUser } from "@/store/authStore";

interface CheckoutAddressBoxProps {
  user: AuthUser | null;
  selectedAddressIndex: number;
  setSelectedAddressIndex: (index: number) => void;
}

export default function CheckoutAddressBox({ user, selectedAddressIndex, setSelectedAddressIndex }: Readonly<CheckoutAddressBoxProps>) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-black text-white p-2 rounded flex items-center justify-center">
          <MapPin className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
      </div>

      {user?.addresses && user.addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-12">
          {user.addresses.map((address, idx) => (
            <button type="button" key={address._id || `${address.street}-${address.city}`} onClick={() => setSelectedAddressIndex(idx)} className={`text-left w-full block border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedAddressIndex === idx ? "border-orange-500 bg-orange-50/50 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-600 uppercase">{address.type}</span>
                {selectedAddressIndex === idx && <CheckCircle2 className="w-4 h-4 text-orange-500 ml-auto" />}
              </div>
              <p className="text-gray-800 font-medium text-sm leading-snug">
                {address.street}, {address.city}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="pl-12">
          <div className="bg-orange-50 text-orange-800 border border-orange-200 p-4 rounded-lg mb-4 text-sm">You don&apos;t have any saved addresses. Please update your profile.</div>
          <p className="text-gray-500 italic text-sm">For testing: Update User model directly or create an edit profile page.</p>
        </div>
      )}
    </div>
  );
}
