import Restaurant from "../models/restaurant.model.js";
import { ApiError } from "../utils/errorHandler.js";

// Get all restaurants for the logged-in user
export const getMyRestaurants = async (userId: string) => {
  return await Restaurant.find({ ownerId: userId });
};

// Get a specific restaurant by ID ensuring it belongs to the logged-in user
export const getRestaurantById = async (ownerId: string, restaurantId: string) => {
  const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId });
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  return restaurant;
};

// Create a completely new restaurant
export const createRestaurant = async (ownerId: string, data: any) => {
  const { name, franchiseName, address, lat, lng, operatingDays, operatingHours, mealTimings, image, menu } = data;

  const restaurant = new Restaurant({
    ownerId,
    name: name || "New Restaurant",
    franchiseName,
    address,
    operatingDays,
    operatingHours,
    mealTimings,
    image,
    menu,
    isOnboarded: true,
    status: "active",
  });

  if (lat !== undefined && lng !== undefined) {
    restaurant.location = {
      type: "Point",
      coordinates: [lng, lat],
    };
  }

  await restaurant.save();
  return restaurant;
};

// Update an existing restaurant
export const updateRestaurant = async (ownerId: string, restaurantId: string, data: any) => {
  const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId });
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  const { name, franchiseName, address, lat, lng, operatingDays, operatingHours, mealTimings, image, menu } = data;

  restaurant.name = name;
  if (franchiseName) restaurant.franchiseName = franchiseName;
  if (address) restaurant.address = address;
  if (lat !== undefined && lng !== undefined) {
    restaurant.location = {
      type: "Point",
      coordinates: [lng, lat],
    };
  } else {
    restaurant.location = undefined;
  }
  restaurant.operatingDays = operatingDays;
  restaurant.operatingHours = operatingHours;
  restaurant.mealTimings = mealTimings;
  if (image) restaurant.image = image;
  if (menu) restaurant.menu = menu;

  restaurant.isOnboarded = true;
  restaurant.status = "active";

  await restaurant.save();

  return restaurant;
};

// Delete a specific restaurant for the logged-in user
export const deleteRestaurant = async (ownerId: string, restaurantId: string) => {
  const restaurant = await Restaurant.findOneAndDelete({ _id: restaurantId, ownerId });
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  return restaurant;
};

// Toggle the active/inactive status of a specific restaurant
export const toggleRestaurantStatus = async (ownerId: string, restaurantId: string, status: 'active' | 'inactive') => {
  const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId });
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  
  if (restaurant.status === 'pending') {
    throw new ApiError(400, "Cannot change status of a pending restaurant. Please complete onboarding first.");
  }

  restaurant.status = status;
  await restaurant.save();

  return restaurant;
};
