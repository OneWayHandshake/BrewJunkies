import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import coffeeRoutes from './coffee.routes.js';
import reviewRoutes from './review.routes.js';
import uploadRoutes from './upload.routes.js';
import analyzeRoutes from './analyze.routes.js';
import educationRoutes from './education.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/coffees', coffeeRoutes);
router.use('/reviews', reviewRoutes);
router.use('/upload', uploadRoutes);
router.use('/analyze', analyzeRoutes);
router.use('/education', educationRoutes);

export default router;
