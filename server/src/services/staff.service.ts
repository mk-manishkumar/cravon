import crypto from "node:crypto";
import mongoose from "mongoose";
import RestaurantStaff from "../models/restaurantStaff.model.js";
import Restaurant from "../models/restaurant.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/errorHandler.js";
import { processLogin } from "../utils/auth.utils.js";
import bcrypt from "bcryptjs";
import Role from "../models/role.model.js";
import UserRole from "../models/userRole.model.js";
import { sendInviteEmail } from "../utils/mailer.js";
import { getTierConfig } from "../config/pricing.config.js";

// Invite a staff member to a restaurant
export const inviteStaffService = async (userId: string, userSubscriptionTier: string, restaurantId: string, email: string, role: 'Owner' | 'Manager' | 'Staff', permissions: string[]) => {
  // Verify caller owns the restaurant or is a Manager/Owner in staff table
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  const isDirectOwner = restaurant.ownerId.toString() === userId.toString();
  if (!isDirectOwner) {
    const staffRecord = await RestaurantStaff.findOne({ userId, restaurantId, status: "active" });
    if (!staffRecord || (staffRecord.role !== "Owner" && staffRecord.role !== "Manager")) {
      throw new ApiError(403, "You do not have permission to invite staff for this restaurant");
    }
  }

  // Enforce Staff Limits based on tier
  const tierConfig = getTierConfig(userSubscriptionTier);
  const currentStaffCount = await RestaurantStaff.countDocuments({
    restaurantId,
    role: { $ne: "Owner" },
  });

  if (currentStaffCount >= tierConfig.maxStaff) {
    throw new ApiError(403, `Your current plan only allows ${tierConfig.maxStaff} staff members. Please upgrade your plan to add more.`);
  }

  // Check if user exists
  const targetUser = await User.findOne({ email });

  // Check if invite already exists
  const existingRecord = await RestaurantStaff.findOne({
    restaurantId,
    $or: [{ email }, { userId: targetUser?._id }],
  });

  if (existingRecord) {
    if (existingRecord.status === "active") throw new ApiError(400, "This user is already an active staff member.");

    await RestaurantStaff.deleteOne({ _id: existingRecord._id });
  }

  // Create invite token
  const inviteToken = crypto.randomBytes(32).toString("hex");
  const inviteExpiresAt = new Date();
  inviteExpiresAt.setDate(inviteExpiresAt.getDate() + 7); // 7 days

  // Create RestaurantStaff record
  await RestaurantStaff.create({
    userId: targetUser?._id,
    restaurantId,
    role,
    permissions,
    status: "pending",
    inviteToken,
    inviteExpiresAt,
    invitedBy: userId,
    email,
  });

  // Send email
  const inviteUrl = `${process.env.CLIENT_URL}/staff/accept-invite?token=${inviteToken}`;
  await sendInviteEmail(email, inviteUrl, restaurant.name);

  return { message: "Invite sent successfully" };
};

// Accept staff invite
export const acceptInviteService = async (token: string, currentUserId: string) => {
  const staffRecord = await RestaurantStaff.findOne({
    inviteToken: token,
    status: "pending",
    inviteExpiresAt: { $gt: new Date() },
  });

  if (!staffRecord) throw new ApiError(400, "Invalid or expired invite token");

  const user = await User.findById(currentUserId);
  if (!user?.email || user.email !== staffRecord.email) throw new ApiError(403, "You must be logged in with the email address that was invited.");

  staffRecord.status = "active";
  staffRecord.userId = new mongoose.Types.ObjectId(currentUserId);
  staffRecord.inviteToken = undefined;
  staffRecord.inviteExpiresAt = undefined;

  await staffRecord.save();

  return { message: "Invite accepted successfully", restaurantId: staffRecord.restaurantId };
};

export const getInviteDetailsService = async (token: string) => {
  const staffRecord = await RestaurantStaff.findOne({
    inviteToken: token,
    status: "pending",
    inviteExpiresAt: { $gt: new Date() },
  }).populate("restaurantId", "name");

  if (!staffRecord) throw new ApiError(400, "Invalid or expired invite token");

  const existingUser = await User.findOne({ email: staffRecord.email });

  return {
    email: staffRecord.email,
    restaurantName: (staffRecord.restaurantId as any).name,
    accountExists: !!existingUser
  };
};

