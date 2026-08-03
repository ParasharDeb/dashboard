import { create } from 'zustand';
import { IRoutine } from '../types';
import { routineService } from '../services/routineService';

interface RoutineState {
  routines: IRoutine[];
  selectedDate: string;
  loading: boolean;
  error: string | null;

  setSelectedDate: (date: string) => void;
  fetchRoutines: (date?: string) => Promise<void>;
  addRoutine: (data: Partial<IRoutine>) => Promise<void>;
  updateRoutine: (id: string, data: Partial<IRoutine>) => Promise<void>;
  toggleRoutineProgress: (id: string, completed: boolean, value?: number) => Promise<void>;
  deleteRoutine: (id: string) => Promise<void>;
}

export const useRoutineStore = create<RoutineState>((set, get) => ({
  routines: [],
  selectedDate: new Date().toISOString().split('T')[0],
  loading: false,
  error: null,

  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchRoutines(date);
  },

  fetchRoutines: async (date) => {
    const targetDate = date || get().selectedDate;
    set({ loading: true, error: null });
    try {
      const res = await routineService.getRoutines(targetDate);
      set({ routines: res.data, selectedDate: res.date, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch routines', loading: false });
    }
  },

  addRoutine: async (data) => {
    set({ loading: true, error: null });
    try {
      await routineService.createRoutine(data);
      await get().fetchRoutines();
    } catch (err: any) {
      set({ error: err.message || 'Failed to add routine', loading: false });
    }
  },

  updateRoutine: async (id, data) => {
    try {
      await routineService.updateRoutine(id, data);
      await get().fetchRoutines();
    } catch (err: any) {
      set({ error: err.message || 'Failed to update routine' });
    }
  },

  toggleRoutineProgress: async (id, completed, value) => {
    const targetDate = get().selectedDate;
    // Optimistic state
    set((state) => ({
      routines: state.routines.map((r) =>
        r._id === id
          ? {
              ...r,
              completedToday: completed,
              valueToday: value !== undefined ? value : completed ? r.targetValue : 0,
            }
          : r
      ),
    }));

    try {
      await routineService.logProgress(id, {
        date: targetDate,
        completed,
        value,
      });
    } catch (err: any) {
      get().fetchRoutines(); // Revert
      set({ error: err.message || 'Failed to log routine progress' });
    }
  },

  deleteRoutine: async (id) => {
    try {
      await routineService.deleteRoutine(id);
      set((state) => ({ routines: state.routines.filter((r) => r._id !== id) }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete routine' });
    }
  },
}));
