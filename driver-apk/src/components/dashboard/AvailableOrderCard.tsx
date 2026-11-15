import { Store, MapPin, Map } from "lucide-react";
import type { DeliveryOrder } from "../../types/order";

interface AvailableOrderCardProps {
  order: DeliveryOrder;
  onOpenMap: (order: DeliveryOrder, mode: "pickup" | "delivery") => void;
  onAcceptOrder: (orderId: string) => Promise<void>;
}

export default function AvailableOrderCard({ order, onOpenMap, onAcceptOrder }: AvailableOrderCardProps) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-xs border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="inline-block px-2 py-0.5 bg-orange-100 text-[#FF7A30] text-[11px] font-bold rounded-md mb-1">READY FOR PICKUP</span>
            <h3 className="font-bold text-gray-900 text-sm">Order #{order._id.slice(-6).toUpperCase()}</h3>
          </div>
          <div className="text-right">
            <p className="font-black text-base sm:text-lg text-gray-900">₹{order.grandTotal}</p>
            <span className="text-[10px] text-gray-400 font-bold uppercase">{order.paymentMethod}</span>
          </div>
        </div>

        {/* Route Timeline */}
        <div className="space-y-3 relative my-3">
          <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-gray-200" />

          {/* Restaurant Pickup */}
          <div className="flex gap-3 relative z-10">
            <div className="w-5 h-5 bg-[#FF7A30] rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Store className="w-3 h-3 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup</p>
              <p className="text-sm font-bold text-gray-900 truncate">{order.restaurant?.name || "Restaurant"}</p>
              {order.restaurant?.address && <p className="text-xs text-gray-500 truncate">{order.restaurant.address}</p>}
            </div>
          </div>

          {/* Customer Dropoff */}
          <div className="flex gap-3 relative z-10">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-3 h-3 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Dropoff</p>
              <p className="text-sm font-bold text-gray-900 truncate">{order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ""}` : "Customer"}</p>
              <p className="text-xs text-gray-500 truncate">
                {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 mt-2">
        <button type="button" onClick={() => onOpenMap(order, "pickup")} className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors cursor-pointer">
          <Map className="w-3.5 h-3.5 text-gray-600" />
          View Route Map
        </button>

        <button type="button" onClick={() => onAcceptOrder(order._id)} className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-linear-to-r from-[#FF3D57] to-[#FF7A30] hover:from-[#e22b45] hover:to-[#e06020] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 cursor-pointer">
          Accept Order
        </button>
      </div>
    </div>
  );
}
