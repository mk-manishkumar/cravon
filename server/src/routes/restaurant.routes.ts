import { Router } from "express";
import { completeOnboarding, getMyRestaurant, deleteMyRestaurant } from "../controllers/restaurant.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all restaurant routes
router.use(verifyJWT);

router.get("/me", getMyRestaurant);
router.put("/onboard", completeOnboarding);
router.delete("/me", deleteMyRestaurant);

export default router;
