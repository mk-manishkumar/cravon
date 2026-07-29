import mongoose, { Schema, Document } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otpCode: string;
  createdAt: Date;
}

const OtpSchema: Schema = new Schema({
  email: { type: String, required: true },
  otpCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // 600s = 10 minutes TTL
});

export default mongoose.model<IOtp>('Otp', OtpSchema);
