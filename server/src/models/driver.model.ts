import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone: string;
  vehicleDetails: string;
  isAvailable: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DriverSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  vehicleDetails: { type: String, required: true },
  isAvailable: { type: Boolean, default: false },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  }
}, { timestamps: true });

export default mongoose.model<IDriver>('Driver', DriverSchema);
