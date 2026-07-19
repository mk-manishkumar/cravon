import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class ApiError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server Error Details:", err);

  if (err instanceof ZodError) {
    // ZodError exposes 'issues' (not 'errors') which contains validation details
    const messages = (err as ZodError).issues.map((e: any) => `${e.path.join(".")}: ${e.message}`);
    return res.status(400).json({ status: "error", message: messages.join(", ") });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ status: "error", message: err.message });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({ status: "error", message: messages.join(", ") });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    return res.status(409).json({ status: "error", message: `Duplicate value for: ${field}` });
  }

  res.status(500).json({ status: "error", message: "Internal server error" });
};
