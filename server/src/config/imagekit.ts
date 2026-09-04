import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const publicKey = process.env.IMAGE_PUBLIC_KEY;
const privateKey = process.env.IMAGE_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGE_URL_ENDPOINT;

if (!publicKey || !privateKey || !urlEndpoint) {
  console.warn("ImageKit configuration is missing in environment variables. Image uploads will fail.");
}

// Create a singleton instance
export const imagekit = new ImageKit({
  publicKey: publicKey || "missing_public_key",
  privateKey: privateKey || "missing_private_key",
  urlEndpoint: urlEndpoint || "missing_url_endpoint",
});
