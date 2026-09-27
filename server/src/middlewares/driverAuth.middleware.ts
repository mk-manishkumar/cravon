import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Driver from "../models/driver.model.js";

export const verifyDriverJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized request: No token found" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: string };

    const driver = await Driver.findById(decodedToken.id).select("-password");
    if (!driver) {
      return res.status(401).json({ success: false, message: "Invalid Access Token" });
    }

    (req as any).user = {
      id: driver._id,
      email: driver.email,
    };

    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message || "Invalid access token" });
  }
};
