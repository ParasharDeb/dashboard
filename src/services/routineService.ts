import apiClient from './apiClient';
import { IRoutine } from '../types';

export const routineService = {
  getRoutines: async (date?: string): Promise<{ date: string; data: IRoutine[] }> => {
    const res = await apiClient.get('/routines', { params: { date } });
    return { date: res.data.date, data: res.data.data };
  },

  createRoutine: async (routineData: Partial<IRoutine>): Promise<IRoutine> => {
    const res = await apiClient.post('/routines', routineData);
    return res.data.data;
  },

  updateRoutine: async (id: string, routineData: Partial<IRoutine>): Promise<IRoutine> => {
    const res = await apiClient.put(`/routines/${id}`, routineData);
    return res.data.data;
  },

  logProgress: async (
    id: string,
    progress: { date?: string; completed?: boolean; value?: number }
  ): Promise<IRoutine> => {
    const res = await apiClient.post(`/routines/${id}/log`, progress);
    return res.data.data;
  },

  deleteRoutine: async (id: string): Promise<void> => {
    await apiClient.delete(`/routines/${id}`);
  },
};
