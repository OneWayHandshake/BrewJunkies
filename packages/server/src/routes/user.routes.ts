import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { userController } from '../controllers/user.controller.js';

const router = Router();

router.get('/me', authenticate, userController.getMe);
router.patch('/me', authenticate, userController.updateMe);
router.get('/me/stats', authenticate, userController.getProfileStats);
router.get('/me/favorites', authenticate, userController.getFavorites);
router.get('/me/reviews', authenticate, userController.getReviews);

export default router;
