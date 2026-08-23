import { Router } from "express";
import { getActiveRestaurants, getRestaurantById } from "../controllers/public.controller.js";

const router = Router();

router.get("/restaurants", getActiveRestaurants);
router.get("/restaurants/:id", getRestaurantById);

export default router;
