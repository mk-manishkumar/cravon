import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { getAuthParams, uploadImage } from "../controllers/upload.controller.js";

const router = Router();

// Configure multer to store files in memory (RAM) instead of disk
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit before compression
    files: 1 
  } 
});

router.get("/auth", verifyJWT, getAuthParams);
router.post("/", verifyJWT, upload.single("file"), uploadImage);

export default router;
