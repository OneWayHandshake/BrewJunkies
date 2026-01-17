import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import coffeeRoutes from './coffee.routes.js';
import reviewRoutes from './review.routes.js';
import uploadRoutes from './upload.routes.js';
import analyzeRoutes from './analyze.routes.js';
import educationRoutes from './education.routes.js';
import apiKeysRoutes from './api-keys.routes.js';
import passportRoutes from './passport.routes.js';
import recipeRoutes from './recipe.routes.js';
import brewRoutes from './brew.routes.js';
import grinderRoutes from './grinder.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/coffees', coffeeRoutes);
router.use('/reviews', reviewRoutes);
router.use('/upload', uploadRoutes);
router.use('/analyze', analyzeRoutes);
router.use('/education', educationRoutes);
router.use('/keys', apiKeysRoutes);
router.use('/passport', passportRoutes);
router.use('/recipes', recipeRoutes);
router.use('/brews', brewRoutes);
router.use('/grinders', grinderRoutes);

export default router;
