import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.warn("Razorpay configuration is missing. Payment features will not work.");
}

export const razorpay = new Razorpay({
  key_id: key_id || "missing_key",
  key_secret: key_secret || "missing_secret",
});
