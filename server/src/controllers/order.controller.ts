import { Request, Response } from "express";
import { createOrder as createOrderService, verifyPayment as verifyPaymentService } from "../services/order.service.js";

// Controller for creating a new order
export const createOrder = async (req: Request, res: Response): Promise<any> => {
  try {
    const { restaurantId, items, deliveryAddress, deliveryInstructions } = req.body;
    const userId = (req as any).user._id;

    if (!restaurantId || !items?.length || !deliveryAddress) {
      return res.status(400).json({ status: "error", message: "Missing required order fields" });
    }

    const orderData = await createOrderService({
      userId,
      restaurantId,
      items,
      deliveryAddress,
      deliveryInstructions
    });

    res.status(201).json({
      status: "success",
      data: orderData
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

    const order = await verifyPaymentService(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    res.status(200).json({
      status: "success",
      message: "Payment verified successfully",
      orderId: order._id
    });
  } catch (error: any) {
    console.error("Verify Payment Error:", error);
    res.status(400).json({ status: "error", message: error.message || "Payment verification failed" });
  }
};
