import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment } from "../controllers/order.controller.js";

const router = Router();

router.post("/create", verifyJWT, createOrder);
router.post("/verify", verifyJWT, verifyPayment);

export default router;
