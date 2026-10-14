"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { TrackingOrder } from "@/types/orderTracking";

export function useOrderTracking(id: string) {
  const router = useRouter();

  // High-Speed Real-Time React Query Polling
  const {
    data: order,
    isLoading,
    error,
  } = useQuery<TrackingOrder>({
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
      return 4000; // Poll rapidly every 4 seconds to catch active delivery updates
    },
    refetchIntervalInBackground: true,
  });

  const isFinished = !order || order.orderStatus === "delivered" || order.orderStatus === "cancelled";

  const targetTime = order?.acceptedAt || order?.createdAt 
    ? new Date(order.acceptedAt || order.createdAt).getTime() + 60 * 1000 
    : null;

  const [now, setNow] = useState(() => Date.now());

  // Subscribe to countdown interval without synchronous setState in effect body
  useEffect(() => {
    if (isFinished || !targetTime) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isFinished, targetTime]);

  // Redirect to orders page once driver delivers the order or if cancelled
  useEffect(() => {
    if (order?.orderStatus === "delivered") {
      toast.success("Order delivered! Redirecting to orders...", { id: "order-status-change" });
      const timer = setTimeout(() => {
        router.replace("/orders");
      }, 1200);
      return () => clearTimeout(timer);
    }
    if (order?.orderStatus === "cancelled") {
      toast.error("Order cancelled: No delivery partner available. Refund initiated.", { id: "order-status-change" });
      const timer = setTimeout(() => {
        router.replace("/orders");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [order?.orderStatus, router]);

  const timeLeft = targetTime && !isFinished ? Math.max(0, Math.floor((targetTime - now) / 1000)) : null;

  return {
    order,
    isLoading,
    error,
    timeLeft,
    router,
  };
}
