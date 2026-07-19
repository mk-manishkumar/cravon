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
