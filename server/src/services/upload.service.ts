import { imagekit } from "../config/imagekit.js";
import { optimizeImage } from "../utils/imageOptimizer.js";

export class UploadService {
  // Returns the authentication parameters required for client-side uploads to ImageKit
  static getAuthParameters() {
    return imagekit.getAuthenticationParameters();
  }

  // Processes the uploaded image by optimizing it and then uploading it to ImageKit
  static async processAndUploadImage(buffer: Buffer, folder: string = "/cravon-restaurants") {
    // Optimize the image
    const optimizedBuffer = await optimizeImage(buffer, {
      width: 1200,
      quality: 80,
    });

    // Upload to ImageKit
    const response = await imagekit.upload({
      file: optimizedBuffer,
      fileName: `cravon-optimized-${Date.now()}.webp`,
      folder,
    });

    return {
      url: response.url,
      fileId: response.fileId,
    };
  }
}
