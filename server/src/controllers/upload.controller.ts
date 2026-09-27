import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { getAuthParameters, processAndUploadImage } from "../services/upload.service.js";
import { ApiError } from "../utils/errorHandler.js";

// Controller for handling image upload requests
export const getAuthParams = asyncHandler(async (req: Request, res: Response) => {
  const authParams = getAuthParameters();
  res.json(authParams);
});

// Controller for handling image upload requests
export const uploadImage = asyncHandler(async (req: Request, res: Response): Promise<any> => {
  if (!req.file) {
    throw new ApiError(400, "No file provided.");
  }

  const result = await processAndUploadImage(req.file.buffer);

  res.status(200).json({
    status: "success",
    url: result.url,
    fileId: result.fileId,
  });
});
