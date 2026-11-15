import { Bike, Package, ArrowRight } from "lucide-react";

interface DriverStatusBannerProps {
  isOnline: boolean;
  city: string;
  onOpenDeliveries: () => void;
}

export default function DriverStatusBanner({ isOnline, city, onOpenDeliveries }: DriverStatusBannerProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 ${isOnline ? "bg-green-50 text-green-600 border border-green-200" : "bg-gray-100 text-gray-400"}`}>
          <Bike className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-black text-gray-900 leading-tight">{isOnline ? "You are Online & Ready" : "You are currently Offline"}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{isOnline ? `Receiving delivery orders in ${city || "Patna"}` : "Turn on Duty Status to start receiving delivery orders nearby"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-stretch sm:self-auto pt-1 sm:pt-0">
        <button type="button" onClick={onOpenDeliveries} className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer">
          <Package className="w-4 h-4 text-[#FF7A30]" />
          <span>My Deliveries</span>
          <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}
