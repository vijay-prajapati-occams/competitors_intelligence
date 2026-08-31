import { Schema, model, Types, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  organizationId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['owner', 'admin', 'analyst', 'viewer'],
      default: 'viewer',
      required: true,
    },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function comparePassword(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = model<IUser>('User', userSchema);
