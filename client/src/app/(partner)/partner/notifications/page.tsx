"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function PartnerNotificationsPage() {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["partnerNotifications"],
    queryFn: async () => {
      const res = await api.get("/orders/partner/notifications");
      return res.data?.data || [];
    },
    refetchInterval: 15000,
  });

  const getOrderStatusClasses = (orderStatus: string) => {
    switch (orderStatus) {
      case "pending":
        return "bg-[#FFC93C]/10 text-[#FFC93C]";
      case "preparing":
        return "bg-[#3B82F6]/10 text-[#3B82F6]";
      case "cancelled":
        return "bg-[#FF3D57]/10 text-[#FF3D57]";
      default:
        return "bg-[#10B981]/10 text-[#10B981]";
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="p-12 text-center text-[#888]">Loading notifications...</div>;
    }

    if (notifications.length === 0) {
      return (
        <div className="p-12 text-center text-[#888]">
          <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>No new orders or updates in the last 7 days.</p>
        </div>
      );
    }

    return (
      <div className="divide-y divide-[#222]">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {notifications.map((order: any) => (
          <Link key={order._id} href={`/dashboard/${order.restaurant._id || order.restaurant}/orders`} className="block p-6 hover:bg-[#1A1A1A] transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  New Order from {order.user?.firstName || "Customer"}
                </h3>
                <p className="text-[#AAA] font-semibold">{order.restaurant?.name || "Restaurant"}</p>
                <p className="text-[#888] text-sm mt-1">
                  Order ID: #{order._id.substring(order._id.length - 6)}
                </p>
              </div>
              
              <div className="flex flex-col sm:items-end gap-2">
                <span className="text-sm text-[#888]">
                  {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                </span>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-lg font-bold text-white">₹{order.grandTotal}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${getOrderStatusClasses(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="flex-1 p-8 text-white max-w-5xl mx-auto w-full">
      <div className="flex flex-col min-[525px]:flex-row min-[525px]:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#FF7A30]" />
            Notifications
          </h1>
          <p className="text-[#888] mt-1">View incoming orders and updates across all your restaurants</p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
