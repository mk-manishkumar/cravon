import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { getActiveRestaurantsService, getRestaurantByIdService, exploreFoodsService } from "../services/public.service.js";

// Get all active onboarded restaurants for public listing
export const getActiveRestaurants = asyncHandler(async (req: Request, res: Response) => {
  const { city } = req.query;
  const restaurants = await getActiveRestaurantsService(city as string);

  res.status(200).json({
    status: "success",
    data: restaurants,
  });
});

// Get a single restaurant by ID with its full menu
export const getRestaurantById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const restaurant = await getRestaurantByIdService(id);
    res.status(200).json({
      status: "success",
      data: restaurant,
    });
  } catch (error: any) {
    res.status(404);
    throw new Error(error.message);
  }
});

// Explore food items across all active restaurants
export const exploreFoods = asyncHandler(async (req: Request, res: Response) => {
  const { filter } = req.query;
  const foods = await exploreFoodsService(filter as string);

  res.status(200).json({
    status: "success",
    data: foods,
  });
});
