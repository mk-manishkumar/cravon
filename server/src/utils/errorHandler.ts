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
  // Only log unexpected 500 errors to the terminal to keep it clean.
  if (!(err instanceof ApiError) && !(err instanceof ZodError) && err.name !== "ValidationError" && err.code !== 11000) {
    console.error("Unexpected Server Error:", err);
  }

  if (err instanceof ZodError) {
    // Only show the first error to keep the UI clean
    const firstErrorMessage = (err as ZodError).issues[0]?.message || "Invalid input provided.";
    return res.status(400).json({ status: "error", message: firstErrorMessage });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ status: "error", message: err.message });
  }

  if (err.name === "ValidationError") {
    const firstErrorMessage = (Object.values(err.errors)[0] as any)?.message || "Validation failed.";
    return res.status(400).json({ status: "error", message: firstErrorMessage });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue).join(", ");
    return res.status(409).json({ status: "error", message: `This ${field} is already registered. Please use another.` });
  }

  res.status(500).json({ status: "error", message: "Internal server error" });
};
