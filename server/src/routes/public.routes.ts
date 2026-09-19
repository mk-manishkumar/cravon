import { Router } from "express";
import { getActiveRestaurants, getRestaurantById, exploreFoods, searchPublicRestaurants } from "../controllers/public.controller.js";

const router = Router();

router.get("/explore-foods", exploreFoods);
router.get("/search", searchPublicRestaurants);
router.get("/restaurants", getActiveRestaurants);
router.get("/restaurants/:id", getRestaurantById);

export default router;
