import { Router } from 'express';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { apiKeyController } from '../controllers/api-key.controller.js';

const router = Router();

// All routes except usage require authentication
router.get('/', authenticate, apiKeyController.listKeys);
router.put('/:provider', authenticate, apiKeyController.saveKey);
router.delete('/:provider', authenticate, apiKeyController.deleteKey);
router.post('/:provider/test', authenticate, apiKeyController.testKey);
router.patch('/preferred', authenticate, apiKeyController.setPreferred);

// Usage can be checked with or without auth (for anonymous users)
router.get('/usage', optionalAuth, apiKeyController.getUsage);

export default router;
