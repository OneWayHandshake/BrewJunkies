import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { reviewController } from '../controllers/review.controller.js';

const router = Router();

router.post('/', authenticate, reviewController.create);
router.patch('/:id', authenticate, reviewController.update);
router.delete('/:id', authenticate, reviewController.delete);

export default router;
