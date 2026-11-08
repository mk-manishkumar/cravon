import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Driver, { IDriver } from "../models/driver.model.js";
import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";
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

// Service function to register a new driver
export const registerDriverService = async (data: Partial<IDriver>) => {
  const { firstName, lastName, email, password, phone, vehicleDetails, city, profilePicture } = data;

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
    city: city || "Patna",
    profilePicture,
  });

  const token = generateToken(driver._id.toString());
  const driverObj = driver.toObject();
  delete driverObj.password;

  return { driver: driverObj, token };
};

// Service function to fetch driver profile
export const getDriverProfileService = async (driverId: string) => {
  const driver = await Driver.findById(driverId).select("-password");
  if (!driver) throw new ApiError(404, "Driver not found");
  return driver;
};

// Service function to update driver availability status
export const updateDriverStatusService = async (driverId: string, isAvailable: boolean) => {
  const driver = await Driver.findByIdAndUpdate(driverId, { isAvailable }, { new: true }).select("-password");
  if (!driver) throw new ApiError(404, "Driver not found");
  return driver;
};

// Service function to update driver profile
export const updateDriverProfileService = async (driverId: string, profileData: Partial<IDriver>) => {
  const { firstName, lastName, phone, vehicleDetails, profilePicture, city } = profileData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFields: any = {};
  if (firstName !== undefined) updateFields.firstName = firstName;
  if (lastName !== undefined) updateFields.lastName = lastName;
  if (phone !== undefined) updateFields.phone = phone;
  if (vehicleDetails !== undefined) updateFields.vehicleDetails = vehicleDetails;
  if (profilePicture !== undefined) updateFields.profilePicture = profilePicture;
  if (city !== undefined) updateFields.city = city;

  const driver = await Driver.findByIdAndUpdate(
    driverId,
    updateFields,
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
  const driver = await Driver.findById(driverId);
  if (!driver) throw new ApiError(404, "Driver not found");

  const city = driver.city || "Patna";

  // Find restaurants in driver's city
  const restaurantsInCity = await Restaurant.find({
    address: { $regex: new RegExp(city, "i") },
  }).select("_id");
  const restaurantIds = restaurantsInCity.map((r) => r._id);

  const cityFilter = {
    $or: [
      { "deliveryAddress.city": { $regex: new RegExp(`^${city}$`, "i") } },
      { restaurant: { $in: restaurantIds } },
    ],
  };

  const orders = await Order.find({
    $or: [
      { driver: driverId },
      {
        driver: { $exists: false },
        orderStatus: { $in: ["preparing", "ready"] },
        ...cityFilter,
      },
    ],
  })
    .populate("restaurant", "name address location image")
    .populate("user", "firstName lastName phone")
    .sort({ createdAt: -1 });

  return orders;
};

// Service function to fetch driver's deliveries with pagination
export const getDriverDeliveriesService = async (driverId: string, page = 1, limit = 9, status?: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const query: any = { driver: driverId };
  if (status && status !== "all") {
    query.orderStatus = status;
  }

  const total = await Order.countDocuments(query);
  const totalPages = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .populate("restaurant", "name address location image")
    .populate("user", "firstName lastName phone")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    orders,
    total,
    totalPages,
    currentPage: page,
    limit,
  };
};

// Service function to update order status
export const updateOrderStatusService = async (driverId: string, orderId: string, status: string) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, "Order not found");

  if (order.driver && order.driver.toString() !== driverId.toString()) {
    throw new ApiError(403, "You are not assigned to this order");
  }

  // Delivery strictly requires the order to already have been picked up
  if (status === "delivered" && order.orderStatus !== "out_for_delivery") {
    throw new ApiError(400, "Order must be out for delivery before confirming delivery");
  }

  order.orderStatus = status as any;
  order.driver = driverId as any;
  await order.save();

  return order;
};

// Service function to change driver password
export const changeDriverPasswordService = async (driverId: string, data: { oldPassword: string; newPassword: string }) => {
  const { oldPassword, newPassword } = data;
  const driver = await Driver.findById(driverId);
  if (!driver) throw new ApiError(404, "Driver not found");

  const isPasswordValid = await bcrypt.compare(oldPassword, driver.password as string);
  if (!isPasswordValid) throw new ApiError(400, "Incorrect old password");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  driver.password = hashedPassword;
  await driver.save();

  return { message: "Password updated successfully" };
};

// Service function to delete driver account
export const deleteDriverAccountService = async (driverId: string, data: { password: string }) => {
  const { password } = data;
  const driver = await Driver.findById(driverId);
  if (!driver) throw new ApiError(404, "Driver not found");

  const isPasswordValid = await bcrypt.compare(password, driver.password as string);
  if (!isPasswordValid) throw new ApiError(400, "Incorrect password");

  const activeOrder = await Order.findOne({
    driver: driverId,
    orderStatus: { $in: ["preparing", "out_for_delivery"] },
  });
  if (activeOrder) {
    throw new ApiError(400, "Cannot delete account while you have active deliveries in progress");
  }

  await Driver.deleteOne({ _id: driverId });
  return { message: "Account deleted successfully" };
};
