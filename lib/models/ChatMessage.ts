import mongoose, { Schema, Document } from 'mongoose';

export interface IChatMessage extends Document {
  sessionId: string;
  sender: 'user' | 'admin';
  text: string;
  createdAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>({
  sessionId: { type: String, required: true },
  sender: { type: String, enum: ['user', 'admin'], required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export const ChatMessage = mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
