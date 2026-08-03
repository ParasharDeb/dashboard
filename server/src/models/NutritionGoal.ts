import mongoose, { Schema, Document } from 'mongoose';

export interface INutritionGoal extends Document {
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
  createdAt: Date;
  updatedAt: Date;
}

const NutritionGoalSchema: Schema = new Schema(
  {
    dailyCalories: { type: Number, default: 2200, min: 500 },
    dailyProtein: { type: Number, default: 150, min: 10 },
    dailyCarbs: { type: Number, default: 250, min: 10 },
    dailyFat: { type: Number, default: 70, min: 5 },
  },
  { timestamps: true }
);

export default mongoose.model<INutritionGoal>('NutritionGoal', NutritionGoalSchema);
