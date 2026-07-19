import "dotenv/config";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";

const app: Application = express();

await connectDB();

// Disable the 'X-Powered-By' header for security reasons
app.disable("x-powered-by");

const PORT = process.env.PORT || 5000;

// ==========================================
// GLOBAL MIDDLEWARES
// ==========================================
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ==========================================
//  ROUTES
// ==========================================

app.use('/api/v1/auth', authRoutes);

// Basic Health Check Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "Cravon API is up and running!" });
});

// ==========================================
// ERROR HANDLING
// ==========================================
// 404 Route Not Found Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found on the server.`,
  });
});

import { errorHandler } from "./src/utils/errorHandler.js";

// Global Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
