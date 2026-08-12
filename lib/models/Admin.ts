import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
}, { timestamps: true });

export const Admin = mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
