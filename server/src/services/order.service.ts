import crypto from "node:crypto";
import { razorpay } from "../config/razorpay.js";
import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";

interface CreateOrderDTO {
  userId: string;
  restaurantId: string;
  items: { menuItemId: string; name: string; quantity: number }[];
  deliveryAddress: { street: string; city: string; state?: string; zipCode?: string };
  deliveryInstructions?: string;
  paymentMethod: 'online' | 'cod';
}

// Creates a new order — either initiates Razorpay flow or confirms COD directly
export const createOrder = async (data: CreateOrderDTO) => {
  const { userId, restaurantId, items, deliveryAddress, deliveryInstructions, paymentMethod = 'online' } = data;

  // Fetch Restaurant to validate and get menu item prices
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new Error("Restaurant not found");

  // Re-calculate totals securely on backend
  let itemTotal = 0;
  const orderItems = [];

  for (const item of items) {
    if (!item.menuItemId) throw new Error("Menu item ID is required");

    const menuItem = (restaurant.menu ?? []).find(m => {
      const menuId = m._id?.toString?.() ?? m._id;
      return menuId === item.menuItemId;
    });

    if (!menuItem) throw new Error(`Menu item "${item.name}" not found in restaurant menu`);

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

  // ── COD Flow ──
  if (paymentMethod === 'cod') {
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
      paymentMethod: 'cod',
      orderStatus: 'preparing',
      paymentStatus: 'pending', // Payment collected on delivery
    });

    return {
      orderId: newOrder._id,
      paymentMethod: 'cod',
      grandTotal,
    };
  }

  // ── Online (Razorpay) Flow ──
  const razorpayOptions = {
    amount: grandTotal * 100, 
    currency: "INR",
    receipt: `rcpt_${userId}_${Date.now()}`
  };

  const razorpayOrder = await razorpay.orders.create(razorpayOptions);

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
    paymentMethod: 'online',
    razorpayOrderId: razorpayOrder.id,
    orderStatus: 'pending',
    paymentStatus: 'pending'
  });

  return {
    orderId: newOrder._id,
    paymentMethod: 'online',
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

// Fetches all orders for a given user, sorted newest first
export const getMyOrders = async (userId: string) => {
  const orders = await Order.find({ user: userId })
    .populate("restaurant", "name image")
    .sort({ createdAt: -1 })
    .lean();

  return orders;
};
