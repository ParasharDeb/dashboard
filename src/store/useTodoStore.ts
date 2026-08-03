import { create } from 'zustand';
import { ITodo, PriorityLevel, TodoStatus } from '../types';
import { todoService, TodoQueryParams } from '../services/todoService';

interface TodoState {
  todos: ITodo[];
  loading: boolean;
  error: string | null;
  filters: TodoQueryParams;

  setFilters: (newFilters: Partial<TodoQueryParams>) => void;
  fetchTodos: () => Promise<void>;
  addTodo: (data: Partial<ITodo>) => Promise<void>;
  updateTodo: (id: string, data: Partial<ITodo>) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    category: 'all',
    search: '',
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().fetchTodos();
  },

  fetchTodos: async () => {
    set({ loading: true, error: null });
    try {
      const data = await todoService.getTodos(get().filters);
      set({ todos: data, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch todos', loading: false });
    }
  },

  addTodo: async (data) => {
    set({ loading: true, error: null });
    try {
      const newTodo = await todoService.createTodo(data);
      set((state) => ({ todos: [newTodo, ...state.todos], loading: false }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to add todo', loading: false });
    }
  },

  updateTodo: async (id, data) => {
    try {
      const updated = await todoService.updateTodo(id, data);
      set((state) => ({
        todos: state.todos.map((t) => (t._id === id ? updated : t)),
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to update todo' });
    }
  },

  toggleTodo: async (id) => {
    // Optimistic UI update
    set((state) => ({
      todos: state.todos.map((t) =>
        t._id === id
          ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' }
          : t
      ),
    }));
    try {
      const updated = await todoService.toggleTodo(id);
      set((state) => ({
        todos: state.todos.map((t) => (t._id === id ? updated : t)),
      }));
    } catch (err: any) {
      get().fetchTodos(); // Revert on failure
      set({ error: err.message || 'Failed to toggle todo status' });
    }
  },

  deleteTodo: async (id) => {
    const prev = get().todos;
    set((state) => ({ todos: state.todos.filter((t) => t._id !== id) }));
    try {
      await todoService.deleteTodo(id);
    } catch (err: any) {
      set({ todos: prev, error: err.message || 'Failed to delete todo' });
    }
  },
}));
