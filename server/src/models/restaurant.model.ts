import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  address?: string;
  location?: {
    type: 'Point';
    coordinates: number[]; // [longitude, latitude]
  };
  cuisines: string[];
  costForTwo?: number;
  staffCount?: number;
  operatingHours?: {
    open: string;
    close: string;
  };
  rating: number;
  deliveryTime?: number;
  image?: string;
  status: 'active' | 'inactive' | 'pending';
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] } // [longitude, latitude]
  },
  cuisines: { type: [String], default: [] },
  costForTwo: { type: Number },
  staffCount: { type: Number },
  operatingHours: {
    open: { type: String },
    close: { type: String },
  },
  rating: { type: Number, default: 0 },
  deliveryTime: { type: Number },
  image: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
  isOnboarded: { type: Boolean, default: false },
}, { timestamps: true });

// Index for geospatial queries
restaurantSchema.index({ location: '2dsphere' });

export default mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
