import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Driver, { IDriver } from "../models/driver.model.js";
import Order from "../models/order.model.js";
import { ApiError } from "../utils/errorHandler.js";

// Helper to generate token
const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET || "fallback_secret";
  const expiresIn = process.env.JWT_DRIVER_EXPIRES_IN || "30d";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return jwt.sign({ id, role: "driver" }, secret, { expiresIn: expiresIn as any });
};

// Service functions for driver operations
export const loginDriverService = async (email: string, password?: string) => {
  const driver = await Driver.findOne({ email });

  if (!driver) throw new ApiError(401, "Invalid credentials");
  if (!password) throw new ApiError(400, "Password is required");

  const isMatch = await bcrypt.compare(password, driver.password as string);
  if (!isMatch) throw new ApiError(401, "Invalid credentials");

  const token = generateToken(driver._id.toString());
  const driverObj = driver.toObject();
  delete driverObj.password;

  return { driver: driverObj, token };
};

export const registerDriverService = async (data: Partial<IDriver>) => {
  const { firstName, lastName, email, password, phone, vehicleDetails } = data;

  const existingDriver = await Driver.findOne({ email });
  if (existingDriver) throw new ApiError(400, "Driver with this email already exists");

  if (!password) throw new ApiError(400, "Password is required");

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const driver = await Driver.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    phone,
    vehicleDetails,
  });

  const token = generateToken(driver._id.toString());
  const driverObj = driver.toObject();
  delete driverObj.password;

  return { driver: driverObj, token };
};

// Service function to update driver availability status
export const updateDriverStatusService = async (driverId: string, isAvailable: boolean) => {
  const driver = await Driver.findByIdAndUpdate(driverId, { isAvailable }, { new: true }).select("-password");
  if (!driver) throw new ApiError(404, "Driver not found");
  return driver;
};

// Service function to update driver profile
export const updateDriverProfileService = async (driverId: string, profileData: Partial<IDriver>) => {
  const { firstName, lastName, phone, vehicleDetails } = profileData;
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { firstName, lastName, phone, vehicleDetails },
    { new: true, runValidators: true }
  ).select("-password");
  
  if (!driver) throw new ApiError(404, "Driver not found");
  return driver;
};

// Service function to update driver location
export const updateDriverLocationService = async (driverId: string, latitude: number, longitude: number) => {
  await Driver.findByIdAndUpdate(driverId, { location: { latitude, longitude } });
};

// Service function to fetch driver's orders
export const getDriverOrdersService = async (driverId: string) => {
  const orders = await Order.find({
    $or: [{ driver: driverId }, { driver: { $exists: false }, orderStatus: { $in: ["preparing", "ready"] } }],
  })
    .populate("restaurant", "name")
    .populate("user", "firstName lastName")
    .sort({ createdAt: -1 });

  return orders;
};

// Service function to update order status
export const updateOrderStatusService = async (driverId: string, orderId: string, status: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  order.orderStatus = status as any;
  order.driver = driverId as any;
  await order.save();

  return order;
};
