import Restaurant from "../models/restaurant.model.js";
import { ApiError } from "../utils/errorHandler.js";
import RestaurantStaff from "../models/restaurantStaff.model.js";

// Get all restaurants for the logged-in user (owned or staff)
export const getMyRestaurants = async (userId: string) => {
  const ownedRestaurants = await Restaurant.find({ ownerId: userId }).lean();

  const staffRecords: Array<{ restaurantId: string | { toString(): string }; role?: string }> =
    await RestaurantStaff.find({ userId, status: "active" }).lean();
  const staffRestaurantIds: string[] = staffRecords.map((record) => record.restaurantId.toString());

  const staffRestaurants = await Restaurant.find({ _id: { $in: staffRestaurantIds } }).lean();

  // Combine and deduplicate, attaching the user's role
  const allRestaurants = ownedRestaurants.map((r) => ({ ...r, userRole: "Owner" }));
  const ownedIds = new Set(ownedRestaurants.map((r) => r._id.toString()));

  for (const r of staffRestaurants) {
    if (!ownedIds.has(r._id.toString())) {
      const staffRecord = staffRecords.find((sr) => sr.restaurantId.toString() === r._id.toString());
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
export const toggleRestaurantStatus = async (ownerId: string, restaurantId: string, status: "active" | "inactive") => {
  const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId });
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  if (restaurant.status === "pending") {
    throw new ApiError(400, "Cannot change status of a pending restaurant. Please complete onboarding first.");
  }

  restaurant.status = status;
  await restaurant.save();

  return restaurant;
};

// Update a specific menu item
export const updateRestaurantMenuItem = async (userId: string, restaurantId: string, oldItemName: string, updates: { name?: string; price?: number; description?: string; dietary?: string }) => {
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  const isOwner = restaurant.ownerId.toString() === userId.toString();
  if (!isOwner) {
    const staff = await RestaurantStaff.findOne({ userId, restaurantId, status: "active" });

    if (!staff) throw new ApiError(403, "You do not have access to this restaurant");

    const canEditMenu = staff.role === "Owner" || staff.permissions.includes("edit_price");
    if (!canEditMenu) throw new ApiError(403, "You do not have permission to edit menu items");
  }

  if (!restaurant.menu) throw new ApiError(404, "Menu not found");

  const itemIndex = restaurant.menu.findIndex((item) => item.name === oldItemName);
  if (itemIndex === -1) throw new ApiError(404, "Menu item not found");

  const currentItem = restaurant.menu[itemIndex];
  const { name, price, description, dietary } = updates;

  if (name !== undefined) currentItem.name = name;
  if (price !== undefined) currentItem.price = Number(price);
  if (description !== undefined) currentItem.description = description;

  if (dietary !== undefined) {
    currentItem.dietary = dietary;
    if (dietary === "Veg") currentItem.isVeg = true;
    else if (dietary === "Non-Veg") currentItem.isVeg = false;
  }

  restaurant.markModified("menu");
  await restaurant.save();

  return restaurant.menu[itemIndex];
};
