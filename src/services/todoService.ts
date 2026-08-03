import apiClient from './apiClient';
import { ITodo } from '../types';

export interface TodoQueryParams {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
}

export const todoService = {
  getTodos: async (params?: TodoQueryParams): Promise<ITodo[]> => {
    const res = await apiClient.get('/todos', { params });
    return res.data.data;
  },

  createTodo: async (todoData: Partial<ITodo>): Promise<ITodo> => {
    const res = await apiClient.post('/todos', todoData);
    return res.data.data;
  },

  updateTodo: async (id: string, todoData: Partial<ITodo>): Promise<ITodo> => {
    const res = await apiClient.put(`/todos/${id}`, todoData);
    return res.data.data;
  },

  toggleTodo: async (id: string): Promise<ITodo> => {
    const res = await apiClient.patch(`/todos/${id}/toggle`);
    return res.data.data;
  },

  deleteTodo: async (id: string): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
  },
};
