import { Router } from 'express';
import {
  getRoutines,
  createRoutine,
  updateRoutine,
  logRoutineProgress,
  deleteRoutine,
} from '../controllers/routineController';

const router = Router();

router.get('/', getRoutines);
router.post('/', createRoutine);
router.put('/:id', updateRoutine);
router.post('/:id/log', logRoutineProgress);
router.delete('/:id', deleteRoutine);

export default router;
