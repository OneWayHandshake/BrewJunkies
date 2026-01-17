import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { brewController } from '../controllers/brew.controller.js';

const router = Router();

// All brew routes require authentication
router.use(authenticate);

// Brew log CRUD
router.get('/', brewController.getAll);
router.get('/stats', brewController.getStats);
router.get('/:id', brewController.getById);
router.post('/', brewController.create);
router.patch('/:id', brewController.update);
router.delete('/:id', brewController.delete);

export default router;
