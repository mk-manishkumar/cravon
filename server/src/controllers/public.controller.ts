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
