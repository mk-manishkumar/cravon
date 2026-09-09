import { Request, Response } from "express";
import { createOrder as createOrderService, verifyPayment as verifyPaymentService, getMyOrders as getMyOrdersService, getRestaurantOrdersService, getPartnerNotificationsService, updateOrderStatusService, autoDeliverOrdersService } from "../services/order.service.js";

// Controller for creating a new order
export const createOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { restaurantId, items, deliveryAddress, deliveryInstructions, paymentMethod } = req.body;
    const userId = (req as any).user.id;

    if (!restaurantId || !items?.length || !deliveryAddress) {
      return res.status(400).json({ status: "error", message: "Missing required order fields" });
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
  } catch (error: any) {
    console.error("Create Order Error:", error);
    res.status(500).json({ status: "error", message: error.message || "Failed to create order" });
  }
};

// Controller for verifying Razorpay payment
export const verifyPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ status: "error", message: "Missing payment verification parameters" });
    }

    const order = await verifyPaymentService(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    res.status(200).json({
      status: "success",
      message: "Payment verified successfully",
      orderId: order._id,
    });
  } catch (error: any) {
    console.error("Verify Payment Error:", error);
    res.status(400).json({ status: "error", message: error.message || "Payment verification failed" });
  }
};

// Controller for fetching all orders for the logged-in user
export const getMyOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user.id;
    const orders = await getMyOrdersService(userId);

    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error: any) {
    console.error("Get Orders Error:", error);
    res.status(500).json({ status: "error", message: error.message || "Failed to fetch orders" });
  }
};

// Retrieves all orders for a specific restaurant
export const getRestaurantOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const orders = await getRestaurantOrdersService(req.params.id, (req as any).user.id);
    res.status(200).json({ status: "success", data: orders });
  } catch (error: any) {
    if (error.message === "Forbidden") return res.status(403).json({ status: "error", message: "Forbidden" });
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Fetches recent orders across all restaurants where the user has access
export const getPartnerNotifications = async (req: Request, res: Response): Promise<any> => {
  try {
    const orders = await getPartnerNotificationsService((req as any).user.id);
    res.status(200).json({ status: "success", data: orders });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Updates the status of a specific order
export const updateOrderStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const order = await updateOrderStatusService(req.params.id, req.body.status, (req as any).user.id);
    res.status(200).json({ status: "success", message: "Order status updated", data: order });
  } catch (error: any) {
    if (error.message === "Forbidden") return res.status(403).json({ status: "error", message: "Forbidden" });
    if (error.message === "Order not found") return res.status(404).json({ status: "error", message: "Order not found" });
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Cron endpoint to automatically transition stale orders from 'preparing' to 'delivered'
export const autoDeliverOrders = async (req: Request, res: Response): Promise<any> => {
  try {
    const updatedCount = await autoDeliverOrdersService();
    res.status(200).json({ status: "success", message: "Cron swept", updatedCount });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
