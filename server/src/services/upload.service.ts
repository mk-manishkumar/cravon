import { imagekit } from "../config/imagekit.js";
import { optimizeImage } from "../utils/imageOptimizer.js";

// Returns the authentication parameters required for client-side uploads to ImageKit
export const getAuthParameters = () => {
  return imagekit.getAuthenticationParameters();
};

// Processes the uploaded image by optimizing it and then uploading it to ImageKit
export const processAndUploadImage = async (buffer: Buffer, folder: string = "/cravon-restaurants") => {
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
};
