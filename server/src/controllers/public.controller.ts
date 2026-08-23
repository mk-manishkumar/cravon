import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import Restaurant from "../models/restaurant.model.js";

// Get all active onboarded restaurants for public listing
export const getActiveRestaurants = asyncHandler(async (req: Request, res: Response) => {
  const restaurants = await Restaurant.find({
    status: "active",
    isOnboarded: true,
  })
    .select("-menu") 
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    data: restaurants,
  });
});

// Get a single restaurant by ID with its full menu
export const getRestaurantById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const restaurant = await Restaurant.findOne({
    _id: id,
    status: "active",
    isOnboarded: true
  });

  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found or is currently inactive");
  }

  res.status(200).json({
    status: "success",
    data: restaurant,
  });
});
