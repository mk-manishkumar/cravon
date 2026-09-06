import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment, getMyOrders } from "../controllers/order.controller.js";

const router = Router();

router.post("/create", verifyJWT, createOrder);
router.post("/verify", verifyJWT, verifyPayment);
router.get("/my", verifyJWT, getMyOrders);

export default router;
