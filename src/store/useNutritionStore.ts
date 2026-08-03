import { create } from 'zustand';
import { INutritionLog, INutritionGoal } from '../types';
import { nutritionService, NutritionDayResponse } from '../services/nutritionService';

interface NutritionState {
  logs: INutritionLog[];
  totals: { calories: number; protein: number; carbs: number; fat: number };
  goals: INutritionGoal;
  selectedDate: string;
  loading: boolean;
  error: string | null;

  setSelectedDate: (date: string) => void;
  fetchNutrition: (date?: string) => Promise<void>;
  addLog: (log: Partial<INutritionLog>) => Promise<void>;
  updateLog: (id: string, log: Partial<INutritionLog>) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  updateGoals: (goals: Partial<INutritionGoal>) => Promise<void>;
}

export const useNutritionStore = create<NutritionState>((set, get) => ({
  logs: [],
  totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
  goals: { dailyCalories: 2200, dailyProtein: 150, dailyCarbs: 250, dailyFat: 70 },
  selectedDate: new Date().toISOString().split('T')[0],
  loading: false,
  error: null,

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchNutrition(date);
  },

  fetchNutrition: async (date) => {
    const targetDate = date || get().selectedDate;
    set({ loading: true, error: null });
    try {
      const res: NutritionDayResponse = await nutritionService.getLogs(targetDate);
      set({
        logs: res.data,
        totals: res.totals,
        goals: res.goals,
        selectedDate: res.date,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch nutrition data', loading: false });
    }
  },

  addLog: async (logData) => {
    set({ loading: true, error: null });
    try {
      const payload = { ...logData, date: logData.date || get().selectedDate };
      await nutritionService.createLog(payload);
      await get().fetchNutrition();
    } catch (err: any) {
      set({ error: err.message || 'Failed to add meal log', loading: false });
    }
  },

  updateLog: async (id, logData) => {
    try {
      await nutritionService.updateLog(id, logData);
      await get().fetchNutrition();
    } catch (err: any) {
      set({ error: err.message || 'Failed to update meal log' });
    }
  },

  deleteLog: async (id) => {
    try {
      await nutritionService.deleteLog(id);
      await get().fetchNutrition();
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete meal log' });
    }
  },

  updateGoals: async (newGoals) => {
    try {
      const updated = await nutritionService.updateGoals(newGoals);
      set({ goals: updated });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update nutrition goals' });
    }
  },
}));
