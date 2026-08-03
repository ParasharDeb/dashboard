import apiClient from './apiClient';
import { IDashboardSummary } from '../types';

export const dashboardService = {
  getSummary: async (): Promise<IDashboardSummary> => {
    const res = await apiClient.get('/dashboard');
    return res.data.data;
  },

  seedDatabase: async (): Promise<any> => {
    const res = await apiClient.post('/seed');
    return res.data;
  },
};
