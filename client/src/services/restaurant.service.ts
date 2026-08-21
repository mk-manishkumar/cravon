import api from "../lib/axios";

export const restaurantService = {
  // Create a new restaurant
  createRestaurant: async (data: Record<string, unknown>) => {
    const response = await api.post("/restaurants", data);
    return response.data;
  },

  // Update an existing restaurant
  updateRestaurant: async (id: string, data: Record<string, unknown>) => {
    const response = await api.put(`/restaurants/${id}`, data);
    return response.data;
  },

  // Get all restaurants for the logged-in user
  getMyRestaurants: async () => {
    const response = await api.get("/restaurants/me");
    return response.data;
  },

  // Get a specific restaurant by its ID
  getRestaurantById: async (id: string) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  // Delete a specific restaurant
  deleteRestaurant: async (id: string) => {
    const response = await api.delete(`/restaurants/${id}`);
    return response.data;
  },

  // Toggle active/inactive status of a specific restaurant
  toggleStatus: async (id: string, status: 'active' | 'inactive') => {
    const response = await api.patch(`/restaurants/${id}/status`, { status });
    return response.data;
  },

  // Update a specific menu item's price
  updateMenuPrice: async (id: string, itemName: string, newPrice: number) => {
    const response = await api.patch(`/restaurants/${id}/menu/price`, { itemName, newPrice });
    return response.data;
  },
};
