"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { restaurantService } from "@/services/restaurant.service";
import OnboardingWizard from "@/components/partner/OnboardingWizard";
import toast from "react-hot-toast";

import RestaurantProfileCard from "./components/RestaurantProfileCard";

export default function PartnerRestaurantsPage() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingRestaurant, setEditingRestaurant] = useState<any>(null);

  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["myRestaurants"],
    queryFn: async () => {
      const response = await restaurantService.getMyRestaurants();
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => restaurantService.createRestaurant(data),
    onSuccess: () => {
      toast.success("Restaurant created successfully");
      setIsCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["myRestaurants"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error(error);
      const message = error.response?.data?.message || error.message || "Failed to create restaurant";
      toast.error(`Creation failed: ${message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => restaurantService.deleteRestaurant(id),
    onSuccess: () => {
      toast.success("Restaurant deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["myRestaurants"] });
    },
    onError: () => {
      toast.error("Failed to delete restaurant");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => restaurantService.updateRestaurant(id, data),
    onSuccess: () => {
      toast.success("Restaurant updated successfully");
      setEditingRestaurant(null);
      queryClient.invalidateQueries({ queryKey: ["myRestaurants"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error(error);
      const message = error.response?.data?.message || error.message || "Failed to update restaurant";
      toast.error(`Update failed: ${message}`);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "inactive" }) => restaurantService.toggleStatus(id, status),
    onSuccess: (data) => {
      toast.success(data.message || "Restaurant status updated");
      queryClient.invalidateQueries({ queryKey: ["myRestaurants"] });
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error(error);
      const message = error.response?.data?.message || error.message || "Failed to update status";
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

  return (
    <div className="flex-1 p-8 text-white max-w-7xl mx-auto w-full">
      <div className="flex flex-col max-[525px]:items-start min-[525px]:flex-row min-[525px]:items-center justify-between gap-4 min-[525px]:gap-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Partner Hub</h1>
          <p className="text-[#888] mt-1">Manage your restaurants and operations</p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-2.5 bg-[#FF7A30] text-white font-bold rounded-xl hover:bg-[#FF7A30]/90 transition-all cursor-pointer"
        >
          New Onboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Restaurants Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-6">
            {restaurants.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-12 bg-[#111] border border-[#222] rounded-3xl">
                <p className="text-[#888] mb-4">You haven&apos;t onboarded any restaurants yet.</p>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all cursor-pointer"
                >
                  Create Your First Restaurant
                </button>
              </div>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              restaurants.map((rest: any) => (
                <RestaurantProfileCard 
                  key={rest._id}
                  restaurant={rest} 
                  isOnboarded={rest.isOnboarded} 
                  onEdit={() => setEditingRestaurant(rest)} 
                  onDelete={() => deleteMutation.mutate(rest._id)} 
                  isDeleting={deleteMutation.isPending} 
                  onToggleStatus={() => toggleStatusMutation.mutate({ id: rest._id, status: rest.status === "active" ? "inactive" : "active" })} 
                  isTogglingStatus={toggleStatusMutation.isPending} 
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <button type="button" className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm cursor-default outline-none" onClick={() => setIsCreateModalOpen(false)} aria-label="Close modal" />

          <div className="relative z-10 w-full max-w-2xl my-auto">
            <OnboardingWizard isEditMode={false} onComplete={(data) => createMutation.mutate(data)} isLoading={createMutation.isPending} onClose={() => setIsCreateModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <button type="button" className="fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm cursor-default outline-none" onClick={() => setEditingRestaurant(null)} aria-label="Close modal" />

          <div className="relative z-10 w-full max-w-2xl my-auto">
            <OnboardingWizard initialData={editingRestaurant} isEditMode={true} onComplete={(data) => updateMutation.mutate({ id: editingRestaurant._id, data })} isLoading={updateMutation.isPending} onClose={() => setEditingRestaurant(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
