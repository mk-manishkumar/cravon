import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  address?: string;
  rating: number;
  deliveryTime?: number;
  image?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
}

const restaurantSchema = new Schema<IRestaurant>({
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String },
  rating: { type: Number, default: 0 },
  deliveryTime: { type: Number },
  image: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
