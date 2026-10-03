import { Router } from "express";
import { loginDriver, registerDriver, updateStatus, updateLocation, getDriverOrders, updateOrderStatus, updateProfile } from "../controllers/driver.controller.js";
import { verifyDriverJWT } from "../middlewares/driverAuth.middleware.js";

const router = Router();

router.post("/register", registerDriver);
router.post("/login", loginDriver);
router.put("/profile", verifyDriverJWT, updateProfile);
router.put("/status", verifyDriverJWT, updateStatus);
router.post("/location", verifyDriverJWT, updateLocation);
router.get("/orders", verifyDriverJWT, getDriverOrders);
router.put("/orders/:id/status", verifyDriverJWT, updateOrderStatus);

export default router;
