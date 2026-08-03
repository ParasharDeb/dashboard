import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import dashboardRoutes from './routes/dashboardRoutes';
import todoRoutes from './routes/todoRoutes';
import routineRoutes from './routes/routineRoutes';
import nutritionRoutes from './routes/nutritionRoutes';
import weightRoutes from './routes/weightRoutes';
import birthdayRoutes from './routes/birthdayRoutes';
import importRoutes from './routes/importRoutes';
import seedRoutes from './routes/seedRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health Check Endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Dashboard Full-Stack Backend API',
  });
});

// API Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/birthdays', birthdayRoutes);
app.use('/api/import', importRoutes);
app.use('/api/seed', seedRoutes);

// Error Handler Middleware
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Express] Dashboard backend server running at http://localhost:${PORT}`);
  });
}

export default app;
