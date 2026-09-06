"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import { Package, Clock, ChefHat, Truck, CheckCircle2, XCircle, Banknote, CreditCard, ArrowLeft } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", icon: <Clock className="w-4 h-4" /> },
  preparing: { label: "Preparing", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: <ChefHat className="w-4 h-4" /> },
  out_for_delivery: { label: "Out for Delivery", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: <Truck className="w-4 h-4" /> },
  delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: <XCircle className="w-4 h-4" /> },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Unpaid", color: "text-yellow-600" },
  paid: { label: "Paid", color: "text-green-600" },
  failed: { label: "Failed", color: "text-red-600" },
  refunded: { label: "Refunded", color: "text-blue-600" },
};

interface OrderItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderRestaurant {
  name?: string;
  image?: string;
}

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  grandTotal: number;
  createdAt: string;
  restaurant?: OrderRestaurant;
  items: OrderItem[];
}

const fetchMyOrders = async (): Promise<Order[]> => {
  const res = await axiosInstance.get("/orders/my");
  return res.data.data;
};

export default function OrdersClient() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!user) {
      router.push("/auth/login?redirect=/orders");
    }
  }, [user, router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
    enabled: !!user,
  });

  const orderCount = orders?.length ?? 0;
  const orderLabel = orderCount === 1 ? "order" : "orders";
  const orderSummary = orderCount > 0 ? `${orderCount} ${orderLabel}` : "Your order history";

  if (!mounted || !user) return null;

  return (
    <div className="min-h-screen bg-[#e9ecee] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-sm text-gray-500 mt-1">{orderSummary}</p>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && (!orders || orders.length === 0) && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">Looks like you haven&apos;t placed any orders. Start exploring restaurants!</p>
            <Link href="/" className="inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors text-sm uppercase tracking-wide">
              Browse Restaurants
            </Link>
          </div>
        )}

        {/* Orders */}
        {orders && orders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders.map((order: Order) => {
              const status = statusConfig[order.orderStatus] || statusConfig.pending;
              const payStatus = paymentStatusConfig[order.paymentStatus] || paymentStatusConfig.pending;
              const restaurant = order.restaurant;
              const orderDate = new Date(order.createdAt);

              return (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
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

                  <div className="px-5 pt-3">
                    <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${status.bg} ${status.color}`}>
                      {status.icon}
                      {status.label}
                    </div>
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
                  <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-col gap-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {order.paymentMethod === "cod" ? <Banknote className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online"}
                      </span>
                      <span className={`font-medium ${payStatus.color}`}>{payStatus.label}</span>
                    </div>
                    <p className="text-base font-bold text-gray-900">₹{order.grandTotal}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
