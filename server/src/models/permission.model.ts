import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
  permissionName: string;
  description: string;
  module: string;
  createdAt: Date;
}

const PermissionSchema: Schema = new Schema({
  permissionName: { type: String, required: true, unique: true },
  description: { type: String },
  module: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IPermission>('Permission', PermissionSchema);
