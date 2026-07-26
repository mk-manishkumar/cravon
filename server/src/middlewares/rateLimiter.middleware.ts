import { rateLimit, Options } from "express-rate-limit";

// Base Configuration Object
const baseConfig: Partial<Options> = {
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  standardHeaders: true,
  legacyHeaders: false,
};

// Global Rate Limiter
export const globalLimiter = rateLimit({
  ...baseConfig,
  max: Number.parseInt(process.env.RATE_LIMIT_GLOBAL || "100", 10),
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Strict Rate Limiter for Authentication
export const authLimiter = rateLimit({
  ...baseConfig,
  max: Number.parseInt(process.env.RATE_LIMIT_AUTH || "5", 10),
  message: {
    status: "error",
    message: "Too many login/register attempts from this IP, please try again after 15 minutes",
  },
});
