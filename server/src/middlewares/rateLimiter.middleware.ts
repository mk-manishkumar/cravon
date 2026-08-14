import { rateLimit, Options } from "express-rate-limit";

const windowMs = Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10);
const windowMsg = `${Math.round(windowMs / 60000)} minutes`;

// Base Configuration Object
const baseConfig: Partial<Options> = {
  windowMs,
  standardHeaders: true,
  legacyHeaders: false,
};

// Global Rate Limiter
export const globalLimiter = rateLimit({
  ...baseConfig,
  max: Number.parseInt(process.env.RATE_LIMIT_GLOBAL || "100", 10),
  message: {
    status: "error",
    message: `Too many requests from this IP, please try again after ${windowMsg}`,
  },
});

// Rate Limiter for Authentication
export const authLimiter = rateLimit({
  ...baseConfig,
  max: Number.parseInt(process.env.RATE_LIMIT_AUTH || "5", 10),
  message: {
    status: "error",
    message: `Too many login/register attempts from this IP, please try again after ${windowMsg}`,
  },
});

// Rate limiter for payments
export const paymentLimiter = rateLimit({
  ...baseConfig,
  max: Number.parseInt(process.env.RATE_LIMIT_PAYMENT || "10", 10),
  message: {
    status: "error",
    message: `Too many payment requests from this IP, please try again after ${windowMsg}`,
  },
});
