import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errorHandler.js";
import User from "../models/user.model.js";
import UserRole from "../models/userRole.model.js";

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) throw new ApiError(401, "Unauthorized request: No access token found in cookies");

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as { id: string };

    const user = await User.findById(decodedToken.id).select("-password");
    if (!user) throw new ApiError(401, "Invalid Access Token");

    // Attach user and roles to request object
    const userRoles = await UserRole.find({ userId: user._id }).populate<{ roleId: any }>("roleId");
    const roles = userRoles.map((ur) => ur.roleId.roleName);

    (req as any).user = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      roles: roles,
      subscription: user.subscription,
    };

    next();
  } catch (error: any) {
    next(new ApiError(401, error?.message || "Invalid access token"));
  }
};
