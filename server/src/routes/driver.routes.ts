import { Router } from "express";
import { loginDriver, updateStatus, updateLocation, getDriverOrders, updateOrderStatus } from "../controllers/driver.controller.js";
import { verifyDriverJWT } from "../middlewares/driverAuth.middleware.js";

const router = Router();

router.post("/login", loginDriver);
router.put("/status", verifyDriverJWT, updateStatus);
router.post("/location", verifyDriverJWT, updateLocation);
router.get("/orders", verifyDriverJWT, getDriverOrders);
router.put("/orders/:id/status", verifyDriverJWT, updateOrderStatus);

export default router;
