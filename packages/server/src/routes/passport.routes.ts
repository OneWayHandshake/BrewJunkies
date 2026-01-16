import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { passportController } from '../controllers/passport.controller.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', passportController.getPassport);
router.get('/coffees', passportController.getTriedCoffees);
router.post('/coffees', passportController.addCoffee);
router.delete('/coffees/:coffeeId', passportController.removeCoffee);
router.get('/achievements', passportController.getAchievements);

export default router;
