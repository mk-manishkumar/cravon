"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { Clock, CheckCircle2, XCircle, Search, Filter } from "lucide-react";
import toast from "react-hot-toast";

export default function RestaurantOrdersPage() {
  const { restaurantId } = useParams();
  const queryClient = useQueryClient();

  const getOrderStatusClasses = (orderStatus: string) => {
    switch (orderStatus) {
      case "pending":
        return "bg-[#FFC93C]/10 text-[#FFC93C] border border-[#FFC93C]/20";
      case "preparing":
        return "bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20";
      case "cancelled":
        return "bg-[#FF3D57]/10 text-[#FF3D57] border border-[#FF3D57]/20";
      default:
        return "bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20";
    }
  };

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["restaurantOrders", restaurantId],
    queryFn: async () => {
      const res = await api.get(`/orders/restaurant/${restaurantId}`);
      return res.data?.data || [];
    },
    refetchInterval: 15000, // Poll every 15s to keep it real-time
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.put(`/orders/${id}/status`, { status });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Order updated");
      queryClient.invalidateQueries({ queryKey: ["restaurantOrders", restaurantId] });
      queryClient.invalidateQueries({ queryKey: ["partnerNotifications"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update order");
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#FF7A30]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Orders</h1>
          <p className="text-[#888]">Manage incoming orders and status updates.</p>
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#222] flex flex-wrap gap-4 items-center justify-between bg-[#151515]">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666] w-4 h-4" />
              <input type="text" placeholder="Search orders..." className="bg-[#0A0A0A] border border-[#333] text-sm rounded-xl pl-10 pr-4 py-2 text-white outline-none focus:border-[#FF7A30] w-64 transition-all" />
            </div>
            <button type="button" className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] border border-[#333] hover:bg-[#1A1A1A] rounded-xl text-sm font-medium text-[#BBB] transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0A0A0A]">
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#666] border-b border-[#222]">Order ID & Time</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#666] border-b border-[#222]">Customer</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#666] border-b border-[#222]">Items</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#666] border-b border-[#222]">Total</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#666] border-b border-[#222]">Status</th>
                <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider text-[#666] border-b border-[#222] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#888]">
                    No orders found.
                  </td>
                </tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-[#151515] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-mono text-sm text-[#DDD] mb-1">#{order._id.slice(-6)}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#666]">
                        <Clock className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#DDD] text-sm">{order.user?.firstName} {order.user?.lastName}</div>
                      <div className="text-[12px] text-[#888]">{order.paymentMethod?.toUpperCase()}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-[#BBB] max-w-50 truncate">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-[#DDD]">
                      ₹{order.grandTotal}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getOrderStatusClasses(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {order.orderStatus === 'pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            type="button"
                            onClick={() => updateStatusMutation.mutate({ id: order._id, status: 'preparing' })}
                            disabled={updateStatusMutation.isPending}
                            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Accept
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              if(confirm("Are you sure you want to reject this order? This will cancel it and initiate a refund if paid online.")) {
                                updateStatusMutation.mutate({ id: order._id, status: 'cancelled' });
                              }
                            }}
                            disabled={updateStatusMutation.isPending}
                            className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3D57]/10 hover:bg-[#FF3D57]/20 text-[#FF3D57] rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[12px] font-medium text-[#666]">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
