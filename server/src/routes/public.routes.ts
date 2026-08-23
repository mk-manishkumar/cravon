import { Router } from "express";
import { getActiveRestaurants } from "../controllers/public.controller.js";

const router = Router();

// Public route to fetch active restaurants for the customer landing page
router.get("/restaurants", getActiveRestaurants);

export default router;
