import api from "../lib/axios";

export const restaurantService = {
  // Onboard the restaurant with the 3-step form data
  onboard: async (data: Record<string, unknown>) => {
    const response = await api.put("/restaurants/onboard", data);
    return response.data;
  },

  // Get the current restaurant details (to check onboarding status)
  getMyRestaurant: async () => {
    const response = await api.get("/restaurants/me");
    return response.data;
  },

  // Delete the restaurant
  deleteMyRestaurant: async () => {
    const response = await api.delete("/restaurants/me");
    return response.data;
  },

  // Toggle restaurant active/inactive status
  toggleStatus: async (status: 'active' | 'inactive') => {
    const response = await api.patch("/restaurants/me/status", { status });
    return response.data;
  },
};
