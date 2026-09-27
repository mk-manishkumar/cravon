import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import { createOrder as createOrderService, verifyPayment as verifyPaymentService, getMyOrders as getMyOrdersService, getRestaurantOrdersService, getPartnerNotificationsService, updateOrderStatusService, autoDeliverOrdersService } from "../services/order.service.js";

// Controller for creating a new order
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId, items, deliveryAddress, deliveryInstructions, paymentMethod } = req.body;
  const userId = (req as any).user.id;

  if (!restaurantId || !items?.length || !deliveryAddress) {
    throw new ApiError(400, "Missing required order fields");
  }

  const orderData = await createOrderService({
    userId,
    restaurantId,
    items,
    deliveryAddress,
    deliveryInstructions,
    paymentMethod: paymentMethod || "online",
  });

  res.status(201).json({
    status: "success",
    data: orderData,
  });
});

// Controller for verifying Razorpay payment
export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new ApiError(400, "Missing payment verification parameters");
  }

  const order = await verifyPaymentService(razorpay_order_id, razorpay_payment_id, razorpay_signature);

  res.status(200).json({
    status: "success",
    message: "Payment verified successfully",
    orderId: order._id,
  });
});

// Controller for fetching all orders for the logged-in user
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const orders = await getMyOrdersService(userId);

  res.status(200).json({
    status: "success",
    data: orders,
  });
});

// Retrieves all orders for a specific restaurant
export const getRestaurantOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await getRestaurantOrdersService(req.params.id, (req as any).user.id);
  res.status(200).json({ status: "success", data: orders });
});

// Fetches recent orders across all restaurants where the user has access
export const getPartnerNotifications = asyncHandler(async (req: Request, res: Response) => {
  const orders = await getPartnerNotificationsService((req as any).user.id);
  res.status(200).json({ status: "success", data: orders });
});

// Updates the status of a specific order
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const order = await updateOrderStatusService(req.params.id, req.body.status, (req as any).user.id);
  res.status(200).json({ status: "success", message: "Order status updated", data: order });
});

// Cron endpoint to automatically transition stale orders from 'preparing' to 'delivered'
export const autoDeliverOrders = asyncHandler(async (req: Request, res: Response) => {
  const updatedCount = await autoDeliverOrdersService();
  res.status(200).json({ status: "success", message: "Cron swept", updatedCount });
});
