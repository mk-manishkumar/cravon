import { Router } from "express";
import { getActiveRestaurants, getRestaurantById, exploreFoods } from "../controllers/public.controller.js";

const router = Router();

router.get("/explore-foods", exploreFoods);
router.get("/restaurants", getActiveRestaurants);
router.get("/restaurants/:id", getRestaurantById);

export default router;
