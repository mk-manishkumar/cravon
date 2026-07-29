import { Router } from "express";
import { register, login, registerRestaurant, verifyRestaurantOtp, loginRestaurant, loginAdmin, getMe, logout } from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Session
router.get("/me", verifyJWT, getMe);
router.post("/logout", logout);

// Customer Auth
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// Restaurant Partner Auth
router.post("/restaurant/register", authLimiter, registerRestaurant);
router.post("/restaurant/verify-otp", authLimiter, verifyRestaurantOtp);
router.post("/restaurant/login", authLimiter, loginRestaurant);

// Admin Auth
router.post("/admin/login", authLimiter, loginAdmin);

export default router;
