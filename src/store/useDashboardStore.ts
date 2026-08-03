import { create } from 'zustand';
import { IDashboardSummary } from '../types';
import { dashboardService } from '../services/dashboardService';

interface DashboardState {
  summary: IDashboardSummary | null;
  loading: boolean;
  error: string | null;
  fetchSummary: () => Promise<void>;
  seedData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  loading: false,
  error: null,

  fetchSummary: async () => {
    set({ loading: true, error: null });
    try {
      const data = await dashboardService.getSummary();
      set({ summary: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch dashboard summary', loading: false });
    }
  },

  seedData: async () => {
    set({ loading: true, error: null });
    try {
      await dashboardService.seedDatabase();
      const data = await dashboardService.getSummary();
      set({ summary: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to seed database', loading: false });
    }
  },
}));
