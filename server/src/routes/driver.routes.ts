import { Router } from "express";
import { loginDriver, registerDriver, getCurrentDriverProfile, updateStatus, updateLocation, getDriverOrders, updateOrderStatus, updateProfile, getDriverDeliveries, changeDriverPassword, deleteDriverAccount } from "../controllers/driver.controller.js";
import { verifyDriverJWT } from "../middlewares/driverAuth.middleware.js";

const router = Router();

router.post("/register", registerDriver);
router.post("/login", loginDriver);
router.get("/me", verifyDriverJWT, getCurrentDriverProfile);
router.put("/profile", verifyDriverJWT, updateProfile);
router.put("/status", verifyDriverJWT, updateStatus);
router.post("/location", verifyDriverJWT, updateLocation);
router.get("/orders", verifyDriverJWT, getDriverOrders);
router.get("/deliveries", verifyDriverJWT, getDriverDeliveries);
router.put("/orders/:id/status", verifyDriverJWT, updateOrderStatus);
router.put("/change-password", verifyDriverJWT, changeDriverPassword);
router.delete("/account", verifyDriverJWT, deleteDriverAccount);

export default router;
