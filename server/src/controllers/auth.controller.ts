import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema, restaurantRegisterSchema } from "../utils/zod.js";

// Helper to set cookies
const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax' as const,
  };
  
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: Number.parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '86400') * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: Number.parseInt(process.env.JWT_REFRESH_EXPIRES_IN || '604800') * 1000, 
  });
};

const formatLoginResponse = (data: any) => ({
  message: "Login successful",
  user: {
    id: data.user._id,
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    email: data.user.email,
  }
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
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  res.status(200).json({ message: 'Logged out successfully' });
});

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
