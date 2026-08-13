import { Request, Response } from "express";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { createRestaurant, updateRestaurant, deleteRestaurant, getMyRestaurants as getMyRestaurantsService, toggleRestaurantStatus, getRestaurantById } from "../services/restaurant.service.js";
import { ApiError } from "../utils/errorHandler.js";

// Create a completely new restaurant
export const createNewRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const newRestaurant = await createRestaurant(userId, req.body);

  res.status(201).json({
    status: "success",
    message: "Restaurant created successfully",
    data: newRestaurant,
  });
});

// Update an existing restaurant
export const updateExistingRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { id } = req.params;
  if (!id) throw new ApiError(400, "Restaurant ID is required");
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid Restaurant ID format");

  const updatedRestaurant = await updateRestaurant(userId, id, req.body);

  res.status(200).json({
    status: "success",
    message: "Restaurant updated successfully",
    data: updatedRestaurant,
  });
});

// Get all restaurants for the logged-in user
export const getMyRestaurants = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const userId = user?.id;

  if (!userId) throw new ApiError(401, "Unauthorized");

  const restaurants = await getMyRestaurantsService(userId);

  res.status(200).json({
    status: "success",
    data: restaurants,
  });
});

// Get a specific restaurant by ID
export const getRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { id } = req.params;
  if (!id) throw new ApiError(400, "Restaurant ID is required");
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid Restaurant ID format");

  const restaurant = await getRestaurantById(userId, id);

  res.status(200).json({
    status: "success",
    data: restaurant,
  });
});

// Delete a specific restaurant for the logged-in user
export const deleteMyRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { id } = req.params;
  if (!id) throw new ApiError(400, "Restaurant ID is required");
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid Restaurant ID format");

  await deleteRestaurant(userId, id);

  res.status(200).json({
    status: "success",
    message: "Restaurant deleted successfully",
  });
});

// Toggle the active/inactive status of a specific restaurant
export const toggleStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { id } = req.params;
  if (!id) throw new ApiError(400, "Restaurant ID is required");
  if (!mongoose.isValidObjectId(id)) throw new ApiError(400, "Invalid Restaurant ID format");

  const { status } = req.body;
  if (status !== "active" && status !== "inactive") throw new ApiError(400, "Invalid status. Must be 'active' or 'inactive'");

  const updatedRestaurant = await toggleRestaurantStatus(userId, id, status);

  res.status(200).json({
    status: "success",
    message: `Restaurant status updated to ${status}`,
    data: updatedRestaurant,
  });
});
