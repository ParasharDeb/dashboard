import { Request, Response, NextFunction } from 'express';
import NutritionLog from '../models/NutritionLog';
import NutritionGoal from '../models/NutritionGoal';

export const getNutritionLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date } = req.query;
    const targetDate = (typeof date === 'string' && date) || new Date().toISOString().split('T')[0];

    const logs = await NutritionLog.find({ date: targetDate }).sort({ createdAt: -1 });

    const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
    const totalProtein = logs.reduce((sum, log) => sum + log.protein, 0);
    const totalCarbs = logs.reduce((sum, log) => sum + log.carbs, 0);
    const totalFat = logs.reduce((sum, log) => sum + log.fat, 0);

    let goal = await NutritionGoal.findOne();
    if (!goal) {
      goal = await NutritionGoal.create({
        dailyCalories: 2200,
        dailyProtein: 150,
        dailyCarbs: 250,
        dailyFat: 70,
      });
    }

    res.json({
      success: true,
      date: targetDate,
      totals: {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
      },
      goals: {
        dailyCalories: goal.dailyCalories,
        dailyProtein: goal.dailyProtein,
        dailyCarbs: goal.dailyCarbs,
        dailyFat: goal.dailyFat,
      },
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const createNutritionLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, mealType, foodName, calories, protein, carbs, fat } = req.body;

    if (!foodName || typeof foodName !== 'string' || foodName.trim() === '') {
      res.status(400).json({ success: false, error: 'Food name is required' });
      return;
    }

    const logDate = date || new Date().toISOString().split('T')[0];

    const log = await NutritionLog.create({
      date: logDate,
      mealType: ['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType) ? mealType : 'snack',
      foodName: foodName.trim(),
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

export const updateNutritionLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, mealType, foodName, calories, protein, carbs, fat } = req.body;

    const log = await NutritionLog.findById(id);
    if (!log) {
      res.status(404).json({ success: false, error: 'Nutrition log not found' });
      return;
    }

    if (date !== undefined) log.date = String(date);
    if (mealType && ['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType)) {
      log.mealType = mealType;
    }
    if (foodName !== undefined) log.foodName = String(foodName).trim();
    if (calories !== undefined) log.calories = Number(calories) || 0;
    if (protein !== undefined) log.protein = Number(protein) || 0;
    if (carbs !== undefined) log.carbs = Number(carbs) || 0;
    if (fat !== undefined) log.fat = Number(fat) || 0;

    await log.save();
    res.json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

export const deleteNutritionLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const log = await NutritionLog.findByIdAndDelete(id);

    if (!log) {
      res.status(404).json({ success: false, error: 'Nutrition log not found' });
      return;
    }

    res.json({ success: true, message: 'Nutrition log deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getNutritionGoals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let goal = await NutritionGoal.findOne();
    if (!goal) {
      goal = await NutritionGoal.create({
        dailyCalories: 2200,
        dailyProtein: 150,
        dailyCarbs: 250,
        dailyFat: 70,
      });
    }
    res.json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};

export const updateNutritionGoals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { dailyCalories, dailyProtein, dailyCarbs, dailyFat } = req.body;

    let goal = await NutritionGoal.findOne();
    if (!goal) {
      goal = new NutritionGoal();
    }

    if (dailyCalories !== undefined) goal.dailyCalories = Number(dailyCalories);
    if (dailyProtein !== undefined) goal.dailyProtein = Number(dailyProtein);
    if (dailyCarbs !== undefined) goal.dailyCarbs = Number(dailyCarbs);
    if (dailyFat !== undefined) goal.dailyFat = Number(dailyFat);

    await goal.save();
    res.json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
};
