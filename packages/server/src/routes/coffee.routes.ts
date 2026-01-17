import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { coffeeController } from '../controllers/coffee.controller.js';

const router = Router();

// All coffee routes require authentication - coffees are user-specific
router.get('/', authenticate, coffeeController.getAll);
router.get('/:id', authenticate, coffeeController.getById);
router.post('/', authenticate, coffeeController.create);
router.patch('/:id', authenticate, coffeeController.update);
router.delete('/:id', authenticate, coffeeController.delete);

// Reviews for a specific coffee
router.get('/:id/reviews', authenticate, coffeeController.getReviews);

// Favorites
router.post('/:id/favorite', authenticate, coffeeController.addFavorite);
router.delete('/:id/favorite', authenticate, coffeeController.removeFavorite);

export default router;
