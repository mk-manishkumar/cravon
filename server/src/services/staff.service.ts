import crypto from "node:crypto";
import mongoose from "mongoose";
import RestaurantStaff from "../models/restaurantStaff.model.js";
import Restaurant from "../models/restaurant.model.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/errorHandler.js";
import { sendInviteEmail } from "../utils/mailer.js";
import { getTierConfig } from "../config/pricing.config.js";

// Invite a staff member to a restaurant
export const inviteStaffService = async (userId: string, userSubscriptionTier: string, restaurantId: string, email: string, role: 'Owner' | 'Manager' | 'Staff', permissions: string[]) => {
  // Verify caller owns the restaurant
  const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: userId });
  if (!restaurant) {
    throw new ApiError(403, "You do not have permission to invite staff for this restaurant");
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

export const getStaffService = async (userId: string, restaurantId: string) => {
  // Verify access
  const restaurant = await Restaurant.findOne({ _id: restaurantId, ownerId: userId });
  if (!restaurant) throw new ApiError(403, "You do not have permission to view staff for this restaurant");

  const staff = await RestaurantStaff.find({ restaurantId }).populate("userId", "firstName lastName email phone");
  return staff;
};

// Update staff permissions
export const updateStaffService = async (userId: string, staffId: string, role?: 'Owner' | 'Manager' | 'Staff', permissions?: string[]) => {
  const staffRecord = await RestaurantStaff.findById(staffId);
  if (!staffRecord) throw new ApiError(404, "Staff record not found");

  const restaurant = await Restaurant.findOne({ _id: staffRecord.restaurantId, ownerId: userId });
  if (!restaurant) throw new ApiError(403, "Permission denied");

  if (role) staffRecord.role = role;
  if (permissions) staffRecord.permissions = permissions;

  await staffRecord.save();

  return staffRecord;
};

// Remove staff
export const removeStaffService = async (userId: string, staffId: string) => {
  const staffRecord = await RestaurantStaff.findById(staffId);
  if (!staffRecord) throw new ApiError(404, "Staff record not found");

  const restaurant = await Restaurant.findOne({ _id: staffRecord.restaurantId, ownerId: userId });
  if (!restaurant) throw new ApiError(403, "Permission denied");

  await RestaurantStaff.deleteOne({ _id: staffId });

  return { message: "Staff removed successfully" };
};
