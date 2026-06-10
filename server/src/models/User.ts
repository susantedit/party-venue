import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'super-admin' | 'admin' | 'editor';

export interface IUser extends Document {
  firebaseUid: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: { type: String, enum: ['super-admin', 'admin', 'editor'], default: 'editor' },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

UserSchema.index({ firebaseUid: 1 }, { unique: true });
UserSchema.index({ email: 1 });

export const UserModel =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);
