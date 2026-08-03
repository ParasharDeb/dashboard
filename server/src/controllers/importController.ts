import { Request, Response, NextFunction } from 'express';
import * as XLSX from 'xlsx';
import Todo from '../models/Todo';
import Routine from '../models/Routine';
import NutritionLog from '../models/NutritionLog';
import WeightLog from '../models/WeightLog';
import Birthday from '../models/Birthday';

interface ParsedRecord<T> {
  id: string;
  data: T;
  entityType: 'todo' | 'routine' | 'nutrition' | 'weight' | 'birthday';
  isValid: boolean;
  errors: string[];
}

const normalizeHeader = (header: string): string => {
  return header.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
};

export const parseSpreadsheet = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let workbook: XLSX.WorkBook;

    if (req.file) {
      workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
    } else if (req.body && req.body.base64) {
      const buffer = Buffer.from(req.body.base64, 'base64');
      workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true });
    } else {
      res.status(400).json({ success: false, error: 'No spreadsheet file or base64 provided' });
      return;
    }

    const preview = {
      todos: [] as ParsedRecord<any>[],
      routines: [] as ParsedRecord<any>[],
      nutrition: [] as ParsedRecord<any>[],
      weight: [] as ParsedRecord<any>[],
      birthdays: [] as ParsedRecord<any>[],
    };

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const jsonRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      const normalizedSheetName = normalizeHeader(sheetName);

      jsonRows.forEach((row, index) => {
        const rowKeys = Object.keys(row);
        const normalizedMap: Record<string, any> = {};
        rowKeys.forEach((k) => {
          normalizedMap[normalizeHeader(k)] = row[k];
        });

        // Detect Entity Type
        const isTodo =
          normalizedSheetName.includes('todo') ||
          normalizedMap['task'] ||
          normalizedMap['todo'] ||
          (normalizedMap['title'] && normalizedMap['priority']);
        const isRoutine =
          normalizedSheetName.includes('routine') ||
          normalizedSheetName.includes('habit') ||
          normalizedMap['routine'] ||
          normalizedMap['timeofday'] ||
          normalizedMap['targetvalue'];
        const isNutrition =
          normalizedSheetName.includes('nutrition') ||
          normalizedSheetName.includes('food') ||
          normalizedSheetName.includes('meal') ||
          normalizedMap['calories'] ||
          normalizedMap['protein'] ||
          normalizedMap['mealtype'];
        const isWeight =
          normalizedSheetName.includes('weight') ||
          normalizedMap['weight'] ||
          normalizedMap['bodyweight'];
        const isBirthday =
          normalizedSheetName.includes('birthday') ||
          normalizedSheetName.includes('bday') ||
          normalizedMap['dateofbirth'] ||
          normalizedMap['dob'] ||
          (normalizedMap['name'] && normalizedMap['relationship']);

        const rowId = `${sheetName}_row_${index + 1}`;

        if (isTodo) {
          const errors: string[] = [];
          const title = normalizedMap['title'] || normalizedMap['task'] || normalizedMap['todo'] || normalizedMap['name'] || '';
          if (!title) errors.push('Title/Task is missing');

          let priority = (normalizedMap['priority'] || 'medium').toString().toLowerCase();
          if (!['low', 'medium', 'high'].includes(priority)) priority = 'medium';

          let status = (normalizedMap['status'] || 'pending').toString().toLowerCase();
          if (!['pending', 'in_progress', 'completed'].includes(status)) status = 'pending';

          preview.todos.push({
            id: rowId,
            entityType: 'todo',
            isValid: errors.length === 0,
            errors,
            data: {
              title: String(title).trim(),
              description: String(normalizedMap['description'] || normalizedMap['desc'] || '').trim(),
              priority,
              status,
              dueDate: normalizedMap['duedate'] || normalizedMap['due'] ? new Date(normalizedMap['duedate'] || normalizedMap['due']) : undefined,
              category: String(normalizedMap['category'] || normalizedMap['tag'] || 'General').trim(),
            },
          });
        } else if (isRoutine) {
          const errors: string[] = [];
          const title = normalizedMap['title'] || normalizedMap['routine'] || normalizedMap['habit'] || normalizedMap['name'] || '';
          if (!title) errors.push('Routine title is missing');

          let timeOfDay = (normalizedMap['timeofday'] || normalizedMap['slot'] || 'morning').toString().toLowerCase();
          if (!['morning', 'afternoon', 'evening', 'night'].includes(timeOfDay)) timeOfDay = 'morning';

          preview.routines.push({
            id: rowId,
            entityType: 'routine',
            isValid: errors.length === 0,
            errors,
            data: {
              title: String(title).trim(),
              category: String(normalizedMap['category'] || 'Health').trim(),
              timeOfDay,
              targetValue: Number(normalizedMap['targetvalue'] || normalizedMap['target'] || 1) || 1,
              unit: String(normalizedMap['unit'] || 'times').trim(),
            },
          });
        } else if (isNutrition) {
          const errors: string[] = [];
          const foodName = normalizedMap['foodname'] || normalizedMap['food'] || normalizedMap['item'] || normalizedMap['name'] || '';
          if (!foodName) errors.push('Food name is missing');

          let mealType = (normalizedMap['mealtype'] || normalizedMap['meal'] || 'snack').toString().toLowerCase();
          if (!['breakfast', 'lunch', 'dinner', 'snack'].includes(mealType)) mealType = 'snack';

          const calories = Number(normalizedMap['calories'] || normalizedMap['kcal'] || 0);
          const protein = Number(normalizedMap['protein'] || normalizedMap['prot'] || 0);

          preview.nutrition.push({
            id: rowId,
            entityType: 'nutrition',
            isValid: errors.length === 0,
            errors,
            data: {
              date: normalizedMap['date'] ? new Date(normalizedMap['date']).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              mealType,
              foodName: String(foodName).trim(),
              calories,
              protein,
              carbs: Number(normalizedMap['carbs'] || 0),
              fat: Number(normalizedMap['fat'] || 0),
            },
          });
        } else if (isWeight) {
          const errors: string[] = [];
          const weight = Number(normalizedMap['weight'] || normalizedMap['bodyweight'] || normalizedMap['wt'] || 0);
          if (!weight || weight <= 0) errors.push('Valid weight is required');

          preview.weight.push({
            id: rowId,
            entityType: 'weight',
            isValid: errors.length === 0,
            errors,
            data: {
              date: normalizedMap['date'] ? new Date(normalizedMap['date']).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
              weight,
              unit: ['kg', 'lbs'].includes(normalizedMap['unit']) ? normalizedMap['unit'] : 'kg',
              notes: String(normalizedMap['notes'] || normalizedMap['remark'] || '').trim(),
            },
          });
        } else if (isBirthday) {
          const errors: string[] = [];
          const name = normalizedMap['name'] || normalizedMap['person'] || '';
          if (!name) errors.push('Name is required');

          const rawDob = normalizedMap['dateofbirth'] || normalizedMap['dob'] || normalizedMap['birthday'];
          if (!rawDob) errors.push('Date of birth is required');

          preview.birthdays.push({
            id: rowId,
            entityType: 'birthday',
            isValid: errors.length === 0,
            errors,
            data: {
              name: String(name).trim(),
              dateOfBirth: rawDob ? new Date(rawDob) : new Date(),
              relationship: String(normalizedMap['relationship'] || normalizedMap['relation'] || 'Friend').trim(),
              notes: String(normalizedMap['notes'] || '').trim(),
            },
          });
        }
      });
    });

    const totalParsed =
      preview.todos.length +
      preview.routines.length +
      preview.nutrition.length +
      preview.weight.length +
      preview.birthdays.length;

    res.json({
      success: true,
      totalParsed,
      data: preview,
    });
  } catch (error) {
    next(error);
  }
};

