import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { recipeController } from '../controllers/recipe.controller.js';

const router = Router();

// Public routes (show default recipes to everyone)
router.get('/', optionalAuth, recipeController.getAll);
router.get('/community', optionalAuth, recipeController.getCommunity);
router.get('/:id', optionalAuth, recipeController.getById);

// Protected routes (require authentication)
router.post('/', authenticate, recipeController.create);
router.post('/:id/clone', authenticate, recipeController.clone);
router.patch('/:id', authenticate, recipeController.update);
router.delete('/:id', authenticate, recipeController.delete);

export default router;
