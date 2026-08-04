import Restaurant from "../models/restaurant.model.js";
import { ApiError } from "../utils/errorHandler.js";

// Onboard a restaurant for the logged-in user
export const onboardRestaurant = async (ownerId: string, data: any) => {
  let restaurant = await Restaurant.findOne({ ownerId });
  restaurant ??= await Restaurant.create({
    ownerId,
    name: `Partner's Restaurant`,
    status: "pending",
  });

  const { name, franchiseName, address, lat, lng, operatingDays, operatingHours, mealTimings } = data;

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
