import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import { inviteStaffService, acceptInviteService, getInviteDetailsService, acceptInviteNewUserService, getStaffService, getAllStaffService, updateStaffService, removeStaffService } from "../services/staff.service.js";
import { setAuthCookies, formatLoginResponse } from "../utils/auth.utils.js";

//  Invite a staff member to a restaurant
export const inviteStaff = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId, email, role = "Staff", permissions = [] } = req.body;
  const user = (req as any).user;

  if (!restaurantId || !email) {
    throw new ApiError(400, "Restaurant ID and email are required");
  }

  const result = await inviteStaffService(user.id, user.subscription?.tier || "free", restaurantId, email, role as "Owner" | "Manager" | "Staff", permissions);

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

// Get invite details
export const getInviteDetails = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) throw new ApiError(400, "Token is required");

  const result = await getInviteDetailsService(token);

  res.status(200).json(result);
});

// Accept invite for a new user (who doesn't have an account yet)
export const acceptInviteNewUser = asyncHandler(async (req: Request, res: Response) => {
  const { token, firstName, lastName, password } = req.body;

  if (!token || !firstName || !lastName || !password) throw new ApiError(400, "All fields are required");

  const result = await acceptInviteNewUserService(req.body);

  // Set auth cookies for the new session
  setAuthCookies(res, result.loginData.accessToken, result.loginData.refreshToken);

  res.status(201).json({
    restaurantId: result.restaurantId,
    ...formatLoginResponse(result.loginData),
    message: result.message,
  });
});

//  Get all staff for a restaurant
export const getStaff = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const user = (req as any).user;

  const staff = await getStaffService(user.id, restaurantId);

  res.status(200).json({ staff });
});

// Get all staff across all owned restaurants
export const getAllStaff = asyncHandler(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const staff = await getAllStaffService(user.id);

  res.status(200).json({ staff });
});

//  Update staff permissions
export const updateStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role, permissions } = req.body;
  const user = (req as any).user;

  const staffRecord = await updateStaffService(user.id, id, role as "Owner" | "Manager" | "Staff", permissions);

  res.status(200).json({ message: "Staff updated successfully", staffRecord });
});

//  Remove staff
export const removeStaff = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  const result = await removeStaffService(user.id, id);

  res.status(200).json(result);
});
