"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Package, Clock, ChefHat, Truck, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import OrderCard from "./OrderCard";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", icon: <Clock className="w-4 h-4" /> },
  preparing: { label: "Preparing", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: <ChefHat className="w-4 h-4" /> },
  out_for_delivery: { label: "Out for Delivery", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: <Truck className="w-4 h-4" /> },
  delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: <XCircle className="w-4 h-4" /> },
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
  address?: {
    street?: string;
  };
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
}

const fetchMyOrders = async (): Promise<Order[]> => {
  const res = await axiosInstance.get("/orders/my");
  return res.data.data;
};

export default function OrdersClient() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!isAuthLoading && !user) {
      router.push("/auth/login?redirect=/orders");
    }
  }, [user, isAuthLoading, router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchMyOrders,
    enabled: !!user,
    refetchInterval: 15000, // Poll every 15 seconds to auto-update order status
  });

  const [filter, setFilter] = useState<"all" | "delivered" | "cancelled">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (filter === "all") return orders;
    return orders.filter(o => o.orderStatus === filter);
  }, [orders, filter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  
  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const orderCount = filteredOrders?.length ?? 0;
  const orderLabel = orderCount === 1 ? "order" : "orders";
  const orderSummary = orderCount > 0 ? `${orderCount} ${orderLabel}` : "Your order history";

  if (!mounted || !user) return null;

  return (
    <div className="min-h-screen bg-[#e9ecee] py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
              <p className="text-sm text-gray-500 mt-1">{orderSummary}</p>
            </div>
          </div>

          <div className="flex bg-gray-200/80 p-1.5 rounded-xl gap-1 self-start sm:self-auto">
            <button onClick={() => { setFilter('all'); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${filter === 'all' ? 'bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'text-gray-500 hover:text-gray-700'}`}>All Orders</button>
            <button onClick={() => { setFilter('delivered'); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${filter === 'delivered' ? 'bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'text-gray-500 hover:text-gray-700'}`}>Delivered</button>
            <button onClick={() => { setFilter('cancelled'); setCurrentPage(1); }} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors cursor-pointer ${filter === 'cancelled' ? 'bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)]' : 'text-gray-500 hover:text-gray-700'}`}>Cancelled</button>
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
        {currentOrders && currentOrders.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {currentOrders.map((order: Order) => {
                const status = statusConfig[order.orderStatus] || statusConfig.pending;
                return <OrderCard key={order._id} order={order} status={status} />;
              })}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center cursor-pointer transition-colors ${currentPage === i + 1 ? 'bg-[#FF3D57] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
