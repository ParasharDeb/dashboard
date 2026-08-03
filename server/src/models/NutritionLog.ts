import mongoose, { Schema, Document } from 'mongoose';

export interface INutritionLog extends Document {
  date: string; // YYYY-MM-DD
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  createdAt: Date;
  updatedAt: Date;
}

const NutritionLogSchema: Schema = new Schema(
  {
    date: { type: String, required: true, index: true },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    foodName: { type: String, required: true, trim: true },
    calories: { type: Number, required: true, min: 0 },
    protein: { type: Number, required: true, min: 0 },
    carbs: { type: Number, default: 0, min: 0 },
    fat: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<INutritionLog>('NutritionLog', NutritionLogSchema);
