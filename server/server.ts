import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import restaurantRoutes from "./src/routes/restaurant.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import paymentRoutes from "./src/routes/payment.routes.js";
import staffRoutes from "./src/routes/staff.routes.js";
import publicRoutes from "./src/routes/public.routes.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { globalLimiter } from "./src/middlewares/rateLimiter.middleware.js";

const app: Application = express();

await connectDB();

// Disable the 'X-Powered-By' header for security reasons
app.disable("x-powered-by");

const PORT = process.env.PORT || 5000;

// GLOBAL MIDDLEWARES
const allowedOrigins = [process.env.CLIENT_URL || "http://localhost:3000", "http://localhost:3000"];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//  ROUTES
app.use("/api", globalLimiter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/restaurants", restaurantRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/staff", staffRoutes);
app.use("/api/v1/public", publicRoutes);

// ERROR HANDLING
// 404 Route Not Found Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "error",
    message: `Resource not found.`,
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Only listen if not running in a serverless environment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless
export default app;
