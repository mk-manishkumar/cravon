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

  if (restaurant.isOnboarded) throw new ApiError(400, "Restaurant is already onboarded");

  const { name, address, lat, lng, cuisines, costForTwo, staffCount, operatingHours } = data;

  restaurant.name = name;
  restaurant.address = address;
  restaurant.location = {
    type: "Point",
    coordinates: [lng, lat], // GeoJSON expects longitude first
  };
  restaurant.cuisines = cuisines;
  restaurant.costForTwo = costForTwo;
  restaurant.staffCount = staffCount;
  restaurant.operatingHours = operatingHours;

  restaurant.isOnboarded = true;
  restaurant.status = "active";

  await restaurant.save();

  return restaurant;
};
