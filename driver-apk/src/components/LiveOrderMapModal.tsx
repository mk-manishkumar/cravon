import { useState } from "react";
import { X, Navigation, MapPin, Store, Phone, Copy, Check, ExternalLink } from "lucide-react";
import type { DeliveryOrder } from "../pages/Dashboard";

interface LiveOrderMapModalProps {
  order: DeliveryOrder;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "pickup" | "delivery";
}

export default function LiveOrderMapModal({ order, isOpen, onClose, initialMode = "delivery" }: LiveOrderMapModalProps) {
  const [activeTab, setActiveTab] = useState<"pickup" | "delivery">(initialMode);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !order) return null;

  // Pickup data
  const restaurantName = order.restaurant?.name || "Restaurant";
  const restaurantAddress = order.restaurant?.address || "Address not provided";
  const restaurantCoords = order.restaurant?.location?.coordinates;
  const restLng = restaurantCoords?.[0];
  const restLat = restaurantCoords?.[1];

  let restaurantNavUrl = "";
  if (restLat && restLng && restLat !== 0 && restLng !== 0) {
    restaurantNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${restLat},${restLng}`;
  } else {
    restaurantNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${restaurantName}, ${restaurantAddress}`)}`;
  }

  // Delivery data
  const customerName = order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ""}`.trim() : "Customer";
  const customerAddress = [order.deliveryAddress?.street, order.deliveryAddress?.city].filter(Boolean).join(", ") || "Delivery address not provided";
  const custLat = order.deliveryAddress?.latitude;
  const custLng = order.deliveryAddress?.longitude;

  let customerNavUrl = "";
  if (custLat && custLng && custLat !== 0 && custLng !== 0) {
    customerNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${custLat},${custLng}`;
  } else {
    customerNavUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(customerAddress)}`;
  }

  // Active target
  const isPickup = activeTab === "pickup";
  const currentTitle = isPickup ? restaurantName : customerName;
  const currentAddress = isPickup ? restaurantAddress : customerAddress;
  const currentNavUrl = isPickup ? restaurantNavUrl : customerNavUrl;
  const currentPhone = isPickup ? undefined : order.user?.phone;
  const mapQuery = isPickup ? (restLat && restLng && restLat !== 0 ? `${restLat},${restLng}` : `${restaurantName}, ${restaurantAddress}`) : custLat && custLng && custLat !== 0 ? `${custLat},${custLng}` : customerAddress;

  const handleCopyAddress = () => {
    if (!currentAddress) return;
    void navigator.clipboard.writeText(currentAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF7A30] flex items-center justify-center font-black text-xs">
              <Navigation className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-bold text-sm sm:text-base text-gray-900 leading-tight">Order #{order._id.slice(-6).toUpperCase()} Navigation</h2>
              <p className="text-[11px] text-gray-500">Live GPS Routing & Address</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Pickup vs Customer */}
        <div className="p-3 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-2 bg-gray-200/70 p-1 rounded-2xl">
            <button type="button" onClick={() => setActiveTab("pickup")} className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${isPickup ? "bg-white text-[#FF7A30] shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
              <Store className="w-3.5 h-3.5" />
              <span>1. Pickup (Restaurant)</span>
            </button>

            <button type="button" onClick={() => setActiveTab("delivery")} className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${!isPickup ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}>
              <MapPin className="w-3.5 h-3.5" />
              <span>2. Delivery (Customer)</span>
            </button>
          </div>
        </div>

        {/* Embedded Interactive Map */}
        <div className="relative w-full h-56 sm:h-64 bg-gray-100">
          <iframe title="Location Map" width="100%" height="100%" className="border-0 w-full h-full" loading="lazy" src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} />
          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-gray-100 text-[10px] font-bold text-gray-700 flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${isPickup ? "bg-[#FF7A30]" : "bg-green-500"}`} />
            {isPickup ? "Restaurant Pin" : "Customer Pin"}
          </div>
        </div>

        {/* Address & Contact Info Box */}
        <div className="p-4 space-y-3 overflow-y-auto">
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{isPickup ? "Pick up from" : "Deliver to"}</p>
                <h3 className="font-bold text-gray-900 text-sm truncate mt-0.5">{currentTitle}</h3>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{currentAddress}</p>
              </div>

              <button type="button" onClick={handleCopyAddress} className="shrink-0 p-2 text-gray-500 hover:text-[#FF7A30] hover:bg-orange-50 rounded-xl transition-colors cursor-pointer" title="Copy Address">
                {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {currentPhone && (
              <div className="mt-3 pt-2.5 border-t border-gray-200/70 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Customer Contact:</span>
                <a href={`tel:${currentPhone}`} className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-lg transition-colors">
                  <Phone className="w-3 h-3" />
                  <span>Call {currentPhone}</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation CTA */}
        <div className="p-4 border-t border-gray-100 bg-white flex gap-2.5">
          <a href={currentNavUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-linear-to-r from-[#FF3D57] to-[#FF7A30] hover:from-[#e22b45] hover:to-[#e06020] text-white rounded-xl text-sm font-bold shadow-md shadow-orange-500/20 active:scale-[0.98] transition-all cursor-pointer">
            <Navigation className="w-4 h-4" />
            <span>Open Google Maps Turn-by-Turn</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>
      </div>
    </div>
  );
}
