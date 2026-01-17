import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { grinderController } from '../controllers/grinder.controller.js';

const router = Router();

// All grinder routes require authentication
router.use(authenticate);

// Grinder CRUD
router.get('/', grinderController.getAllGrinders);
router.get('/:id', grinderController.getGrinderById);
router.post('/', grinderController.createGrinder);
router.patch('/:id', grinderController.updateGrinder);
router.delete('/:id', grinderController.deleteGrinder);

// Grind settings
router.get('/settings/all', grinderController.getAllSettings);
router.get('/settings/suggestions', grinderController.getSuggestions);
router.post('/settings', grinderController.createSetting);
router.patch('/settings/:id', grinderController.updateSetting);
router.delete('/settings/:id', grinderController.deleteSetting);

export default router;