export const commitImportData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { todos, routines, nutrition, weight, birthdays } = req.body;

    const summary = {
      todosImported: 0,
      routinesImported: 0,
      nutritionImported: 0,
      weightImported: 0,
      birthdaysImported: 0,
    };

    if (Array.isArray(todos) && todos.length > 0) {
      const created = await Todo.insertMany(todos);
      summary.todosImported = created.length;
    }

    if (Array.isArray(routines) && routines.length > 0) {
      const created = await Routine.insertMany(routines);
      summary.routinesImported = created.length;
    }

    if (Array.isArray(nutrition) && nutrition.length > 0) {
      const created = await NutritionLog.insertMany(nutrition);
      summary.nutritionImported = created.length;
    }

    if (Array.isArray(weight) && weight.length > 0) {
      // Upsert by date for weight logs
      for (const w of weight) {
        await WeightLog.findOneAndUpdate(
          { date: w.date },
          { weight: w.weight, unit: w.unit || 'kg', notes: w.notes || '' },
          { upsert: true, new: true }
        );
      }
      summary.weightImported = weight.length;
    }

    if (Array.isArray(birthdays) && birthdays.length > 0) {
      const created = await Birthday.insertMany(birthdays);
      summary.birthdaysImported = created.length;
    }

    res.json({
      success: true,
      message: 'Imported data successfully committed to database',
      summary,
    });
  } catch (error) {
    next(error);
  }
};
