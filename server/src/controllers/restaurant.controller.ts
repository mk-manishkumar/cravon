import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { onboardRestaurant, deleteRestaurant, getMyRestaurant as getMyRestaurantService, toggleRestaurantStatus } from "../services/restaurant.service.js";
import { ApiError } from "../utils/errorHandler.js";

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
  const user = (req as any).user;
  const userId = user?.id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  const restaurant = await getMyRestaurantService(userId, user.firstName);

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

// Toggle the active/inactive status of the restaurant
export const toggleStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { status } = req.body;
  if (status !== "active" && status !== "inactive") throw new ApiError(400, "Invalid status. Must be 'active' or 'inactive'");

  const updatedRestaurant = await toggleRestaurantStatus(userId, status);

  res.status(200).json({
    status: "success",
    message: `Restaurant status updated to ${status}`,
    data: updatedRestaurant,
  });
});
