import { rateLimit, Options } from "express-rate-limit";

const isDev = process.env.APP_ENV === "development" || process.env.NODE_ENV === "development";

const devWindowMs = 30 * 1000; // 30 seconds for local dev testing
const prodWindowMs = Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10); // 15 mins for prod

const windowMs = isDev ? devWindowMs : prodWindowMs;
const windowMsg = isDev ? "30 seconds" : "15 minutes";

// Base Configuration Object
const baseConfig: Partial<Options> = {
  windowMs,
  standardHeaders: true,
  legacyHeaders: false,
};

// Global Rate Limiter
export const globalLimiter = rateLimit({
  ...baseConfig,
  max: isDev ? 1000 : Number.parseInt(process.env.RATE_LIMIT_GLOBAL || "100", 10), 
  message: {
    status: "error",
    message: `Too many requests from this IP, please try again after ${windowMsg}`,
  },
});

// Strict Rate Limiter for Authentication
export const authLimiter = rateLimit({
  ...baseConfig,
  max: isDev ? 100 : Number.parseInt(process.env.RATE_LIMIT_AUTH || "5", 10),
  message: {
    status: "error",
    message: `Too many login/register attempts from this IP, please try again after ${windowMsg}`,
  },
});
