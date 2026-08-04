import { Router, Request, Response } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import ImageKit from "imagekit";

const router = Router();

router.get("/auth", verifyJWT, (req: Request, res: Response) => {
  try {
    const publicKey = process.env.IMAGE_PUBLIC_KEY;
    const privateKey = process.env.IMAGE_PRIVATE_KEY;
    const urlEndpoint = process.env.IMAGE_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
      return res.status(500).json({ status: "error", message: "Image upload configuration is missing on the server." });
    }

    const imagekit = new ImageKit({ publicKey, privateKey, urlEndpoint });

    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.json(authenticationParameters);
  } catch (error) {
    console.error("ImageKit auth error:", error);
    res.status(500).json({ status: "error", message: "Failed to generate image upload signature." });
  }
});

export default router;
