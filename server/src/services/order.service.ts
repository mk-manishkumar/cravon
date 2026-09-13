import crypto from "node:crypto";
import { razorpay } from "../config/razorpay.js";
import Order from "../models/order.model.js";
import Restaurant from "../models/restaurant.model.js";
import RestaurantStaff from "../models/restaurantStaff.model.js";
import { sendRefundEmail } from "../utils/mailer.js";

interface CreateOrderDTO {
  userId: string;
  restaurantId: string;
  items: { menuItemId: string; name: string; quantity: number }[];
  deliveryAddress: { street: string; city: string; state?: string; zipCode?: string };
  deliveryInstructions?: string;
  paymentMethod: "online" | "cod";
}

// Creates a new order — either initiates Razorpay flow or confirms COD directly
export const createOrder = async (data: CreateOrderDTO) => {
  const { userId, restaurantId, items, deliveryAddress, deliveryInstructions, paymentMethod = "online" } = data;

  // Fetch Restaurant to validate and get menu item prices
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) throw new Error("Restaurant not found");

  // Re-calculate totals securely on backend
  let itemTotal = 0;
  const orderItems = [];

  for (const item of items) {
    if (!item.menuItemId) throw new Error("Menu item ID is required");

    const menuItem = (restaurant.menu ?? []).find((m) => {
      const menuId = m._id?.toString?.() ?? m._id;
      return menuId === item.menuItemId;
    });

    if (!menuItem) throw new Error(`Menu item "${item.name}" not found in restaurant menu`);

    itemTotal += menuItem.price * item.quantity;
    orderItems.push({
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: item.quantity,
    });
  }

  // Calculate taxes and fees
  const deliveryFee = 40;
  const taxes = Math.round(itemTotal * 0.05);
  const grandTotal = itemTotal + deliveryFee + taxes;

  // ── COD Flow ──
  if (paymentMethod === "cod") {
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
      paymentMethod: "cod",
      orderStatus: "pending",
      paymentStatus: "pending", // Payment collected on delivery
    });

    return {
      orderId: newOrder._id,
      paymentMethod: "cod",
      grandTotal,
    };
  }

  // ── Online (Razorpay) Flow ──
  const razorpayOptions = {
    amount: grandTotal * 100,
    currency: "INR",
    receipt: `rcpt_${userId}_${Date.now()}`,
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
    paymentMethod: "online",
    razorpayOrderId: razorpayOrder.id,
    orderStatus: "pending",
    paymentStatus: "pending",
  });

  return {
    orderId: newOrder._id,
    paymentMethod: "online",
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOptions.amount,
    currency: razorpayOptions.currency,
    grandTotal,
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
    await Order.findOneAndUpdate({ razorpayOrderId }, { paymentStatus: "failed" });
    throw new Error("Invalid payment signature");
  }

  // Signature is valid, update Order to paid
  const order = await Order.findOneAndUpdate(
    { razorpayOrderId },
    {
      paymentStatus: "paid",
      orderStatus: "pending",
      razorpayPaymentId,
      razorpaySignature,
    },
    { new: true },
  );

  if (!order) throw new Error("Order not found for this Razorpay ID");

  return order;
};

// Fetches all orders for a given user, sorted newest first
export const getMyOrders = async (userId: string) => {
  // Lazy evaluation: sweep stale orders before returning
  await autoDeliverOrdersService();

  return await Order.find({ user: userId }).sort({ createdAt: -1 }).populate("restaurant", "name image address deliveryTime status");
};

// Helper to check if user has access to restaurant
export const verifyRestaurantAccess = async (userId: string, restaurantId: string): Promise<boolean> => {
  const isOwner = await Restaurant.exists({ _id: restaurantId, ownerId: userId });
  if (isOwner) return true;
  const isStaff = await RestaurantStaff.exists({ userId, restaurantId, status: "active" });
  return !!isStaff;
};

// Retrieves all orders for a specific restaurant
export const getRestaurantOrdersService = async (restaurantId: string, userId: string) => {
  if (!(await verifyRestaurantAccess(userId, restaurantId))) {
    throw new Error("Forbidden");
  }

  // sweep stale orders before returning
  await autoDeliverOrdersService();

  return await Order.find({ restaurant: restaurantId }).sort({ createdAt: -1 }).populate("user", "firstName lastName email phone");
};

// Fetches recent orders across all restaurants where the user has access
export const getPartnerNotificationsService = async (userId: string) => {
  // sweep stale orders before returning
  await autoDeliverOrdersService();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const ownedRestaurants = await Restaurant.find({ ownerId: userId }).select("_id");
  const staffRoles = await RestaurantStaff.find({ userId, status: "active" }).select("restaurantId");

  const restaurantIds = [...ownedRestaurants.map((r) => r._id.toString()), ...staffRoles.map((r) => r.restaurantId.toString())];

  if (restaurantIds.length === 0) return [];

  return await Order.find({
    restaurant: { $in: restaurantIds },
    createdAt: { $gte: sevenDaysAgo },
  })
    .sort({ createdAt: -1 })
    .populate("user", "firstName lastName")
    .populate("restaurant", "name");
};

// Updates the status of a specific order
export const updateOrderStatusService = async (orderId: string, status: string, userId: string) => {
  const order = await Order.findById(orderId).populate("user", "email");
  if (!order) throw new Error("Order not found");

  if (!(await verifyRestaurantAccess(userId, order.restaurant.toString()))) {
    throw new Error("Forbidden");
  }

  if (status === "preparing") {
    order.orderStatus = "preparing";
    order.acceptedAt = new Date();
    await order.save();
  } else if (status === "cancelled") {
    order.orderStatus = "cancelled";
    await order.save();

    if (order.paymentMethod === "online") {
      const userEmail = (order.user as any).email;
      if (userEmail) {
        await sendRefundEmail(userEmail, order.grandTotal, order.paymentMethod, order._id.toString());
      }
    }
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    order.orderStatus = status as any;
    await order.save();
  }

  return order;
};

// Cron endpoint to automatically transition stale orders
export const autoDeliverOrdersService = async () => {
  const timeoutMinutes = Number(process.env.ORDER_DELIVERY_TIME_MINUTES) || 30;
  const cutoffTime = new Date(Date.now() - timeoutMinutes * 60 * 1000);

  const result = await Order.updateMany(
    {
      orderStatus: "preparing",
      acceptedAt: { $lt: cutoffTime },
    },
    {
      $set: { orderStatus: "delivered" },
    },
  );

  return result.modifiedCount;
};
