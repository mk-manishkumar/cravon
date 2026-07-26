import { rateLimit } from "express-rate-limit";

// Global Rate Limiter
export const globalLimiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max: Number.parseInt(process.env.RATE_LIMIT_GLOBAL || "100", 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Strict Rate Limiter
export const authLimiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  max: Number.parseInt(process.env.RATE_LIMIT_AUTH || "5", 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many login/register attempts from this IP, please try again after 15 minutes",
  },
});
