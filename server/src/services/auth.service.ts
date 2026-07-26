import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import UserRole from "../models/userRole.model.js";
import Restaurant from "../models/restaurant.model.js";
import { ApiError } from "../utils/errorHandler.js";
import { processLogin } from "../utils/auth.utils.js";

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
