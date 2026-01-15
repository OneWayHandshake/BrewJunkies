import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { analyzeController } from '../controllers/analyze.controller.js';

const router = Router();

router.post('/', optionalAuth, analyzeController.analyze);
router.get('/', authenticate, analyzeController.getHistory);
router.get('/:id', authenticate, analyzeController.getById);

export default router;
