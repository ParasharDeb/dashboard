import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: Date;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const TodoSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
    dueDate: { type: Date },
    category: { type: String, default: 'General', trim: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITodo>('Todo', TodoSchema);
