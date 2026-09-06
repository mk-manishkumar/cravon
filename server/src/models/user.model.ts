import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress {
  _id?: string;
  type: string;
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  instructions?: string;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  status: string;
  isVerified: boolean;
  addresses: IAddress[];
  subscription: {
    tier: string;
    status: 'active' | 'expired' | 'cancelled';
    expiresAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema({
  type: { type: String, required: true, default: "Other" },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  zipCode: { type: String },
  instructions: { type: String }
});

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  status: { type: String, enum: ['active', 'suspended', 'deleted'], default: 'active' },
  isVerified: { type: Boolean, default: false },
  addresses: [AddressSchema],
  subscription: {
    tier: { type: String, default: 'free' },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    expiresAt: { type: Date }
  }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
