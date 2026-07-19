import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  roleName: string;
  description: string;
  createdAt: Date;
}

const RoleSchema: Schema = new Schema({
  roleName: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IRole>('Role', RoleSchema);
