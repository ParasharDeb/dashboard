import apiClient from './apiClient';
import { INutritionLog, INutritionGoal } from '../types';

export interface NutritionDayResponse {
  date: string;
  totals: { calories: number; protein: number; carbs: number; fat: number };
  goals: INutritionGoal;
  data: INutritionLog[];
}

export const nutritionService = {
  getLogs: async (date?: string): Promise<NutritionDayResponse> => {
    const res = await apiClient.get('/nutrition/logs', { params: { date } });
    return res.data;
  },

  createLog: async (logData: Partial<INutritionLog>): Promise<INutritionLog> => {
    const res = await apiClient.post('/nutrition/logs', logData);
    return res.data.data;
  },

  updateLog: async (id: string, logData: Partial<INutritionLog>): Promise<INutritionLog> => {
    const res = await apiClient.put(`/nutrition/logs/${id}`, logData);
    return res.data.data;
  },

  deleteLog: async (id: string): Promise<void> => {
    await apiClient.delete(`/nutrition/logs/${id}`);
  },

  getGoals: async (): Promise<INutritionGoal> => {
    const res = await apiClient.get('/nutrition/goals');
    return res.data.data;
  },

  updateGoals: async (goals: Partial<INutritionGoal>): Promise<INutritionGoal> => {
    const res = await apiClient.put('/nutrition/goals', goals);
    return res.data.data;
  },
};
