import { Store, Package } from "lucide-react";
import type { DeliveryOrder } from "../../types/order";
import AvailableOrderCard from "./AvailableOrderCard";

interface AvailableDeliveriesSectionProps {
  orders: DeliveryOrder[];
  city: string;
  loading: boolean;
  onOpenMap: (order: DeliveryOrder, mode: "pickup" | "delivery") => void;
  onAcceptOrder: (orderId: string) => Promise<void>;
}

export default function AvailableDeliveriesSection({ orders, city, loading, onOpenMap, onAcceptOrder }: AvailableDeliveriesSectionProps) {
  return (
    <section className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-[#FF7A30]" />
            Available in {city || "Patna"} ({orders.length})
          </h2>
          <p className="text-xs text-gray-500">Orders ready for delivery partners to accept</p>
        </div>
      </div>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs animate-pulse">
              <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 shadow-xs p-6">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="font-bold text-gray-800 text-base">No available orders right now</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">There are no open orders in {city || "Patna"} at the moment. Orders will appear automatically as customers place them.</p>
        </div>
      )}

      {/* Order Cards Grid */}
      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <AvailableOrderCard key={order._id} order={order} onOpenMap={onOpenMap} onAcceptOrder={onAcceptOrder} />
          ))}
        </div>
      )}
    </section>
  );
}
