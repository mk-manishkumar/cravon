import Restaurant from "../models/restaurant.model.js";
import { ApiError } from "../utils/errorHandler.js";

// Get the restaurant details for the logged-in user
export const getMyRestaurant = async (userId: string, firstName?: string) => {
  let restaurant = await Restaurant.findOne({ ownerId: userId });

  restaurant ??= await Restaurant.create({
    ownerId: userId,
    name: `${firstName || 'Partner'}'s Restaurant`,
    status: "pending",
  });

  return restaurant;
};

// Onboard a restaurant for the logged-in user
export const onboardRestaurant = async (ownerId: string, data: any) => {
  let restaurant = await Restaurant.findOne({ ownerId });
  restaurant ??= await Restaurant.create({
    ownerId,
    name: `Partner's Restaurant`,
    status: "pending",
  });

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

// Delete the restaurant for the logged-in user
export const deleteRestaurant = async (ownerId: string) => {
  const restaurant = await Restaurant.findOneAndDelete({ ownerId });
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  return restaurant;
};

// Toggle the active/inactive status of the restaurant
export const toggleRestaurantStatus = async (ownerId: string, status: 'active' | 'inactive') => {
  const restaurant = await Restaurant.findOne({ ownerId });
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  
  if (restaurant.status === 'pending') {
    throw new ApiError(400, "Cannot change status of a pending restaurant. Please complete onboarding first.");
  }

  restaurant.status = status;
  await restaurant.save();

  return restaurant;
};
