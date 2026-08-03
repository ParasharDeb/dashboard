import { create } from 'zustand';
import { IBirthday } from '../types';
import { birthdayService } from '../services/birthdayService';

interface BirthdayState {
  birthdays: IBirthday[];
  loading: boolean;
  error: string | null;

  fetchBirthdays: () => Promise<void>;
  addBirthday: (data: Partial<IBirthday>) => Promise<void>;
  updateBirthday: (id: string, data: Partial<IBirthday>) => Promise<void>;
  deleteBirthday: (id: string) => Promise<void>;
}

export const useBirthdayStore = create<BirthdayState>((set, get) => ({
  birthdays: [],
  loading: false,
  error: null,

  fetchBirthdays: async () => {
    set({ loading: true, error: null });
    try {
      const data = await birthdayService.getBirthdays();
      set({ birthdays: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch birthdays', loading: false });
    }
  },

  addBirthday: async (data) => {
    set({ loading: true, error: null });
    try {
      await birthdayService.createBirthday(data);
      await get().fetchBirthdays();
    } catch (err: any) {
      set({ error: err.message || 'Failed to add birthday', loading: false });
    }
  },

  updateBirthday: async (id, data) => {
    try {
      await birthdayService.updateBirthday(id, data);
      await get().fetchBirthdays();
    } catch (err: any) {
      set({ error: err.message || 'Failed to update birthday' });
    }
  },

  deleteBirthday: async (id) => {
    try {
      await birthdayService.deleteBirthday(id);
      set((state) => ({ birthdays: state.birthdays.filter((b) => b._id !== id) }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete birthday' });
    }
  },
}));
