import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  heroImage: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
  heroImage: { type: String, default: '' },
}, { timestamps: true });

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
