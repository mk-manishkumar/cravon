"use client";

import { useQuery } from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurant.service";
import OnboardingWidget from "@/components/partner/OnboardingWidget";
import { MapPin, Utensils, Users, DollarSign, Clock, Store } from "lucide-react";

export default function PartnerDashboardPage() {
  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["myRestaurant"],
    queryFn: async () => {
      const response = await restaurantService.getMyRestaurant();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7A30]"></div>
      </div>
    );
  }

  const isOnboarded = restaurant?.isOnboarded;

  return (
    <div className="flex-1 p-8 text-white max-w-7xl mx-auto w-full">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Partner Hub</h1>
          <p className="text-[#888] mt-1">Manage your restaurant and operations</p>
        </div>
      </div>

      {/* 
        Responsive Layout: 
        On large screens (lg), 3 columns. Profile takes 2 cols, Widget takes 1 col.
        On smaller screens, everything stacks vertically (Profile first, Widget second).
      */}
      <div className={`grid grid-cols-1 ${!isOnboarded ? 'lg:grid-cols-3' : ''} gap-8`}>
        
        {/* Left Side: Restaurant Profile */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] border border-[#222] rounded-3xl p-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A30]/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl border border-[#333] flex items-center justify-center text-[#FF7A30]">
                    <Store size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{restaurant?.name || "Your Restaurant"}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        restaurant?.status === 'active' ? 'bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20' : 
                        'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                      }`}>
                        {restaurant?.status?.toUpperCase() || "PENDING"}
                      </span>
                      {!isOnboarded && (
                        <span className="text-xs text-[#888]">(Pending Onboarding)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">Address</p>
                    <p className="text-sm text-[#CCC]">
                      {restaurant?.address || "Address not provided yet"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666]">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">Cuisines</p>
                    <p className="text-sm text-[#CCC]">
                      {restaurant?.cuisines?.length > 0 
                        ? restaurant.cuisines.join(", ") 
                        : "No cuisines added"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666]">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">Staff Count</p>
                    <p className="text-sm text-[#CCC]">
                      {restaurant?.staffCount ? `${restaurant.staffCount} Members` : "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666]">
                    <DollarSign size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">Cost For Two</p>
                    <p className="text-sm text-[#CCC]">
                      {restaurant?.costForTwo ? `$${restaurant.costForTwo}` : "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666]">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">Operating Hours</p>
                    <p className="text-sm text-[#CCC]">
                      {restaurant?.operatingHours?.open && restaurant?.operatingHours?.close 
                        ? `${restaurant.operatingHours.open} - ${restaurant.operatingHours.close}` 
                        : "Not set"}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Onboarding Widget (Only shows if NOT onboarded) */}
        {!isOnboarded && (
          <div className="lg:col-span-1">
            {/* The widget component manages its own modal */}
            <OnboardingWidget />
          </div>
        )}
      </div>
    </div>
  );
}
