import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { inviteStaff, acceptInvite, getInviteDetails, acceptInviteNewUser, getStaff, getAllStaff, updateStaff, removeStaff } from "../controllers/staff.controller.js";

const router = express.Router();

router.post("/accept-invite", acceptInvite);
router.get("/invite/:token", getInviteDetails);
router.post("/accept-invite-new", acceptInviteNewUser);

router.use(verifyJWT);

router.post("/invite", inviteStaff);
router.get("/", getAllStaff);
router.get("/:restaurantId", getStaff);
router.put("/:id", updateStaff);
router.delete("/:id", removeStaff);

export default router;
