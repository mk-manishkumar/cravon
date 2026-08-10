import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(4, "Password must be at least 4 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const restaurantRegisterSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email({ message: "Invalid email format" }),
  password: z.string().min(4, "Password must be at least 4 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").optional(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(4, "New password must be at least 4 characters"),
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1, "Password is required to delete account"),
});

export const requestEmailChangeSchema = z.object({
  newEmail: z.string().email({ message: "Invalid email format" }),
});

export const verifyEmailChangeSchema = z.object({
  newEmail: z.string().email({ message: "Invalid email format" }),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});
