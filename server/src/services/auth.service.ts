import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import UserRole from "../models/userRole.model.js";
import RefreshToken from "../models/refreshToken.model.js";
import Restaurant from "../models/restaurant.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateTokens.js";
import { ApiError } from "../utils/errorHandler.js";

// REGISTER CUSTOMER
export const registerUser = async (data: any) => {
  const { firstName, lastName, email, password, phone } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "Email already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    status: "active",
  });

  const customerRole = await Role.findOne({ roleName: "Customer" });
  if (customerRole) await UserRole.create({ userId: newUser._id, roleId: customerRole._id });

  return newUser;
};

// REGISTER RESTAURANT OWNER SERVICE
export const registerRestaurantOwner = async (data: any) => {
  const { firstName, lastName, email, password, phone, restaurantName } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(400, "Email already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    status: "active",
  });

  const ownerRole = await Role.findOne({ roleName: "RestaurantOwner" });
  if (ownerRole) await UserRole.create({ userId: newUser._id, roleId: ownerRole._id });

  await Restaurant.create({
    ownerId: newUser._id,
    name: restaurantName,
    status: "pending",
  });

  return newUser;
};

// HELPER TO VERIFY USER HAS SPECIFIC ROLE
const verifyUserRole = async (userId: string, expectedRoleNames: string[]) => {
  const userRoles = await UserRole.find({ userId }).populate<{ roleId: any }>("roleId");
  const hasRole = userRoles.some((ur) => expectedRoleNames.includes(ur.roleId.roleName));
  if (!hasRole) {
    throw new ApiError(403, "Access denied: You do not have the required permissions to access this portal.");
  }
};

// GENERIC LOGIN HELPER
const processLogin = async (data: any, expectedRoles: string[]) => {
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

// LOGIN USER SERVICE - CUSTOMER
export const loginUser = async (data: any) => {
  return processLogin(data, ["Customer"]);
};

// LOGIN RESTAURANT OWNER SERVICE
export const loginRestaurantOwner = async (data: any) => {
  return processLogin(data, ["RestaurantOwner"]);
};

// LOGIN ADMIN SERVICE
export const loginAdmin = async (data: any) => {
  return processLogin(data, ["Admin", "SuperAdmin"]);
};
