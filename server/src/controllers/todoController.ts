import { Request, Response, NextFunction } from 'express';
import Todo from '../models/Todo';

export const getTodos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, priority, category, search } = req.query;
    const query: Record<string, any> = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    if (category && category !== 'all') {
      query.category = category;
    }
    if (search && typeof search === 'string' && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const todos = await Todo.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, priority, status, dueDate, category } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      res.status(400).json({ success: false, error: 'Title is required' });
      return;
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? String(description).trim() : '',
      priority: ['low', 'medium', 'high'].includes(priority) ? priority : 'medium',
      status: ['pending', 'in_progress', 'completed'].includes(status) ? status : 'pending',
      dueDate: dueDate ? new Date(dueDate) : undefined,
      category: category ? String(category).trim() : 'General',
    });

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate, category } = req.body;

    const todo = await Todo.findById(id);
    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }

    if (title !== undefined) todo.title = String(title).trim();
    if (description !== undefined) todo.description = String(description).trim();
    if (priority && ['low', 'medium', 'high'].includes(priority)) todo.priority = priority;
    if (status && ['pending', 'in_progress', 'completed'].includes(status)) todo.status = status;
    if (dueDate !== undefined) todo.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (category !== undefined) todo.category = String(category).trim();

    await todo.save();
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

export const toggleTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const todo = await Todo.findById(id);

    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }

    todo.status = todo.status === 'completed' ? 'pending' : 'completed';
    await todo.save();

    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id);

    if (!todo) {
      res.status(404).json({ success: false, error: 'Todo not found' });
      return;
    }

    res.json({ success: true, message: 'Todo deleted successfully' });
  } catch (error) {
    next(error);
  }
};
