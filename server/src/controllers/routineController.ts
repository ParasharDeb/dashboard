import { Request, Response, NextFunction } from 'express';
import Routine from '../models/Routine';

export const getRoutines = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date } = req.query;
    const targetDate = (typeof date === 'string' && date) || new Date().toISOString().split('T')[0];

    const routines = await Routine.find().sort({ createdAt: 1 });

    // Format output with computed completion state for targetDate
    const formattedRoutines = routines.map((routine) => {
      const historyEntry = routine.history.find((h) => h.date === targetDate);
      return {
        ...routine.toObject(),
        completedToday: historyEntry ? historyEntry.completed : false,
        valueToday: historyEntry ? historyEntry.value : 0,
      };
    });

    res.json({ success: true, date: targetDate, data: formattedRoutines });
  } catch (error) {
    next(error);
  }
};

export const createRoutine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, category, timeOfDay, targetValue, unit } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ success: false, error: 'Title is required' });
      return;
    }

    const routine = await Routine.create({
      title: title.trim(),
      category: category ? String(category).trim() : 'Health',
      timeOfDay: ['morning', 'afternoon', 'evening', 'night'].includes(timeOfDay) ? timeOfDay : 'morning',
      targetValue: Number(targetValue) || 1,
      unit: unit ? String(unit).trim() : 'times',
      history: [],
    });

    res.status(201).json({ success: true, data: routine });
  } catch (error) {
    next(error);
  }
};

export const updateRoutine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, category, timeOfDay, targetValue, unit } = req.body;

    const routine = await Routine.findById(id);
    if (!routine) {
      res.status(404).json({ success: false, error: 'Routine not found' });
      return;
    }

    if (title !== undefined) routine.title = String(title).trim();
    if (category !== undefined) routine.category = String(category).trim();
    if (timeOfDay && ['morning', 'afternoon', 'evening', 'night'].includes(timeOfDay)) {
      routine.timeOfDay = timeOfDay;
    }
    if (targetValue !== undefined) routine.targetValue = Number(targetValue) || 1;
    if (unit !== undefined) routine.unit = String(unit).trim();

    await routine.save();
    res.json({ success: true, data: routine });
  } catch (error) {
    next(error);
  }
};

export const logRoutineProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, completed, value } = req.body;

    const targetDate = date || new Date().toISOString().split('T')[0];

    const routine = await Routine.findById(id);
    if (!routine) {
      res.status(404).json({ success: false, error: 'Routine not found' });
      return;
    }

    const historyIdx = routine.history.findIndex((h) => h.date === targetDate);
    const isCompleted = completed !== undefined ? Boolean(completed) : true;
    const val = value !== undefined ? Number(value) : (isCompleted ? routine.targetValue : 0);

    if (historyIdx >= 0) {
      routine.history[historyIdx].completed = isCompleted;
      routine.history[historyIdx].value = val;
    } else {
      routine.history.push({
        date: targetDate,
        completed: isCompleted,
        value: val,
      });
    }

    await routine.save();

    res.json({
      success: true,
      data: {
        ...routine.toObject(),
        completedToday: isCompleted,
        valueToday: val,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRoutine = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const routine = await Routine.findByIdAndDelete(id);

    if (!routine) {
      res.status(404).json({ success: false, error: 'Routine not found' });
      return;
    }

    res.json({ success: true, message: 'Routine deleted successfully' });
  } catch (error) {
    next(error);
  }
};
