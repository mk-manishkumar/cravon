import { Request, Response } from "express";
import { UploadService } from "../services/upload.service.js";

// Controller for handling image upload requests
export class UploadController {
  
  static getAuthParams(req: Request, res: Response) {
    try {
      const authParams = UploadService.getAuthParameters();
      res.json(authParams);
    } catch (error) {
      console.error("ImageKit auth error:", error);
      res.status(500).json({ status: "error", message: "Failed to generate image upload signature." });
    }
  }

  static async uploadImage(req: Request, res: Response): Promise<any> {
    try {
      if (!req.file) {
        return res.status(400).json({ status: "error", message: "No file provided." });
      }

      const result = await UploadService.processAndUploadImage(req.file.buffer);

      res.status(200).json({
        status: "success",
        url: result.url,
        fileId: result.fileId,
      });
    } catch (error) {
      console.error("Backend upload error:", error);
      res.status(500).json({ status: "error", message: "Failed to process and upload image." });
    }
  }
}
