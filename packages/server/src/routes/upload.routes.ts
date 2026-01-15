import { Router } from 'express';
import multer from 'multer';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { uploadController } from '../controllers/upload.controller.js';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Upload image (auth optional - can upload without account)
router.post('/', optionalAuth, upload.single('image'), uploadController.upload);

// Get image by ID (serves raw image)
router.get('/:id', uploadController.getImage);

// Get image as base64 data URL (for AI analysis)
router.get('/:id/base64', uploadController.getImageBase64);

// Delete image (requires auth)
router.delete('/:id', authenticate, uploadController.deleteImage);

export default router;
