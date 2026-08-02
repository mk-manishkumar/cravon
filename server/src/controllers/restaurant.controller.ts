import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { onboardRestaurant, deleteRestaurant } from "../services/restaurant.service.js";
import { ApiError } from "../utils/errorHandler.js";
import Restaurant from "../models/restaurant.model.js";

//  Complete restaurant onboarding
export const completeOnboarding = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const updatedRestaurant = await onboardRestaurant(userId, req.body);

  res.status(200).json({
    status: "success",
    message: "Onboarding completed successfully",
    data: updatedRestaurant,
  });
});

// Get the restaurant details for the logged-in user
export const getMyRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  let restaurant = await Restaurant.findOne({ ownerId: userId });
  
  if (!restaurant) {
    const user = (req as any).user;
    restaurant = await Restaurant.create({
      ownerId: userId,
      name: `${user.firstName || 'Partner'}'s Restaurant`,
      status: "pending",
    });
  }

  res.status(200).json({
    status: "success",
    data: restaurant,
  });
});

// Delete the restaurant for the logged-in user
export const deleteMyRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  await deleteRestaurant(userId);

  res.status(200).json({
    status: "success",
    message: "Restaurant deleted successfully",
  });
});
