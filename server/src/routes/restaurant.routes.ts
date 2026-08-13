import { Router } from "express";
import { createNewRestaurant, updateExistingRestaurant, getMyRestaurants, deleteMyRestaurant, toggleStatus, getRestaurant } from "../controllers/restaurant.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all restaurant routes
router.use(verifyJWT);

router.get("/me", getMyRestaurants);
router.post("/", createNewRestaurant);
router.put("/:id", updateExistingRestaurant);
router.delete("/:id", deleteMyRestaurant);
router.patch("/:id/status", toggleStatus);
router.get("/:id", getRestaurant);

export default router;
