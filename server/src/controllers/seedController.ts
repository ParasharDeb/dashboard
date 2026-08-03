import { Request, Response, NextFunction } from 'express';
import Todo from '../models/Todo';
import Routine from '../models/Routine';
import NutritionLog from '../models/NutritionLog';
import NutritionGoal from '../models/NutritionGoal';
import WeightLog from '../models/WeightLog';
import Birthday from '../models/Birthday';

export const seedDatabase = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // Clear existing data
    await Todo.deleteMany({});
    await Routine.deleteMany({});
    await NutritionLog.deleteMany({});
    await NutritionGoal.deleteMany({});
    await WeightLog.deleteMany({});
    await Birthday.deleteMany({});

    // Seed Todos
    const todos = await Todo.insertMany([
      {
        title: 'Review production deployment architecture',
        description: 'Ensure SSL certificates and environment variables are configured.',
        priority: 'high',
        status: 'in_progress',
        category: 'Work',
        dueDate: new Date(Date.now() + 86400000 * 2),
      },
      {
        title: 'Complete daily workout routine',
        description: 'Upper body hypertrophy session - 45 mins.',
        priority: 'medium',
        status: 'completed',
        category: 'Fitness',
        dueDate: new Date(),
      },
      {
        title: 'Prepare weekly grocery & meal prep list',
        description: 'Buy high protein items: chicken breast, eggs, Greek yogurt.',
        priority: 'medium',
        status: 'pending',
        category: 'Personal',
        dueDate: new Date(Date.now() + 86400000),
      },
      {
        title: 'Read 2 chapters of Designing Data-Intensive Applications',
        description: 'Focus on consensus & distributed lock managers.',
        priority: 'low',
        status: 'pending',
        category: 'Learning',
      },
      {
        title: 'Pay monthly cloud infrastructure bill',
        description: 'Check AWS / GCP usage breakdown before paying.',
        priority: 'high',
        status: 'pending',
        category: 'Finance',
        dueDate: new Date(Date.now() + 86400000 * 5),
      },
    ]);

    // Seed Routines
    const routines = await Routine.insertMany([
      {
        title: 'Morning Water Intake',
        category: 'Health',
        timeOfDay: 'morning',
        targetValue: 2,
        unit: 'glasses',
        history: [{ date: todayStr, completed: true, value: 2 }],
      },
      {
        title: '30-min Cardio / Morning Walk',
        category: 'Fitness',
        timeOfDay: 'morning',
        targetValue: 30,
        unit: 'mins',
        history: [{ date: todayStr, completed: true, value: 30 }],
      },
      {
        title: 'Focus Deep Work Session',
        category: 'Productivity',
        timeOfDay: 'afternoon',
        targetValue: 120,
        unit: 'mins',
        history: [{ date: todayStr, completed: false, value: 60 }],
      },
      {
        title: 'Evening Gratitude Journaling',
        category: 'Mindfulness',
        timeOfDay: 'evening',
        targetValue: 1,
        unit: 'entry',
        history: [{ date: todayStr, completed: false, value: 0 }],
      },
      {
        title: 'Night Sleep Hygiene (No screens after 10 PM)',
        category: 'Wellness',
        timeOfDay: 'night',
        targetValue: 8,
        unit: 'hours',
        history: [{ date: todayStr, completed: false, value: 0 }],
      },
    ]);

    // Seed Nutrition Goals
    const nutritionGoal = await NutritionGoal.create({
      dailyCalories: 2300,
      dailyProtein: 165,
      dailyCarbs: 240,
      dailyFat: 70,
    });

    // Seed Nutrition Logs Today
    const nutritionLogs = await NutritionLog.insertMany([
      {
        date: todayStr,
        mealType: 'breakfast',
        foodName: 'Oatmeal with Whey Protein & Banana',
        calories: 480,
        protein: 38,
        carbs: 65,
        fat: 8,
      },
      {
        date: todayStr,
        mealType: 'lunch',
        foodName: 'Grilled Chicken Breast with Brown Rice & Broccoli',
        calories: 620,
        protein: 52,
        carbs: 58,
        fat: 12,
      },
      {
        date: todayStr,
        mealType: 'snack',
        foodName: 'Greek Yogurt with Almonds & Honey',
        calories: 280,
        protein: 22,
        carbs: 24,
        fat: 10,
      },
      {
        date: todayStr,
        mealType: 'dinner',
        foodName: 'Salmon Fillet with Quinoa & Roasted Vegetables',
        calories: 550,
        protein: 42,
        carbs: 45,
        fat: 20,
      },
    ]);

    // Seed Weight History over last 14 days
    const weightLogsData = [];
    let currentWt = 78.5;
    for (let i = 14; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      // subtle realistic fluctuation
      currentWt = Math.round((currentWt + (Math.random() * 0.4 - 0.22)) * 10) / 10;
      weightLogsData.push({
        date: dateStr,
        weight: currentWt,
        unit: 'kg',
        notes: i === 0 ? 'Logged after morning workout' : '',
      });
    }
    const weightLogs = await WeightLog.insertMany(weightLogsData);

    // Seed Birthdays
    const birthdays = await Birthday.insertMany([
      {
        name: 'Sarah Connor',
        dateOfBirth: new Date('1994-08-08'),
        relationship: 'Close Friend',
        notes: 'Loves sci-fi novels and coffee.',
      },
      {
        name: 'Alex Rivera',
        dateOfBirth: new Date('1992-08-15'),
        relationship: 'Colleague',
        notes: 'Organize office surprise lunch.',
      },
      {
        name: 'David Miller',
        dateOfBirth: new Date('1988-09-02'),
        relationship: 'Brother',
        notes: 'Gift idea: Mechanical Keyboard.',
      },
      {
        name: 'Emma Watson',
        dateOfBirth: new Date('1996-10-24'),
        relationship: 'Friend',
        notes: 'Send birthday card.',
      },
    ]);

    res.json({
      success: true,
      message: 'Database successfully seeded with realistic sample data!',
      counts: {
        todos: todos.length,
        routines: routines.length,
        nutritionLogs: nutritionLogs.length,
        weightLogs: weightLogs.length,
        birthdays: birthdays.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
