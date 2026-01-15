import { Router } from 'express';
import { educationController } from '../controllers/education.controller.js';

const router = Router();

router.get('/', educationController.getAll);
router.get('/categories', educationController.getCategories);
router.get('/:slug', educationController.getBySlug);

export default router;
