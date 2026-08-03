import apiClient from './apiClient';
import { IBirthday } from '../types';

export const birthdayService = {
  getBirthdays: async (): Promise<IBirthday[]> => {
    const res = await apiClient.get('/birthdays');
    return res.data.data;
  },

  createBirthday: async (bdayData: Partial<IBirthday>): Promise<IBirthday> => {
    const res = await apiClient.post('/birthdays', bdayData);
    return res.data.data;
  },

  updateBirthday: async (id: string, bdayData: Partial<IBirthday>): Promise<IBirthday> => {
    const res = await apiClient.put(`/birthdays/${id}`, bdayData);
    return res.data.data;
  },

  deleteBirthday: async (id: string): Promise<void> => {
    await apiClient.delete(`/birthdays/${id}`);
  },
};
