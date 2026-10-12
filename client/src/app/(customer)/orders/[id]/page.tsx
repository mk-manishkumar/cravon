"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import MapTracking from "@/components/orders/MapTracking";
import { Bike, Phone, Clock, ArrowLeft, AlertCircle, PackageCheck, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

interface OrderItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

export default function OrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();

  // High-Speed Real-Time React Query Polling
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return res.data.data;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.orderStatus;
      // Stop polling once terminal state is reached
      if (status === "delivered" || status === "cancelled") {
        return false;
      }
      return 4000; // Poll rapidly every 4 seconds to catch 1-minute demo cycles
    },
    refetchIntervalInBackground: true,
  });

  const isFinished = !order || order.orderStatus === "delivered" || order.orderStatus === "cancelled";

  const targetTime = order?.acceptedAt || order?.createdAt ? new Date(order.acceptedAt || order.createdAt).getTime() + 60 * 1000 : null;

  const [now, setNow] = useState(() => Date.now());

  // Subscribe to countdown interval without synchronous setState in effect body
  useEffect(() => {
    if (isFinished || !targetTime) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished, targetTime]);

  // Redirect to orders page once driver delivers the order
  useEffect(() => {
    if (order?.orderStatus === "delivered") {
      toast.success("Order delivered! Redirecting to orders...", { id: "order-delivered" });
      const timer = setTimeout(() => {
        router.replace("/orders");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [order?.orderStatus, router]);

  const timeLeft = targetTime && !isFinished ? Math.max(0, Math.floor((targetTime - now) / 1000)) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-zinc-500 font-medium">Tracking your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-2" />
        <h2 className="text-xl font-bold text-zinc-800">Order not found</h2>
        <Link href="/orders" className="mt-4 text-orange-500 font-bold hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
        </Link>
      </div>
    );
  }

  // Fallback coordinates in case database locations are still mock strings
  const restaurantCoords: [number, number] = order.restaurant?.location?.coordinates
    ? [order.restaurant.location.coordinates[1], order.restaurant.location.coordinates[0]] // GeoJSON [lng, lat] -> Leaflet [lat, lng]
    : [19.076, 72.8777]; // Default Mumbai

  const userCoords: [number, number] = [19.08, 72.88]; // Nearby home demo coordinates

  const driverCoords: [number, number] | undefined = order.driver?.location?.latitude && order.driver?.location?.longitude ? [order.driver.location.latitude, order.driver.location.longitude] : undefined;

  // Status progression UI states
  const isDelivered = order.orderStatus === "delivered";
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      {/* Top Navbar */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-20 px-4 py-3 shadow-xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => router.push("/orders")} className="flex items-center text-zinc-600 hover:text-black font-semibold text-sm cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-1" /> Orders
          </button>
          <span className="font-mono text-xs font-bold text-zinc-400">#{order._id.substring(0, 8)}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-4">
        {/* Dynamic Countdown Header */}
        {!isDelivered && !isCancelled && (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center mb-1">
                <Clock className="w-3.5 h-3.5 mr-1" /> Estimated Arrival
              </span>
              <h2 className="text-2xl font-black text-zinc-900">{timeLeft !== null && timeLeft > 0 ? `${timeLeft} seconds` : "Arriving any moment!"}</h2>
              <p className="text-xs text-zinc-500 mt-0.5">High-speed delivery is underway</p>
            </div>
            {timeLeft !== null && (
              <div className="w-14 h-14 rounded-full border-4 border-orange-500/20 border-t-orange-500 flex items-center justify-center animate-spin">
                <Bike className="w-6 h-6 text-orange-500 -rotate-45" />
              </div>
            )}
          </div>
        )}

        {/* Celebration Banner for Completed Orders */}
        {isDelivered && (
          <div className="bg-green-500 text-white p-6 rounded-3xl shadow-lg shadow-green-500/20 flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <PackageCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Order Delivered!</h2>
              <p className="text-sm text-green-100">Enjoy your meal from {order.restaurant?.name || "the restaurant"}.</p>
            </div>
          </div>
        )}

        {/* Live Interactive Map */}
        <div className="bg-white p-2 rounded-3xl shadow-sm border border-zinc-200/80 overflow-hidden">
          <MapTracking restaurantLocation={restaurantCoords} userLocation={userCoords} driverLocation={driverCoords} status={order.orderStatus} />
        </div>

        {/* Delivery Partner Details Card */}
        {order.driver ? (
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200/80 flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 leading-tight">{order.driver.firstName}</h3>
                <p className="text-xs text-zinc-500">{order.driver.vehicleDetails || "Delivery Partner"}</p>
                <div className="flex items-center text-xs text-green-600 font-semibold mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                  <span>Live GPS Broadcasting</span>
                </div>
              </div>
            </div>
            {order.driver.phone && (
              <a href={`tel:${order.driver.phone}`} className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 hover:bg-orange-500 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
              </a>
            )}
          </div>
        ) : (
          <div className="bg-orange-50/60 p-4 rounded-3xl border border-orange-200/60 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
              <Utensils className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-orange-800">Assigning Driver</p>
              <p className="text-xs text-orange-600">The matchmaker is polling nearby drivers...</p>
            </div>
          </div>
        )}

        {/* Order Items & Summary */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200/80 space-y-4">
          <h3 className="font-bold text-zinc-900 text-sm">Order Summary</h3>
          <div className="divide-y divide-zinc-100">
            {order.items?.map((item: OrderItem) => (
              <div key={item._id || item.id || `${item.name}-${item.price}`} className="py-2.5 flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-zinc-400 font-mono">{item.quantity}x</span>
                  <span className="text-zinc-700 font-medium">{item.name}</span>
                </div>
                <span className="font-semibold text-zinc-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
            <span className="text-sm font-bold text-zinc-900">Total Paid</span>
            <span className="text-base font-black text-orange-500">₹{order.grandTotal}</span>
          </div>
        </div>
      </main>
    </div>
  );
}