export const acceptInviteNewUserService = async (data: any) => {
  const { token, firstName, lastName, password } = data;

  const staffRecord = await RestaurantStaff.findOne({
    inviteToken: token,
    status: "pending",
    inviteExpiresAt: { $gt: new Date() },
  });

  if (!staffRecord) throw new ApiError(400, "Invalid or expired invite token");

  const existingUser = await User.findOne({ email: staffRecord.email });
  if (existingUser) throw new ApiError(400, "An account with this email already exists. Please log in to accept the invite.");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    email: staffRecord.email,
    password: hashedPassword,
    phone: "",
    status: "active",
    isVerified: true, // Auto verify since they received the invite email
  });

  // Assign RestaurantOwner role so they can log into the partner portal
  const ownerRole = await Role.findOne({ roleName: "RestaurantOwner" });
  if (ownerRole) await UserRole.create({ userId: newUser._id, roleId: ownerRole._id });

  staffRecord.status = "active";
  staffRecord.userId = newUser._id;
  staffRecord.inviteToken = undefined;
  staffRecord.inviteExpiresAt = undefined;

  await staffRecord.save();

  // Log them in automatically
  const loginData = await processLogin({ email: staffRecord.email, password: "" }, ["RestaurantOwner"], true);

  return { 
    message: "Account created and invite accepted successfully", 
    restaurantId: staffRecord.restaurantId,
    loginData
  };
};

export const getStaffService = async (userId: string, restaurantId: string) => {
  // Verify access
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  const isDirectOwner = restaurant.ownerId.toString() === userId.toString();
  if (!isDirectOwner) {
    const staffRecord = await RestaurantStaff.findOne({ userId, restaurantId, status: "active" });
    if (!staffRecord) {
      throw new ApiError(403, "You do not have permission to view staff for this restaurant");
    }
  }

  const staff = await RestaurantStaff.find({ restaurantId }).populate("userId", "firstName lastName email phone");
  return staff;
};

// Get all staff across all restaurants for a partner or manager
export const getAllStaffService = async (userId: string) => {
  // Find all restaurants owned by the user
  const ownedRestaurants = await Restaurant.find({ ownerId: userId }).select("_id name");
  const restaurantIds = ownedRestaurants.map(r => r._id);

  // Find all restaurants where user is an active Manager or Owner in staff table
  const staffRecords = await RestaurantStaff.find({ 
    userId, 
    status: "active",
    role: { $in: ["Manager", "Owner"] }
  }).select("restaurantId");
  
  for (const record of staffRecords) {
    if (!restaurantIds.some(id => id.toString() === record.restaurantId.toString())) {
      restaurantIds.push(record.restaurantId);
    }
  }

  // Find all staff belonging to these restaurants
  const staff = await RestaurantStaff.find({ restaurantId: { $in: restaurantIds } })
    .populate("userId", "firstName lastName email phone")
    .populate("restaurantId", "name"); // populate the restaurant name

  return staff;
};

// Update staff permissions
export const updateStaffService = async (userId: string, staffId: string, role?: 'Owner' | 'Manager' | 'Staff', permissions?: string[]) => {
  const staffRecord = await RestaurantStaff.findById(staffId);
  if (!staffRecord) throw new ApiError(404, "Staff record not found");

  const restaurant = await Restaurant.findById(staffRecord.restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  const isDirectOwner = restaurant.ownerId.toString() === userId.toString();
  if (!isDirectOwner) {
    const callerStaffRecord = await RestaurantStaff.findOne({ userId, restaurantId: restaurant._id, status: "active" });
    if (!callerStaffRecord || (callerStaffRecord.role !== "Owner" && callerStaffRecord.role !== "Manager")) {
      throw new ApiError(403, "Permission denied");
    }
  }

  if (role) staffRecord.role = role;
  if (permissions) staffRecord.permissions = permissions;

  await staffRecord.save();

  return staffRecord;
};

// Remove staff
export const removeStaffService = async (userId: string, staffId: string) => {
  const staffRecord = await RestaurantStaff.findById(staffId);
  if (!staffRecord) throw new ApiError(404, "Staff record not found");

  const restaurant = await Restaurant.findById(staffRecord.restaurantId);
  if (!restaurant) throw new ApiError(404, "Restaurant not found");

  const isDirectOwner = restaurant.ownerId.toString() === userId.toString();
  if (!isDirectOwner) {
    const callerStaffRecord = await RestaurantStaff.findOne({ userId, restaurantId: restaurant._id, status: "active" });
    if (!callerStaffRecord || (callerStaffRecord.role !== "Owner" && callerStaffRecord.role !== "Manager")) {
      throw new ApiError(403, "Permission denied");
    }
  }

  await RestaurantStaff.deleteOne({ _id: staffId });

  return { message: "Staff removed successfully" };
};
