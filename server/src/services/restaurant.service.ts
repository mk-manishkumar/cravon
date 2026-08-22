import Restaurant from "../models/restaurant.model.js";
import { ApiError } from "../utils/errorHandler.js";

import RestaurantStaff from "../models/restaurantStaff.model.js";

// Get all restaurants for the logged-in user (owned or staff)
export const getMyRestaurants = async (userId: string) => {
  const ownedRestaurants = await Restaurant.find({ ownerId: userId }).lean();
  
  const staffRecords = await RestaurantStaff.find({ userId, status: "active" });
  const staffRestaurantIds = staffRecords.map(record => record.restaurantId);
  
  const staffRestaurants = await Restaurant.find({ _id: { $in: staffRestaurantIds } }).lean();
  
  // Combine and deduplicate, attaching the user's role
  const allRestaurants = ownedRestaurants.map(r => ({ ...r, userRole: "Owner" }));
  const ownedIds = new Set(ownedRestaurants.map(r => r._id.toString()));
  
  for (const r of staffRestaurants) {
    if (!ownedIds.has(r._id.toString())) {
      const staffRecord = staffRecords.find(sr => sr.restaurantId.toString() === r._id.toString());
      allRestaurants.push({ ...r, userRole: staffRecord?.role || "Staff" });
    }
  }
  
  return allRestaurants;
};

// Get a specific restaurant by ID ensuring it belongs to the logged-in user or they are staff
export const getRestaurantById = async (userId: string, restaurantId: string) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  const isOwner = restaurant.ownerId.toString() === userId.toString();
  if (!isOwner) {
    const isStaff = await RestaurantStaff.findOne({ userId, restaurantId, status: "active" });
    if (!isStaff) throw new ApiError(403, "You do not have access to this restaurant");
  }

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

// Update a specific menu item's price
export const updateRestaurantMenuPrice = async (userId: string, restaurantId: string, itemName: string, newPrice: number) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  const isOwner = restaurant.ownerId.toString() === userId.toString();

  if (!isOwner) {
    const { default: RestaurantStaff } = await import("../models/restaurantStaff.model.js");
    const staffRecord = await RestaurantStaff.findOne({ userId, restaurantId, status: "active" });

    if (!staffRecord) throw new ApiError(403, "You do not have access to this restaurant");

    if (staffRecord.role !== "Owner") {
      if (!staffRecord.permissions.includes("edit_price")) {
        throw new ApiError(403, "You do not have permission to edit prices");
      }
    }
  }

  if (!restaurant.menu) throw new ApiError(404, "Menu not found");

  const itemIndex = restaurant.menu.findIndex((item) => item.name === itemName);
  if (itemIndex === -1) throw new ApiError(404, "Menu item not found");

  restaurant.menu[itemIndex].price = Number(newPrice);

  restaurant.markModified("menu");
  await restaurant.save();

  return restaurant.menu[itemIndex];
};
