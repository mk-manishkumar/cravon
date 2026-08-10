import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import UserRole from "../models/userRole.model.js";
import Restaurant from "../models/restaurant.model.js";
import Otp from "../models/otp.model.js";
import { ApiError } from "../utils/errorHandler.js";
import { processLogin } from "../utils/auth.utils.js";
import { sendOtpEmail } from "../utils/mailer.js";

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
  const { firstName, lastName, email, password, phone } = data;

  const existingUser = await User.findOne({ email });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let targetUser;

  if (existingUser) {
    if (existingUser.isVerified) {
      throw new ApiError(400, "Email already exists");
    } else {
      // Overwrite the old data
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.phone = phone;
      existingUser.password = hashedPassword;
      await existingUser.save();

      // Update restaurant name just in case they changed their name
      const existingRestaurant = await Restaurant.findOne({ ownerId: existingUser._id });
      if (existingRestaurant) {
        existingRestaurant.name = `${firstName} ${lastName}'s Restaurant`;
        await existingRestaurant.save();
      }

      // Delete old OTPs
      await Otp.deleteMany({ email });
      targetUser = existingUser;
    }
  } else {
    // Normal Registration
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      status: "active",
      isVerified: false,
    });

    const ownerRole = await Role.findOne({ roleName: "RestaurantOwner" });
    if (ownerRole) await UserRole.create({ userId: newUser._id, roleId: ownerRole._id });

    await Restaurant.create({
      ownerId: newUser._id,
      name: `${firstName} ${lastName}'s Restaurant`,
      status: "pending",
    });

    targetUser = newUser;
  }

  // Generate 6-digit OTP
  const otpCode = crypto.randomInt(100000, 1000000).toString();
  await Otp.create({ email, otpCode });

  // Send OTP Email
  await sendOtpEmail(email, otpCode);

  return targetUser;
};

// VERIFY RESTAURANT OTP SERVICE
export const verifyRestaurantOtp = async (data: any) => {
  const { email, otp } = data;

  const otpRecord = await Otp.findOne({ email, otpCode: otp });
  if (!otpRecord) throw new ApiError(400, "Invalid or expired OTP");

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  user.isVerified = true;
  await user.save();

  await Otp.deleteOne({ _id: otpRecord._id });

  // After successful verification, immediately log them in
  return processLogin({ email, password: "" }, ["RestaurantOwner"], true); // skipPasswordCheck flag
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

// RESEND RESTAURANT OTP SERVICE
export const resendRestaurantOtp = async (data: { email: string }) => {
  const { email } = data;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");
  if (user.isVerified) throw new ApiError(400, "User is already verified");

  // Delete any existing OTPs for this email to prevent spam/confusion
  await Otp.deleteMany({ email });

  // Generate new 6-digit OTP
  const otpCode = crypto.randomInt(100000, 1000000).toString();
  await Otp.create({ email, otpCode });

  // Send OTP Email
  await sendOtpEmail(email, otpCode);

  return { message: "OTP resent successfully" };
};

// UPDATE PROFILE SERVICE
export const updateProfile = async (userId: string, data: any) => {
  const { firstName, lastName, phone } = data;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  
  await user.save();
  return user;
};

// CHANGE PASSWORD SERVICE
export const changePassword = async (userId: string, data: any) => {
  const { oldPassword, newPassword } = data;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password!);
  if (!isPasswordValid) throw new ApiError(400, "Incorrect old password");

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  await user.save();

  return { message: "Password updated successfully" };
};

// REQUEST EMAIL CHANGE SERVICE
export const requestEmailChange = async (userId: string, data: any) => {
  const { newEmail } = data;
  const existingUser = await User.findOne({ email: newEmail });
  if (existingUser) throw new ApiError(400, "Email is already in use");

  // Generate 6-digit OTP
  const otpCode = crypto.randomInt(100000, 1000000).toString();
  await Otp.deleteMany({ email: newEmail });
  await Otp.create({ email: newEmail, otpCode });
  
  await sendOtpEmail(newEmail, otpCode);
  
  return { message: "OTP sent to new email address" };
};

// VERIFY EMAIL CHANGE SERVICE
export const verifyEmailChange = async (userId: string, data: any) => {
  const { newEmail, otp } = data;
  
  const otpRecord = await Otp.findOne({ email: newEmail, otpCode: otp });
  if (!otpRecord) throw new ApiError(400, "Invalid or expired OTP");

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.email = newEmail;
  await user.save();
  await Otp.deleteOne({ _id: otpRecord._id });

  return { message: "Email updated successfully", user };
};

// DELETE ACCOUNT SERVICE
export const deleteAccount = async (userId: string, data: any) => {
  const { password } = data;
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password!);
  if (!isPasswordValid) throw new ApiError(400, "Incorrect password");

  await Restaurant.deleteOne({ ownerId: userId });
  await UserRole.deleteMany({ userId });
  await User.deleteOne({ _id: userId });

  return { message: "Account deleted successfully" };
};
