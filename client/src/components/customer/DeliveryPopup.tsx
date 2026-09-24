"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { CheckCircle2, X } from "lucide-react";

interface OrderItem {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderStatus: string;
  grandTotal: number;
  createdAt: string;
  restaurant?: {
    name?: string;
  };
  items: OrderItem[];
}

export default function DeliveryPopup() {
  const { user } = useAuthStore();
  const [deliveredOrder, setDeliveredOrder] = useState<Order | null>(null);

  const { data: orders } = useQuery<Order[]>({
    queryKey: ["delivery-popup-orders"],
    queryFn: async () => {
      const res = await api.get("/orders/my");
      return res.data.data;
    },
    enabled: !!user,
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (orders && orders.length > 0) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const unseenDeliveredOrder = orders.find((order) => {
        if (order.orderStatus === "delivered" && new Date(order.createdAt) > twentyFourHoursAgo) {
          const seen = localStorage.getItem(`seen_delivered_${order._id}`);
          return !seen;
        }
        return false;
      });

      if (unseenDeliveredOrder && !deliveredOrder) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDeliveredOrder(unseenDeliveredOrder);
      }
    }
  }, [orders, deliveredOrder]);

  const handleClose = () => {
    if (deliveredOrder) {
      localStorage.setItem(`seen_delivered_${deliveredOrder._id}`, "true");
      setDeliveredOrder(null);
    }
  };

  if (!deliveredOrder) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center backdrop-blur-md bg-black/40">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl relative text-center flex flex-col items-center animate-in fade-in zoom-in duration-300">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Delivered!</h2>
        <p className="text-gray-600 mb-6">
          Your order from <span className="font-bold text-gray-800">{deliveredOrder.restaurant?.name || "the restaurant"}</span> has arrived.
        </p>

        <div className="w-full bg-gray-50 rounded-2xl p-5 mb-6 text-left border border-gray-100">
          <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            <span>Item</span>
            <span>Price</span>
          </div>
          <div className="space-y-3 mb-4">
            {deliveredOrder.items.map((item, idx) => (
              <div key={item._id || `${item.name}-${idx}`} className="flex justify-between items-start">
                <div className="flex gap-2">
                  <span className="text-gray-900 font-medium">{item.quantity}x</span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="text-gray-900 font-semibold whitespace-nowrap ml-4">₹{item.price}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Paid</span>
            <span className="text-lg font-extrabold text-[#FF7A30]">₹{deliveredOrder.grandTotal}</span>
          </div>
        </div>

        <p className="text-gray-500 font-medium">Thank you for ordering with Cravon!</p>
        <p className="text-sm text-gray-400 mt-1">Enjoy your meal.</p>
      </div>
    </div>
  );
}
