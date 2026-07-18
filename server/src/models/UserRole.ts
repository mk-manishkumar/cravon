import mongoose, { Schema, Document } from 'mongoose';

export interface IUserRole extends Document {
  userId: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  assignedAt: Date;
}

const UserRoleSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  assignedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUserRole>('UserRole', UserRoleSchema);
