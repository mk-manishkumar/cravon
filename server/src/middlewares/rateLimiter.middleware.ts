import { rateLimit } from 'express-rate-limit';

// Global Rate Limiter: Applied to all general routes to prevent basic DDoS attacks
export const globalLimiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // Time window in milliseconds (default: 15 minutes)
  max: Number.parseInt(process.env.RATE_LIMIT_GLOBAL || "100", 10), // Limit each IP to X requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
});

// Strict Rate Limiter: Applied to sensitive routes (login, register, forgot-password) to prevent brute-force
export const authLimiter = rateLimit({
  windowMs: Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), // Time window in milliseconds (default: 15 minutes)
  max: Number.parseInt(process.env.RATE_LIMIT_AUTH || "5", 10), // Limit each IP to X requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many login/register attempts from this IP, please try again after 15 minutes",
  },
});
