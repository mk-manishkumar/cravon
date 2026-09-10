"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function PartnerNotifications() {
  const [showDropdown, setShowDropdown] = useState(false);

  // Poll every 15 seconds
  const { data: notifications = [] } = useQuery({
    queryKey: ["partnerNotifications"],
    queryFn: async () => {
      const res = await api.get("/orders/partner/notifications");
      return res.data?.data || [];
    },
    refetchInterval: 15000,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingCount = notifications.filter((n: any) => n.orderStatus === "pending").length;

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

  return (
    <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
      <button type="button" className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-[#2A2A2A] text-[#888888] hover:text-white transition-colors cursor-pointer outline-none">
        <Bell size={18} />
        {pendingCount > 0 && (
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-[#FF3D57] rounded-full shadow-[0_0_8px_rgba(255,61,87,0.8)] animate-pulse"></span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 top-full pt-2 w-80 z-50">
          <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#333333] overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="px-5 py-3 bg-[#222222] border-b border-[#333333] flex justify-between items-center">
              <p className="text-[14px] font-bold text-white">Notifications</p>
              {pendingCount > 0 && (
                <span className="text-[11px] font-bold text-[#FF3D57] bg-[#FF3D57]/10 px-2 py-0.5 rounded-full">{pendingCount} New</span>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-5 py-6 text-center text-[#888888] text-[13px]">
                  No new orders in the last 7 days.
                </div>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                notifications.map((order: any) => (
                  <div key={order._id} className="border-b border-[#222222] last:border-0">
                    <Link href={`/dashboard/${order.restaurant._id || order.restaurant}/orders`} className="block px-5 py-4 hover:bg-[#2A2A2A] transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-[13px] font-bold text-white">New Order from {order.user?.firstName || "Customer"}</p>
                        <span className="text-[10px] text-[#888888] whitespace-nowrap ml-2">
                          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#AAAAAA] mb-2">{order.restaurant?.name || "Restaurant"}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[12px] font-semibold text-white">₹{order.grandTotal}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getOrderStatusClasses(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
