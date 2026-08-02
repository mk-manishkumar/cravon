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

// Delete the restaurant for the logged-in user
export const deleteRestaurant = async (ownerId: string) => {
  const restaurant = await Restaurant.findOneAndDelete({ ownerId });
  if (!restaurant) throw new ApiError(404, "Restaurant not found");
  return restaurant;
};
