import crypto from "node:crypto";
import { razorpay } from "../config/razorpay.js";
import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";

interface CreateOrderDTO {
  userId: string;
  restaurantId: string;
  items: { menuItemId: string; quantity: number }[];
  deliveryAddress: { street: string; city: string; state?: string; zipCode?: string };
  deliveryInstructions?: string;
}

// Creates a new order and generates a Razorpay order for payment
export const createOrder = async (data: CreateOrderDTO) => {
  const { userId, restaurantId, items, deliveryAddress, deliveryInstructions } = data;

  // Fetch Restaurant to validate and get menu item prices
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new Error("Restaurant not found");

  // Re-calculate totals securely on backend
  let itemTotal = 0;
  const orderItems = [];

  for (const item of items) {
    // Find item in restaurant menu
    const menuItem = (restaurant.menu ?? []).find(m => m._id?.toString() === item.menuItemId);
    if (!menuItem) throw new Error(`Menu item ${item.menuItemId} not found`);

    itemTotal += menuItem.price * item.quantity;
    orderItems.push({
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity
    });
  }

  // Calculate taxes and fees 
  const deliveryFee = 40; 
  const taxes = Math.round(itemTotal * 0.05);
  const grandTotal = itemTotal + deliveryFee + taxes;

  // Create Razorpay Order
  const razorpayOptions = {
    amount: grandTotal * 100, 
    currency: "INR",
    receipt: `rcpt_${userId}_${Date.now()}`
  };

  const razorpayOrder = await razorpay.orders.create(razorpayOptions);

  // Create Order in MongoDB
  const newOrder = await Order.create({
    user: userId,
    restaurant: restaurantId,
    items: orderItems,
    itemTotal,
    deliveryFee,
    taxes,
    grandTotal,
    deliveryAddress,
    deliveryInstructions,
    razorpayOrderId: razorpayOrder.id,
    orderStatus: 'pending',
    paymentStatus: 'pending'
  });

  return {
    orderId: newOrder._id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOptions.amount,
    currency: razorpayOptions.currency,
    grandTotal
  };
};

// Verifies the Razorpay payment signature
export const verifyPayment = async (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("Razorpay secret not configured");

  // Generate expected signature
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
  const expectedSignature = shasum.digest("hex");

  // Compare signatures
  if (expectedSignature !== razorpaySignature) {
    // Update order to failed
    await Order.findOneAndUpdate(
      { razorpayOrderId },
      { paymentStatus: 'failed' }
    );
    throw new Error("Invalid payment signature");
  }

  // Signature is valid, update Order to paid
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId },
    { 
      paymentStatus: 'paid',
      orderStatus: 'preparing', 
      razorpayPaymentId,
      razorpaySignature
    },
    { new: true }
  );

  if (!order) throw new Error("Order not found for this Razorpay ID");

  return order;
};
