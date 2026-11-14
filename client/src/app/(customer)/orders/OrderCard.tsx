"use client";

import { useState } from "react";
import Image from "next/image";
import { ChefHat, Banknote, CreditCard, Download, Star } from "lucide-react";
import { downloadInvoice } from "@/utils/pdf";
import RatingModal from "@/components/orders/RatingModal";

interface OrderItem {
  _id?: string;
  id?: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  rating?: number;
}

interface OrderRestaurant {
  name?: string;
  image?: string;
  address?: {
    street?: string;
  };
}

interface OrderDriver {
  _id?: string;
  firstName?: string;
  phone?: string;
  vehicleDetails?: string;
}

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  itemTotal: number;
  taxes: number;
  deliveryFee: number;
  grandTotal: number;
  createdAt: string;
  restaurant?: OrderRestaurant;
  items: OrderItem[];
  driver?: OrderDriver | string | null;
  isRated?: boolean;
}

interface OrderCardProps {
  order: Order;
  status: {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
  };
  onOrderUpdated?: () => void;
}

export default function OrderCard({ order, status, onOrderUpdated }: Readonly<OrderCardProps>) {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const restaurant = order.restaurant;
  const orderDate = new Date(order.createdAt);
  const isDriverConfirmed = order.orderStatus === "out_for_delivery" && Boolean(order.driver);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
        {/* Restaurant Header */}
        <div className="flex items-center gap-4 p-5 border-b border-gray-50">
          {restaurant?.image ? (
            <Image src={restaurant.image} alt={restaurant?.name || "Restaurant"} width={48} height={48} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{restaurant?.name || "Restaurant"}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {orderDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              {" • "}
              {orderDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        <div className="px-5 pt-3.5 pb-1 flex items-center justify-between">
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${status.bg} ${status.color}`}>
            {status.icon}
            {status.label}
          </div>
          {isDriverConfirmed && (
            <a href={`/orders/${order._id}`} className="flex items-center gap-1 text-[11px] font-bold text-white bg-[#FF7A30] hover:bg-[#e66a25] transition-colors px-3 py-1.5 rounded-full shadow-xs cursor-pointer animate-pulse whitespace-nowrap">
              Track Live 📍
            </a>
          )}
        </div>

        {/* Items */}
        <div className="px-5 py-4 flex-1">
          <div className="space-y-2">
            {order.items.map((item: OrderItem) => (
              <div key={item._id || item.id || `${item.name}-${item.price}-${item.quantity}`} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  <span className="font-medium">{item.quantity}x</span> {item.name}
                </span>
                <span className="text-gray-500 font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50/80 border-t border-gray-100">
          <div className="flex flex-col gap-1 text-xs text-gray-500">
            <span className="flex items-center gap-1 font-medium text-gray-600">
              {order.paymentMethod === "cod" ? <Banknote className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (Paid)"}
            </span>
          </div>
          <p className="text-base font-bold text-gray-900">Total: ₹{order.grandTotal} /-</p>
        </div>

        {/* Actions for Delivered Orders */}
        {order.orderStatus === "delivered" && (
          <div className="p-3 border-t border-gray-100 bg-white grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsRatingModalOpen(true)}
              className={`flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
                order.isRated
                  ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                  : "text-amber-800 bg-amber-50/80 hover:bg-amber-100 border-amber-200"
              }`}
            >
              <Star className={`w-3.5 h-3.5 shrink-0 ${order.isRated ? "fill-emerald-500 text-emerald-500" : "fill-amber-400 text-amber-500"}`} />
              <span>{order.isRated ? "Rated ★" : "Give Rating"}</span>
            </button>
            <button
              type="button"
              onClick={() => downloadInvoice(order)}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 text-xs font-bold text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-gray-500 shrink-0" />
              <span>Download Invoice</span>
            </button>
          </div>
        )}
      </div>

      {/* Food Rating Modal */}
      {isRatingModalOpen && (
        <RatingModal
          isOpen={isRatingModalOpen}
          onClose={() => setIsRatingModalOpen(false)}
          order={order}
          onSuccess={onOrderUpdated}
        />
      )}
    </>
  );
}
