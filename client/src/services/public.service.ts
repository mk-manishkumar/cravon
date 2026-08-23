import api from "../lib/axios";

export const publicService = {
  // Get all active restaurants for the customer landing page
  getActiveRestaurants: async () => {
    const response = await api.get("/public/restaurants");
    return response.data.data;
  },
};
