import { create } from 'zustand';
import { IWeightLog, IWeightStats } from '../types';
import { weightService } from '../services/weightService';

interface WeightState {
  logs: IWeightLog[];
  stats: IWeightStats;
  rangeDays: number;
  loading: boolean;
  error: string | null;

  setRangeDays: (days: number) => void;
  fetchWeightLogs: (days?: number) => Promise<void>;
  logWeight: (data: Partial<IWeightLog>) => Promise<void>;
  updateWeightLog: (id: string, data: Partial<IWeightLog>) => Promise<void>;
  deleteWeightLog: (id: string) => Promise<void>;
}

export const useWeightStore = create<WeightState>((set, get) => ({
  logs: [],
  stats: { latest: null, starting: null, min: null, max: null, avg: null, change: 0, count: 0 },
  rangeDays: 30,
  loading: false,
  error: null,

  setRangeDays: (days) => {
    set({ rangeDays: days });
    get().fetchWeightLogs(days);
  },

  fetchWeightLogs: async (days) => {
    const targetDays = days || get().rangeDays;
    set({ loading: true, error: null });
    try {
      const res = await weightService.getLogs(targetDays);
      set({ logs: res.data, stats: res.stats, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch weight logs', loading: false });
    }
  },

  logWeight: async (data) => {
    set({ loading: true, error: null });
    try {
      await weightService.logWeight(data);
      await get().fetchWeightLogs();
    } catch (err: any) {
      set({ error: err.message || 'Failed to log weight', loading: false });
    }
  },

  updateWeightLog: async (id, data) => {
    try {
      await weightService.updateWeightLog(id, data);
      await get().fetchWeightLogs();
    } catch (err: any) {
      set({ error: err.message || 'Failed to update weight log' });
    }
  },

  deleteWeightLog: async (id) => {
    try {
      await weightService.deleteWeightLog(id);
      await get().fetchWeightLogs();
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete weight log' });
    }
  },
}));
