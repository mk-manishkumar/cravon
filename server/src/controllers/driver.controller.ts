import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { loginDriverService, registerDriverService, getDriverProfileService, updateDriverStatusService, updateDriverLocationService, getDriverOrdersService, updateOrderStatusService, updateDriverProfileService, getDriverDeliveriesService, changeDriverPasswordService, deleteDriverAccountService } from "../services/driver.service.js";
import { driverRegisterSchema, updateDriverProfileSchema, changeDriverPasswordSchema, deleteDriverAccountSchema } from "../utils/zod.js";

export const registerDriver = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsedData = driverRegisterSchema.parse(req.body);
  const data = await registerDriverService(parsedData as any);
  res.status(201).json({ success: true, data });
});

// Controller for driver login
export const loginDriver = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const data = await loginDriverService(email, password);
  res.json({ success: true, data });
});

// Controller for fetching driver profile
export const getCurrentDriverProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const driverId = (req as any).user.id;
  const profile = await getDriverProfileService(driverId);
  res.json({ success: true, user: profile });
});

// Controller for updating driver profile
export const updateProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsedData = updateDriverProfileSchema.parse(req.body);
  const data = await updateDriverProfileService((req as any).user.id, parsedData as any);
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

// Controller for fetching driver's deliveries
export const getDriverDeliveries = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const page = Number.parseInt(req.query.page as string, 10) || 1;
  const limit = Number.parseInt(req.query.limit as string, 10) || 9;
  const status = req.query.status as string;

  const data = await getDriverDeliveriesService((req as any).user.id, page, limit, status);
  res.json({ success: true, data });
});

// Controller for updating order status
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { status } = req.body;
  const data = await updateOrderStatusService((req as any).user.id, id, status);
  res.json({ success: true, data });
});

// Controller for changing driver password
export const changeDriverPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsedData = changeDriverPasswordSchema.parse(req.body);
  const result = await changeDriverPasswordService((req as any).user.id, parsedData);
  res.json({ success: true, ...result });
});

// Controller for deleting driver account
export const deleteDriverAccount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const parsedData = deleteDriverAccountSchema.parse(req.body);
  const result = await deleteDriverAccountService((req as any).user.id, parsedData);
  res.json({ success: true, ...result });
});
