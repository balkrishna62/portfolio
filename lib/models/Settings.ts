import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  contactTitle: string;
  contactSubtitle: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>({
  heroImage: { type: String, default: '' },
  heroTitle: { type: String, default: 'Bal Krishna\\nPokharel.' },
  heroSubtitle: { type: String, default: 'Full-Stack Developer & Designer crafting digital perfection in Kathmandu, Nepal.' },
  aboutTitle: { type: String, default: 'One brain. Two disciplines.' },
  aboutText: { type: String, default: 'I am a developer & designer based in Kathmandu, Nepal. I work at the intersection of technology and visual design.\\n\\nI care about the details: button spacing, animation rhythm, API structure, and the feeling a brand leaves behind.' },
  contactTitle: { type: String, default: 'Let\'s Build.' },
  contactSubtitle: { type: String, default: 'Ready to create something extraordinary together?' },
}, { timestamps: true });

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
