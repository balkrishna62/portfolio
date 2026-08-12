import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  type: string;
  description: string;
  tags: string[];
  url?: string;
  image?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  url: { type: String },
  image: { type: String },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
