import mongoose, { Schema, Document } from 'mongoose';

export interface IWeightLog extends Document {
  date: string; // YYYY-MM-DD
  weight: number;
  unit: 'kg' | 'lbs';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WeightLogSchema: Schema = new Schema(
  {
    date: { type: String, required: true, unique: true },
    weight: { type: Number, required: true, min: 1 },
    unit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
    notes: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<IWeightLog>('WeightLog', WeightLogSchema);
