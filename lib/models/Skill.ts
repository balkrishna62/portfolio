import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  category: string;
  skills: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>({
  category: { type: String, required: true },
  skills: [{ type: String }],
  order: { type: Number, default: 0 },
}, { timestamps: true });

export const Skill = mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
