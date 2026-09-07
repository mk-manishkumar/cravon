import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  isVeg?: boolean;
  image?: string;
}

export interface IRestaurant extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  franchiseName?: string;
  description?: string;
  address?: string;
  location?: {
    type: 'Point';
    coordinates: number[]; 
  };
  operatingDays: string[];
  operatingHours?: {
    open: string;
    close: string;
  };
  mealTimings?: {
    breakfast?: { open: string; close: string };
    lunch?: { open: string; close: string };
    dinner?: { open: string; close: string };
  };
  rating: number;
  deliveryTime?: number;
  image?: string;
  menu?: IMenuItem[];
  status: 'active' | 'inactive' | 'pending';
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const menuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  isVeg: { type: Boolean },
  image: { type: String }
});

const restaurantSchema = new Schema<IRestaurant>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  franchiseName: { type: String, trim: true },
  description: { type: String },
  address: { type: String },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] } 
  },
  operatingDays: { type: [String], default: [] },
  operatingHours: {
    open: { type: String },
    close: { type: String },
  },
  mealTimings: {
    breakfast: { open: { type: String }, close: { type: String } },
    lunch: { open: { type: String }, close: { type: String } },
    dinner: { open: { type: String }, close: { type: String } },
  },
  rating: { type: Number, default: 0 },
  deliveryTime: { type: Number },
  image: { type: String },
  menu: { type: [menuItemSchema], default: [] },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
  isOnboarded: { type: Boolean, default: false },
}, { timestamps: true });

// Index for geospatial queries
restaurantSchema.index({ location: '2dsphere' });

export default mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
