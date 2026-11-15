import { Clock } from "lucide-react";
import type { DeliveryOrder } from "../../types/order";
import ActiveOrderCard from "./ActiveOrderCard";

interface ActiveDeliveriesSectionProps {
  orders: DeliveryOrder[];
  onOpenMap: (order: DeliveryOrder, mode: "pickup" | "delivery") => void;
  onUpdateStatus: (orderId: string, status: string) => Promise<void>;
}

export default function ActiveDeliveriesSection({ orders, onOpenMap, onUpdateStatus }: ActiveDeliveriesSectionProps) {
  if (orders.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-600" />
          Active Deliveries ({orders.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order) => (
          <ActiveOrderCard key={order._id} order={order} onOpenMap={onOpenMap} onUpdateStatus={onUpdateStatus} />
        ))}
      </div>
    </section>
  );
}
