import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment, getMyOrders, getRestaurantOrders, getPartnerNotifications, updateOrderStatus, autoDeliverOrders } from "../controllers/order.controller.js";

const router = Router();

// Customer routes
router.post("/create", verifyJWT, createOrder);
router.post("/verify", verifyJWT, verifyPayment);
router.get("/my", verifyJWT, getMyOrders);

// Partner routes
router.get("/restaurant/:id", verifyJWT, getRestaurantOrders);
router.get("/partner/notifications", verifyJWT, getPartnerNotifications);
router.put("/:id/status", verifyJWT, updateOrderStatus);

// Cron route (in a real app, protect this via a secret cron token)
router.post("/cron/auto-deliver", autoDeliverOrders);

export default router;
