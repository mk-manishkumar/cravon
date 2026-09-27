import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { loginDriverService, updateDriverStatusService, updateDriverLocationService, getDriverOrdersService, updateOrderStatusService } from "../services/driver.service.js";

// Controller for driver login
export const loginDriver = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const data = await loginDriverService(email, password);
  res.json({ success: true, data });
});

// Controller for updating driver availability status
export const updateStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { isAvailable } = req.body;
  const data = await updateDriverStatusService((req as any).user.id, isAvailable);
  res.json({ success: true, data });
});

// Controller for updating driver location
export const updateLocation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { latitude, longitude } = req.body;
  await updateDriverLocationService((req as any).user.id, latitude, longitude);
  res.json({ success: true });
});

// Controller for fetching driver's orders
export const getDriverOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await getDriverOrdersService((req as any).user.id);
  res.json({ success: true, data });
});

// Controller for updating order status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  const data = await updateOrderStatusService((req as any).user.id, id, status);
  res.json({ success: true, data });
});
