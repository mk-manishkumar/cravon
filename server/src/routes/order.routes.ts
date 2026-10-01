import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { customerLimiter, partnerLimiter } from "../middlewares/rateLimiter.middleware.js";
import { createOrder, verifyPayment, getMyOrders, getRestaurantOrders, getPartnerNotifications, updateOrderStatus, autoDeliverOrders } from "../controllers/order.controller.js";

const router = Router();

// Customer routes
router.post("/create", customerLimiter, verifyJWT, createOrder);
router.post("/verify", customerLimiter, verifyJWT, verifyPayment);
router.get("/my", customerLimiter, verifyJWT, getMyOrders);

// Partner routes
router.get("/restaurant/:id", partnerLimiter, verifyJWT, getRestaurantOrders);
router.get("/partner/notifications", partnerLimiter, verifyJWT, getPartnerNotifications);
router.put("/:id/status", partnerLimiter, verifyJWT, updateOrderStatus);

// Cron route (in a real app, protect this via a secret cron token)
router.post("/cron/auto-deliver", autoDeliverOrders);

export default router;
