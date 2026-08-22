import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurantStaff extends Document {
  userId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  role: 'Owner' | 'Staff';
  permissions: string[];
  status: 'pending' | 'active';
  inviteToken?: string;
  inviteExpiresAt?: Date;
  invitedBy: mongoose.Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantStaffSchema = new Schema<IRestaurantStaff>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  restaurantId: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  role: { type: String, enum: ['Owner', 'Staff'], required: true },
  permissions: { type: [String], default: [] },
  status: { type: String, enum: ['pending', 'active'], default: 'pending' },
  inviteToken: { type: String },
  inviteExpiresAt: { type: Date },
  invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
}, { timestamps: true });

// Prevent duplicate active staff entries for the same user and restaurant
restaurantStaffSchema.index({ userId: 1, restaurantId: 1 }, { unique: true, partialFilterExpression: { status: 'active', userId: { $exists: true } } });

export default mongoose.model<IRestaurantStaff>('RestaurantStaff', restaurantStaffSchema);
