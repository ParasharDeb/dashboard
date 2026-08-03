import { Router } from 'express';
import {
  getNutritionLogs,
  createNutritionLog,
  updateNutritionLog,
  deleteNutritionLog,
  getNutritionGoals,
  updateNutritionGoals,
} from '../controllers/nutritionController';

const router = Router();

router.get('/logs', getNutritionLogs);
router.post('/logs', createNutritionLog);
router.put('/logs/:id', updateNutritionLog);
router.delete('/logs/:id', deleteNutritionLog);

router.get('/goals', getNutritionGoals);
router.put('/goals', updateNutritionGoals);

export default router;
