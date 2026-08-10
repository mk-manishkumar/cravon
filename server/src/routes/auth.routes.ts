import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authLimiter } from "../middlewares/rateLimiter.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Session & Settings
router.get("/me", verifyJWT, authController.getMe);
router.post("/logout", authController.logout);
router.put("/profile", verifyJWT, authController.updateProfile);
router.put("/change-password", verifyJWT, authController.changePassword);
router.post("/request-email-change", verifyJWT, authController.requestEmailChange);
router.post("/verify-email-change", verifyJWT, authController.verifyEmailChange);
router.delete("/account", verifyJWT, authController.deleteAccount);

// Customer Auth
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);

// Restaurant Partner Auth
router.post("/restaurant/register", authLimiter, authController.registerRestaurant);
router.post("/restaurant/verify-otp", authLimiter, authController.verifyRestaurantOtp);
router.post("/restaurant/resend-otp", authLimiter, authController.resendRestaurantOtp);
router.post("/restaurant/login", authLimiter, authController.loginRestaurant);

// Admin Auth
router.post("/admin/login", authLimiter, authController.loginAdmin);

export default router;
