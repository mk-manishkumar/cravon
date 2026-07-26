import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import UserRole from "../models/userRole.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import { generateAccessToken, generateRefreshToken } from "./generateTokens.js";
import { ApiError } from "./errorHandler.js";
import { Response } from "express";

// HELPER TO VERIFY USER HAS SPECIFIC ROLE
export const verifyUserRole = async (userId: string, expectedRoleNames: string[]) => {
  const userRoles = await UserRole.find({ userId }).populate<{ roleId: any }>("roleId");
  const hasRole = userRoles.some((ur) => expectedRoleNames.includes(ur.roleId.roleName));
  if (!hasRole) {
    throw new ApiError(403, "Access denied: You do not have the required permissions to access this portal.");
  }
};

// GENERIC LOGIN HELPER
export const processLogin = async (data: any, expectedRoles: string[]) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isMatch = await bcrypt.compare(password, user.password || "");
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  // Strict RBAC check
  await verifyUserRole(user._id.toString(), expectedRoles);

  const accessToken = generateAccessToken(user._id.toString());
  const refreshTokenStr = generateRefreshToken(user._id.toString());

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    userId: user._id,
    token: refreshTokenStr,
    expiresAt,
    isRevoked: false,
  });

  return { user, accessToken, refreshToken: refreshTokenStr };
};

// Helper to set cookies
export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax" as const,
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: Number.parseInt(process.env.JWT_ACCESS_EXPIRES_IN || "86400") * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: Number.parseInt(process.env.JWT_REFRESH_EXPIRES_IN || "604800") * 1000,
  });
};

// Helper to format login response
export const formatLoginResponse = (data: any) => ({
  message: "Login successful",
  user: {
    id: data.user._id,
    firstName: data.user.firstName,
    lastName: data.user.lastName,
    email: data.user.email,
  },
});
