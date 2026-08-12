import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  seoTitle?: string;
  seoDescription?: string;
  readingTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  seoTitle: { type: String },
  seoDescription: { type: String },
  readingTime: { type: Number },
}, { timestamps: true });

export const BlogPost = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
