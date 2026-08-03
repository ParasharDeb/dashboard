import { Router } from 'express';
import {
  getWeightLogs,
  logWeight,
  updateWeightLog,
  deleteWeightLog,
} from '../controllers/weightController';

const router = Router();

router.get('/', getWeightLogs);
router.post('/', logWeight);
router.put('/:id', updateWeightLog);
router.delete('/:id', deleteWeightLog);

export default router;
