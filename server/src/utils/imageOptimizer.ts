import sharp from "sharp";

interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
}

export const optimizeImage = async (
  buffer: Buffer,
  options: OptimizeOptions = {}
): Promise<Buffer> => {
  const { width = 1200, quality = 80 } = options;

  return await sharp(buffer)
    .resize({
      width,
      withoutEnlargement: true, // Don't upscale if the image is smaller than 1200px
      fit: "inside",
    })
    .webp({ quality }) 
    .toBuffer();
};
