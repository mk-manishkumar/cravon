import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { inviteStaff, acceptInvite, getStaff, updateStaff, removeStaff } from "../controllers/staff.controller.js";

const router = express.Router();

router.post("/accept-invite", acceptInvite);

router.use(verifyJWT);

router.post("/invite", inviteStaff);
router.get("/:restaurantId", getStaff);
router.put("/:id", updateStaff);
router.delete("/:id", removeStaff);

export default router;
