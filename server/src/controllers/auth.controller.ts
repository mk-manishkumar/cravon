import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import * as authService from "../services/auth.service.js";
import { registerSchema, loginSchema } from "../utils/zod.js";

// REGISTER CONTROLLERS
export const register = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = registerSchema.parse(req.body);
  await authService.registerUser(parsedData);
  res.status(201).json({ message: "User registered successfully" });
});

// LOGIN CONTROLLER
export const login = asyncHandler(async (req: Request, res: Response) => {
  const parsedData = loginSchema.parse(req.body);
  const data = await authService.loginUser(parsedData);
  res.status(200).json({
    data: {
      user: {
        id: data.user._id,
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
      },
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      },
    },
  });
});
