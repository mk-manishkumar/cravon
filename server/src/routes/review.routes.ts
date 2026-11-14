import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { customerLimiter } from "../middlewares/rateLimiter.middleware.js";
import {
  getRestaurantReviews,
  getUserRestaurantReview,
  createOrUpdateRestaurantReview,
  deleteRestaurantReview,
} from "../controllers/review.controller.js";

const router = Router();

// Public route to view restaurant reviews
router.get("/restaurant/:restaurantId", customerLimiter, getRestaurantReviews);

// Protected routes (requires customer login)
router.get("/restaurant/:restaurantId/me", customerLimiter, verifyJWT, getUserRestaurantReview);
router.post("/restaurant/:restaurantId", customerLimiter, verifyJWT, createOrUpdateRestaurantReview);
router.delete("/restaurant/:restaurantId/:reviewId", customerLimiter, verifyJWT, deleteRestaurantReview);

export default router;
