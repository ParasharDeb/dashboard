import { Router } from 'express';
import multer from 'multer';
import { parseSpreadsheet, commitImportData } from '../controllers/importController';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

router.post('/parse', upload.single('file'), parseSpreadsheet);
router.post('/commit', commitImportData);

export default router;
