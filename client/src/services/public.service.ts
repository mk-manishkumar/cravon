import api from "../lib/axios";

export const publicService = {
  // Get all active restaurants for the customer landing page
  getActiveRestaurants: async (city?: string) => {
    const url = city && city !== "Select City" 
      ? `/public/restaurants?city=${encodeURIComponent(city)}` 
      : "/public/restaurants";
    const response = await api.get(url);
    return response.data.data;
  },

  // Get a single restaurant by ID with its full menu
  getRestaurantById: async (id: string) => {
    const response = await api.get(`/public/restaurants/${id}`);
    return response.data.data;
  },

  // Explore food items across all active restaurants
  exploreFoods: async (filter?: string, city?: string) => {
    let url = "/public/explore-foods?";
    if (filter) url += `filter=${filter}&`;
    if (city && city !== "Select City") url += `city=${encodeURIComponent(city)}&`;
    
    const response = await api.get(url);
    return response.data.data;
  }
};
