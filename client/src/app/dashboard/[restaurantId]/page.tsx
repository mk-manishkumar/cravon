"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AlertCircle } from "lucide-react";

export default function RestaurantDashboardPage() {
  const { restaurantId } = useParams();

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      <div className="bg-[#FF7A30]/10 border border-[#FF7A30]/20 rounded-2xl p-6 flex gap-4 items-start mb-8">
        <AlertCircle className="w-6 h-6 text-[#FF7A30] shrink-0 mt-1" />
        <div>
          <h3 className="text-lg font-bold text-[#FF7A30] mb-2">Welcome to Restaurant Operations</h3>
          <p className="text-[#888] leading-relaxed">
            This dashboard is specifically scoped to <strong>{restaurantId}</strong>. Depending on your staff permissions, you may be able to edit prices, edit Excel files, or view orders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
          <h4 className="text-[#888] font-medium mb-2">Today's Orders</h4>
          <p className="text-4xl font-bold">0</p>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
          <h4 className="text-[#888] font-medium mb-2">Revenue</h4>
          <p className="text-4xl font-bold">₹0</p>
        </div>
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
          <h4 className="text-[#888] font-medium mb-2">Active Staff</h4>
          <p className="text-4xl font-bold">1</p>
        </div>
      </div>
    </div>
  );
}
