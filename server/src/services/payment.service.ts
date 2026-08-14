import Razorpay from "razorpay";
import crypto from "node:crypto";
import { ApiError } from "../utils/errorHandler.js";
import User from "../models/user.model.js";
import { getTierConfig } from "../config/pricing.config.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
});

export const createRazorpayOrder = async (userId: string, tierId: string) => {
  const tierConfig = getTierConfig(tierId);
  if (tierConfig.id === "free") throw new ApiError(400, "Cannot create an order for the free tier");

  // Razorpay expects amount in paisa
  const amountInPaisa = tierConfig.price * 100;

  const options = {
    amount: amountInPaisa,
    currency: "INR",
    receipt: `receipt_order_${userId}_${Date.now()}`,
    notes: {
      userId,
      tierId: tierConfig.id,
    },
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error: any) {
    throw new ApiError(500, error.message || "Failed to create Razorpay order");
  }
};

// Verify Razorpay Payment and Upgrade User
export const verifyPaymentAndUpgradeUser = async (
  userId: string,
  paymentDetails: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    tierId: string;
  },
) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tierId } = paymentDetails;

  // Verify signature
  const secret = process.env.RAZORPAY_KEY_SECRET || "placeholder_secret";
  const generatedSignature = crypto.createHmac("sha256", secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");

  if (generatedSignature !== razorpay_signature) throw new ApiError(400, "Invalid payment signature");

  const tierConfig = getTierConfig(tierId);

  // Upgrade the user
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Add 30 days of access
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  user.subscription = {
    tier: tierConfig.id,
    status: "active",
    expiresAt,
  };

  await user.save();

  return {
    tierName: tierConfig.name,
    subscription: user.subscription,
  };
};
