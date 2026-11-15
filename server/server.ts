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
import orderRoutes from "./src/routes/order.routes.js";
import driverRoutes from "./src/routes/driver.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
import { errorHandler } from "./src/utils/errorHandler.js";
import { startMatchmaker } from "./src/cron/driverMatchMaker.js";
import { globalLimiter, partnerLimiter, customerLimiter } from "./src/middlewares/rateLimiter.middleware.js";

const app: Application = express();

await connectDB();

// Disable the 'X-Powered-By' header for security reasons
app.disable("x-powered-by");

const PORT = process.env.PORT || 5000;

// Start the driver matchmaker cron job
startMatchmaker();

// GLOBAL MIDDLEWARES
const localOrigins = process.env.LOCAL_ORIGINS ? process.env.LOCAL_ORIGINS.split(",").map((o) => o.trim()) : ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"];

const explicitOrigins = [process.env.CLIENT_URL, process.env.DRIVER_URL, ...localOrigins].filter(Boolean) as string[];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow explicitly registered origins
    if (explicitOrigins.includes(origin)) return callback(null, true);

    // Dynamically allow all Vercel deployments (*.vercel.app) and localhost
    try {
      const parsedUrl = new URL(origin);
      const isVercelDomain = parsedUrl.hostname.endsWith(".vercel.app");
      const isLocalhost = parsedUrl.hostname === "localhost" || parsedUrl.hostname === "127.0.0.1";

      if (isVercelDomain || isLocalhost) return callback(null, true);
    } catch {
      // Ignore invalid URL formatting
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"],
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
app.use("/api/v1/restaurants", partnerLimiter, restaurantRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/staff", partnerLimiter, staffRoutes);
app.use("/api/v1/public", customerLimiter, publicRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/driver", driverRoutes);
app.use("/api/v1/reviews", customerLimiter, reviewRoutes);

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
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Export for Vercel Serverless
export default app;
