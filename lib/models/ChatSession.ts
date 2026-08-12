import mongoose, { Schema, Document } from 'mongoose';

export interface IChatSession extends Document {
  visitorId: string;
  name: string;
  email: string;
  status: 'active' | 'closed';
  userTypingAt?: Date;
  adminTypingAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSessionSchema = new Schema<IChatSession>({
  visitorId: { type: String, required: true, unique: true },
  name: { type: String, default: "Visitor" },
  email: { type: String, default: "" },
  status: { type: String, enum: ['active', 'closed'], default: 'active' },
  userTypingAt: { type: Date },
  adminTypingAt: { type: Date },
}, { timestamps: true });

export const ChatSession = mongoose.models.ChatSession || mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
