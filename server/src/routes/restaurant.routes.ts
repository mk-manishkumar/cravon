import { Router } from "express";
import { completeOnboarding, getMyRestaurant, deleteMyRestaurant, toggleStatus, getRestaurant } from "../controllers/restaurant.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all restaurant routes
router.use(verifyJWT);

router.get("/me", getMyRestaurant);
router.put("/onboard", completeOnboarding);
router.delete("/me", deleteMyRestaurant);
router.patch("/me/status", toggleStatus);
router.get("/:id", getRestaurant);

export default router;
