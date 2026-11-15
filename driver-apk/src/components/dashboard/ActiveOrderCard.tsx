import { Store, MapPin, Navigation, CheckCircle2, Bike } from "lucide-react";
import type { DeliveryOrder } from "../../types/order";

interface ActiveOrderCardProps {
  order: DeliveryOrder;
  onOpenMap: (order: DeliveryOrder, mode: "pickup" | "delivery") => void;
  onUpdateStatus: (orderId: string, status: string) => Promise<void>;
}

export default function ActiveOrderCard({ order, onOpenMap, onUpdateStatus }: ActiveOrderCardProps) {
  const isOutForDelivery = order.orderStatus === "out_for_delivery";
  const isPreparingOrReady = order.orderStatus === "ready" || order.orderStatus === "preparing";

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-md shadow-purple-500/5 space-y-4">
      {/* Card Header: Order ID + Total */}
      <div className="flex justify-between items-start">
        <div>
          <span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-black rounded-lg mb-1">IN PROGRESS</span>
          <h3 className="font-bold text-gray-900 text-sm">Order #{order._id.slice(-6).toUpperCase()}</h3>
        </div>
        <div className="text-right">
          <p className="font-black text-lg text-gray-900">₹{order.grandTotal}</p>
          <span className="text-[10px] text-gray-400 font-bold uppercase">{order.paymentMethod}</span>
        </div>
      </div>

      {/* Route Timeline */}
      <div className="space-y-3 relative my-3">
        <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-gray-200" />

        {/* Pickup Location (Restaurant) */}
        <div className="flex gap-3 relative z-10">
          <div className="w-5 h-5 bg-[#FF7A30] rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <Store className="w-3 h-3 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup Location</p>
            <p className="text-sm font-bold text-gray-900 truncate">{order.restaurant?.name || "Restaurant"}</p>
            {order.restaurant?.address && <p className="text-xs text-gray-500 truncate">{order.restaurant.address}</p>}
          </div>
        </div>

        {/* Dropoff Location (Customer) */}
        <div className="flex gap-3 relative z-10">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="w-3 h-3 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Customer Dropoff</p>
            <p className="text-sm font-bold text-gray-900 truncate">{order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ""}` : "Customer"}</p>
            <p className="text-xs text-gray-500 truncate">
              {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
            </p>
          </div>
        </div>
      </div>

      {/* Actions: Live Map GPS & Order Status Updates */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button type="button" onClick={() => onOpenMap(order, isOutForDelivery ? "delivery" : "pickup")} className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer">
          <Navigation className="w-4 h-4 text-blue-600" />
          {isOutForDelivery ? "Customer GPS" : "Pickup GPS"}
        </button>

        {isOutForDelivery && (
          <button type="button" onClick={() => onUpdateStatus(order._id, "delivered")} className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-md shadow-green-600/20 cursor-pointer">
            <CheckCircle2 className="w-4 h-4" />
            Delivered
          </button>
        )}

        {isPreparingOrReady && (
          <button type="button" onClick={() => onUpdateStatus(order._id, "out_for_delivery")} className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-md shadow-purple-600/20 cursor-pointer">
            <Bike className="w-4 h-4" />
            Start Delivery
          </button>
        )}
      </div>
    </div>
  );
}
