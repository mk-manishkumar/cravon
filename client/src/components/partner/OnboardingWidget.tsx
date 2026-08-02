"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurant.service";
import OnboardingWizard from "./OnboardingWizard";
import toast from "react-hot-toast";
import { Sparkles } from "lucide-react";

export default function OnboardingWidget() {
  const queryClient = useQueryClient();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Restaurant Status
  const { isLoading } = useQuery({
    queryKey: ["myRestaurant"],
    queryFn: async () => {
      const response = await restaurantService.getMyRestaurant();
      setIsOnboarded(response.data?.isOnboarded || false);
      return response.data;
    },
  });

  // Mutation for Onboarding
  const onboardMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => restaurantService.onboard(data),
    onSuccess: () => {
      toast.success("Welcome aboard! Your restaurant is now live.");
      setIsOnboarded(true); // Hide widget immediately
      setIsModalOpen(false); // Close modal
      queryClient.invalidateQueries({ queryKey: ["myRestaurant"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to complete onboarding.");
    },
  });

  if (isLoading) return null;
  if (isOnboarded) return null; // Fully vanishes when onboarded

  return (
    <>
      {/* The side widget on the right */}
      <button type="button" onClick={() => setIsModalOpen(true)} className="block text-left w-full bg-linear-to-br from-[#1A1A1A] to-[#111111] border border-[#FF7A30]/30 rounded-2xl p-6 cursor-pointer hover:border-[#FF7A30] hover:shadow-[0_0_20px_rgba(255,122,48,0.15)] transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7A30]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-[#FF7A30]/20 transition-all"></div>

        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-[#FF7A30]/10 rounded-lg text-[#FF7A30]">
            <Sparkles size={20} />
          </div>
          <h3 className="text-white font-bold text-lg group-hover:text-[#FF7A30] transition-colors">Action Required</h3>
        </div>

        <p className="text-[#888] text-sm leading-relaxed mb-4">Complete your onboarding to unlock your dashboard and start receiving orders.</p>

        <div className="w-full py-2.5 bg-white/5 group-hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-semibold transition-all text-center">Complete Onboarding</div>
      </button>

      {/* The Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Native button for the backdrop, handles clicking outside */}
          <button type="button" className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm cursor-default outline-none" onClick={() => setIsModalOpen(false)} aria-label="Close modal" />

          {/* Inner Modal Container */}
          <div className="relative z-10 w-full max-w-2xl my-auto">
            <OnboardingWizard onComplete={(data) => onboardMutation.mutate(data)} isLoading={onboardMutation.isPending} onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
