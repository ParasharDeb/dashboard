import apiClient from './apiClient';
import { IWeightLog, IWeightStats } from '../types';

export interface WeightResponse {
  stats: IWeightStats;
  data: IWeightLog[];
}

export const weightService = {
  getLogs: async (days: number = 30): Promise<WeightResponse> => {
    const res = await apiClient.get('/weight', { params: { days } });
    return res.data;
  },

  logWeight: async (weightData: Partial<IWeightLog>): Promise<IWeightLog> => {
    const res = await apiClient.post('/weight', weightData);
    return res.data.data;
  },

  updateWeightLog: async (id: string, weightData: Partial<IWeightLog>): Promise<IWeightLog> => {
    const res = await apiClient.put(`/weight/${id}`, weightData);
    return res.data.data;
  },

  deleteWeightLog: async (id: string): Promise<void> => {
    await apiClient.delete(`/weight/${id}`);
  },
};
