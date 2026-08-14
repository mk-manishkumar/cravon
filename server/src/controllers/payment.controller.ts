import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import { createRazorpayOrder, verifyPaymentAndUpgradeUser } from "../services/payment.service.js";

// Create Razorpay Order
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { tierId } = req.body;
  if (!tierId) throw new ApiError(400, "Tier ID is required");

  const order = await createRazorpayOrder(userId, tierId);

  res.status(200).json({
    status: "success",
    data: order,
  });
});

// Verify Razorpay Payment and Upgrade User
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  if (!userId) throw new ApiError(401, "Unauthorized");

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, tierId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !tierId) {
    throw new ApiError(400, "Incomplete payment details");
  }

  const result = await verifyPaymentAndUpgradeUser(userId, {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    tierId,
  });

  res.status(200).json({
    status: "success",
    message: `Successfully upgraded to ${result.tierName} plan!`,
    data: result.subscription,
  });
});
