"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurant.service";
import OnboardingWidget from "@/components/partner/OnboardingWidget";
import OnboardingWizard from "@/components/partner/OnboardingWizard";
import toast from "react-hot-toast";

import RestaurantProfileCard from "./components/RestaurantProfileCard";

export default function PartnerRestaurantsPage() {
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["myRestaurant"],
    queryFn: async () => {
      const response = await restaurantService.getMyRestaurant();
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => restaurantService.deleteMyRestaurant(),
    onSuccess: () => {
      toast.success("Restaurant deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["myRestaurant"] });
    },
    onError: () => {
      toast.error("Failed to delete restaurant");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => restaurantService.onboard(data),
    onSuccess: () => {
      toast.success("Restaurant updated successfully");
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["myRestaurant"] });
    },
    onError: (error: unknown) => {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message = err.response?.data?.message || err.message || "Failed to update restaurant";
      toast.error(`Update failed: ${message}`);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (status: "active" | "inactive") => restaurantService.toggleStatus(status),
    onSuccess: (data) => {
      toast.success(data.message || "Restaurant status updated");
      queryClient.invalidateQueries({ queryKey: ["myRestaurant"] });
    },
    onError: (error: unknown) => {
      console.error(error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const message = err.response?.data?.message || err.message || "Failed to update status";
      toast.error(`Status update failed: ${message}`);
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

      <div className={`grid grid-cols-1 ${!isOnboarded ? "lg:grid-cols-3" : ""} gap-8`}>
        {/* Left Side: Restaurants Grid */}
        <div className="lg:col-span-2">
          {/* 
            Render as a grid for future-proofing multiple restaurants.
            Currently only supports one restaurant natively due to backend design.
          */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
            <RestaurantProfileCard restaurant={restaurant} isOnboarded={isOnboarded} onEdit={() => setIsEditModalOpen(true)} onDelete={() => deleteMutation.mutate()} isDeleting={deleteMutation.isPending} onToggleStatus={() => toggleStatusMutation.mutate(restaurant?.status === "active" ? "inactive" : "active")} isTogglingStatus={toggleStatusMutation.isPending} />
          </div>
        </div>
        {!isOnboarded && (
          <div className="lg:col-span-1">
            {/* The widget component manages its own modal */}
            <OnboardingWidget />
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <button type="button" className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm cursor-default outline-none" onClick={() => setIsEditModalOpen(false)} aria-label="Close modal" />

          <div className="relative z-10 w-full max-w-2xl my-auto">
            <OnboardingWizard initialData={restaurant} isEditMode={true} onComplete={(data) => updateMutation.mutate(data)} isLoading={updateMutation.isPending} onClose={() => setIsEditModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
