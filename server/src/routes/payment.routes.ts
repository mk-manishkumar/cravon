import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { paymentLimiter } from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Protect and rate-limit all payment routes
router.use(verifyJWT);
router.use(paymentLimiter);

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

export default router;
