import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errorHandler.js";
import User from "../models/user.model.js";
import UserRole from "../models/userRole.model.js";
import RestaurantStaff from "../models/restaurantStaff.model.js";

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
      addresses: user.addresses || [],
    };

    next();
  } catch (error: any) {
    next(new ApiError(401, error?.message || "Invalid access token"));
  }
};

// Middleware to check if user has specific permissions for a specific restaurant
export const verifyRestaurantPermission = (requiredPermissions: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;
      if (!user) throw new ApiError(401, "Unauthorized");

      // The restaurantId could be in params, query, or body
      const restaurantId = req.params.restaurantId || req.body.restaurantId || req.query.restaurantId;

      if (!restaurantId) throw new ApiError(400, "Restaurant ID is required to verify permissions");

      const staffRecord = await RestaurantStaff.findOne({
        userId: user.id,
        restaurantId,
        status: "active",
      });

      if (!staffRecord) throw new ApiError(403, "You do not have access to this restaurant");

      // If they are the Owner, they have all permissions implicitly
      if (staffRecord.role === "Owner") {
        (req as any).staffRecord = staffRecord;
        return next();
      }

      // If no specific permissions are required, just having an active staff record is enough
      if (requiredPermissions.length === 0) {
        (req as any).staffRecord = staffRecord;
        return next();
      }

      const hasAllRequired = requiredPermissions.every((p) => staffRecord.permissions.includes(p));
      if (!hasAllRequired) {
        const missing = requiredPermissions.filter((p) => !staffRecord.permissions.includes(p));
        throw new ApiError(403, `You do not have the required permissions. Missing: ${missing.join(", ")}`);
      }

      (req as any).staffRecord = staffRecord;
      next();
    } catch (error: any) {
      next(new ApiError(error.statusCode || 500, error?.message || "Permission verification failed"));
    }
  };
};
