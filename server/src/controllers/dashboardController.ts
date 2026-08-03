import { Request, Response, NextFunction } from 'express';
import Todo from '../models/Todo';
import Routine from '../models/Routine';
import NutritionLog from '../models/NutritionLog';
import NutritionGoal from '../models/NutritionGoal';
import WeightLog from '../models/WeightLog';
import Birthday from '../models/Birthday';

export const getDashboardSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Todo Stats
    const totalTodos = await Todo.countDocuments();
    const pendingTodos = await Todo.countDocuments({ status: 'pending' });
    const completedTodos = await Todo.countDocuments({ status: 'completed' });
    const highPriorityTodos = await Todo.countDocuments({ priority: 'high', status: { $ne: 'completed' } });

    // 2. Routines Stats Today
    const routines = await Routine.find();
    const totalRoutines = routines.length;
    let completedRoutinesToday = 0;
    routines.forEach((r) => {
      const entry = r.history.find((h) => h.date === todayStr);
      if (entry && entry.completed) {
        completedRoutinesToday++;
      }
    });
    const routineCompletionRate =
      totalRoutines > 0 ? Math.round((completedRoutinesToday / totalRoutines) * 100) : 0;

    // 3. Nutrition Stats Today
    const nutritionLogs = await NutritionLog.find({ date: todayStr });
    const totalCaloriesToday = nutritionLogs.reduce((acc, log) => acc + log.calories, 0);
    const totalProteinToday = nutritionLogs.reduce((acc, log) => acc + log.protein, 0);

    let goal = await NutritionGoal.findOne();
    if (!goal) {
      goal = await NutritionGoal.create({
        dailyCalories: 2200,
        dailyProtein: 150,
      });
    }

    // 4. Weight Stats
    const weightLogs = await WeightLog.find().sort({ date: -1 }).limit(14);
    const latestWeight = weightLogs.length > 0 ? weightLogs[0].weight : null;
    const previousWeight = weightLogs.length > 1 ? weightLogs[weightLogs.length - 1].weight : latestWeight;
    const weightChange =
      latestWeight !== null && previousWeight !== null
        ? Math.round((latestWeight - previousWeight) * 10) / 10
        : 0;

    // 5. Birthdays Stats (Upcoming in next 30 days)
    const birthdays = await Birthday.find();
    const today = new Date();
    const formattedBirthdays = birthdays
      .map((b) => {
        const birthDate = new Date(b.dateOfBirth);
        let nextBday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBday.getTime() < new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()) {
          nextBday = new Date(today.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate());
        }
        const diffTime = nextBday.getTime() - new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
        const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const turningAge = nextBday.getFullYear() - birthDate.getFullYear();
        return {
          _id: b._id,
          name: b.name,
          relationship: b.relationship,
          daysRemaining,
          turningAge,
          isToday: daysRemaining === 0,
        };
      })
      .sort((a, b) => a.daysRemaining - b.daysRemaining)
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        todos: {
          total: totalTodos,
          pending: pendingTodos,
          completed: completedTodos,
          highPriority: highPriorityTodos,
        },
        routines: {
          total: totalRoutines,
          completedToday: completedRoutinesToday,
          completionRate: routineCompletionRate,
        },
        nutrition: {
          caloriesToday: totalCaloriesToday,
          calorieGoal: goal.dailyCalories,
          proteinToday: totalProteinToday,
          proteinGoal: goal.dailyProtein,
        },
        weight: {
          latest: latestWeight,
          change: weightChange,
          unit: weightLogs.length > 0 ? weightLogs[0].unit : 'kg',
        },
        upcomingBirthdays: formattedBirthdays,
      },
    });
  } catch (error) {
    next(error);
  }
};
