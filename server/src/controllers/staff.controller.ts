import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import { inviteStaffService, acceptInviteService, getStaffService, updateStaffService, removeStaffService } from "../services/staff.service.js";

//  Invite a staff member to a restaurant
export const inviteStaff = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId, email, role = "Staff", permissions = [] } = req.body;
  const user = (req as any).user;

  if (!restaurantId || !email) {
    throw new ApiError(400, "Restaurant ID and email are required");
  }

  const result = await inviteStaffService(user.id, user.subscription?.tier || "free", restaurantId, email, role as 'Owner' | 'Manager' | 'Staff', permissions);

  res.status(200).json(result);
});

//  Accept staff invite
export const acceptInvite = asyncHandler(async (req: Request, res: Response) => {
  const { token, userId } = req.body;

  if (!token || !userId) {
    throw new ApiError(400, "Token and user ID are required");
  }

  const result = await acceptInviteService(token, userId);

  res.status(200).json(result);
});

//  Get all staff for a restaurant
export const getStaff = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const user = (req as any).user;

  const staff = await getStaffService(user.id, restaurantId);

  res.status(200).json({ staff });
});

//  Update staff permissions
export const updateStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, permissions } = req.body;
  const user = (req as any).user;

  const staffRecord = await updateStaffService(user.id, id, role as 'Owner' | 'Manager' | 'Staff', permissions);

  res.status(200).json({ message: "Staff updated successfully", staffRecord });
});

//  Remove staff
export const removeStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  const result = await removeStaffService(user.id, id);

  res.status(200).json(result);
});
