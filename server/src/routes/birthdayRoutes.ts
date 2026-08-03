import { Router } from 'express';
import {
  getBirthdays,
  createBirthday,
  updateBirthday,
  deleteBirthday,
} from '../controllers/birthdayController';

const router = Router();

router.get('/', getBirthdays);
router.post('/', createBirthday);
router.put('/:id', updateBirthday);
router.delete('/:id', deleteBirthday);

export default router;
