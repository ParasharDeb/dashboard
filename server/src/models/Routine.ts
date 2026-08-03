import mongoose, { Schema, Document } from 'mongoose';

export interface IRoutineHistory {
  date: string; // YYYY-MM-DD
  completed: boolean;
  value: number;
}

export interface IRoutine extends Document {
  title: string;
  category: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  targetValue: number;
  unit: string;
  history: IRoutineHistory[];
  createdAt: Date;
  updatedAt: Date;
}

const RoutineSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'Health', trim: true },
    timeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night'],
      default: 'morning',
    },
    targetValue: { type: Number, default: 1, min: 1 },
    unit: { type: String, default: 'times', trim: true },
    history: [
      {
        date: { type: String, required: true },
        completed: { type: Boolean, default: false },
        value: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IRoutine>('Routine', RoutineSchema);
