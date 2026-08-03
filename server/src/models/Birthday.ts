import mongoose, { Schema, Document } from 'mongoose';

export interface IBirthday extends Document {
  name: string;
  dateOfBirth: Date;
  relationship: string;
  notes?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BirthdaySchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    relationship: { type: String, default: 'Friend', trim: true },
    notes: { type: String, default: '', trim: true },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IBirthday>('Birthday', BirthdaySchema);
