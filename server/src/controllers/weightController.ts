import { Request, Response, NextFunction } from 'express';
import WeightLog from '../models/WeightLog';

export const getWeightLogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { days } = req.query;
    const limitDays = Number(days) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - limitDays);
    const startDateStr = startDate.toISOString().split('T')[0];

    const logs = await WeightLog.find({ date: { $gte: startDateStr } }).sort({ date: 1 });

    let latest = null;
    let starting = null;
    let min = null;
    let max = null;
    let avg = null;
    let change = 0;

    if (logs.length > 0) {
      starting = logs[0].weight;
      latest = logs[logs.length - 1].weight;
      const weights = logs.map((l) => l.weight);
      min = Math.min(...weights);
      max = Math.max(...weights);
      const sum = weights.reduce((acc, curr) => acc + curr, 0);
      avg = Math.round((sum / weights.length) * 10) / 10;
      change = Math.round((latest - starting) * 10) / 10;
    }

    res.json({
      success: true,
      stats: {
        latest,
        starting,
        min,
        max,
        avg,
        change,
        count: logs.length,
      },
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const logWeight = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { date, weight, unit, notes } = req.body;

    if (!weight || Number(weight) <= 0) {
      res.status(400).json({ success: false, error: 'Valid weight is required' });
      return;
    }

    const logDate = date || new Date().toISOString().split('T')[0];

    let log = await WeightLog.findOne({ date: logDate });

    if (log) {
      log.weight = Number(weight);
      if (unit && ['kg', 'lbs'].includes(unit)) log.unit = unit;
      if (notes !== undefined) log.notes = String(notes).trim();
      await log.save();
    } else {
      log = await WeightLog.create({
        date: logDate,
        weight: Number(weight),
        unit: ['kg', 'lbs'].includes(unit) ? unit : 'kg',
        notes: notes ? String(notes).trim() : '',
      });
    }

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

export const updateWeightLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, weight, unit, notes } = req.body;

    const log = await WeightLog.findById(id);
    if (!log) {
      res.status(404).json({ success: false, error: 'Weight log not found' });
      return;
    }

    if (date !== undefined) log.date = String(date);
    if (weight !== undefined) log.weight = Number(weight);
    if (unit && ['kg', 'lbs'].includes(unit)) log.unit = unit;
    if (notes !== undefined) log.notes = String(notes).trim();

    await log.save();
    res.json({ success: true, data: log });
  } catch (error) {
    next(error);
  }
};

export const deleteWeightLog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const log = await WeightLog.findByIdAndDelete(id);

    if (!log) {
      res.status(404).json({ success: false, error: 'Weight log not found' });
      return;
    }

    res.json({ success: true, message: 'Weight log deleted successfully' });
  } catch (error) {
    next(error);
  }
};
