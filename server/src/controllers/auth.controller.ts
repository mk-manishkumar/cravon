import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema, restaurantRegisterSchema } from "../utils/zod.js";
import { setAuthCookies, formatLoginResponse } from "../utils/auth.utils.js";

// CUSTOMER CONTROLLERS
export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = registerSchema.parse(req.body);
  await authService.registerUser(parsedData);
  res.status(201).json({ message: "User registered successfully" });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = loginSchema.parse(req.body);
  const data = await authService.loginUser(parsedData);
  setAuthCookies(res, data.accessToken, data.refreshToken);
  res.status(200).json(formatLoginResponse(data));
});

// RESTAURANT PARTNER CONTROLLERS
export const registerRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = restaurantRegisterSchema.parse(req.body);
  await authService.registerRestaurantOwner(parsedData);
  res.status(201).json({ message: "Restaurant partner registered successfully" });
});

export const verifyRestaurantOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    res.status(400).json({ message: "Email and OTP are required" });
    return;
  }
  const data = await authService.verifyRestaurantOtp({ email, otp });
  setAuthCookies(res, data.accessToken, data.refreshToken);
  res.status(200).json(formatLoginResponse(data));
});

export const resendRestaurantOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }
  await authService.resendRestaurantOtp({ email });
  res.status(200).json({ message: "OTP resent successfully" });
});

export const loginRestaurant = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = loginSchema.parse(req.body);
  const data = await authService.loginRestaurantOwner(parsedData);
  setAuthCookies(res, data.accessToken, data.refreshToken);
  res.status(200).json(formatLoginResponse(data));
});

// ADMIN CONTROLLERS
export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = loginSchema.parse(req.body);
  const data = await authService.loginAdmin(parsedData);
  setAuthCookies(res, data.accessToken, data.refreshToken);
  res.status(200).json(formatLoginResponse(data));
});

// GET CURRENT USER PROFILE
export const getMe = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore - user is attached by verifyJWT middleware
  res.status(200).json({ user: req.user });
});

// LOGOUT
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({ message: "Logged out successfully" });
});
