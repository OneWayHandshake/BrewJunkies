import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const uploadController = {
  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new AppError(400, 'No file uploaded');
      }

      const { originalname, mimetype, size, buffer } = req.file;

      // Validate file type
      if (!mimetype.startsWith('image/')) {
        throw new AppError(400, 'Only image files are allowed');
      }

      // Validate file size (10MB max)
      if (size > 10 * 1024 * 1024) {
        throw new AppError(400, 'File size must be less than 10MB');
      }

      // Store image in database
      const image = await prisma.image.create({
        data: {
          filename: originalname,
          mimeType: mimetype,
          size,
          data: buffer,
          userId: req.user?.id,
        },
      });

      res.status(201).json({
        status: 'success',
        data: {
          id: image.id,
          filename: image.filename,
          mimeType: image.mimeType,
          size: image.size,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getImage(req: Request, res: Response, next: NextFunction) {
    try {
      const image = await prisma.image.findUnique({
        where: { id: req.params.id },
      });

      if (!image) {
        throw new AppError(404, 'Image not found');
      }

      res.set('Content-Type', image.mimeType);
      res.set('Content-Length', image.size.toString());
      res.set('Cache-Control', 'public, max-age=31536000');
      res.send(Buffer.from(image.data));
    } catch (error) {
      next(error);
    }
  },

  async getImageBase64(req: Request, res: Response, next: NextFunction) {
    try {
      const image = await prisma.image.findUnique({
        where: { id: req.params.id },
      });

      if (!image) {
        throw new AppError(404, 'Image not found');
      }

      const base64 = Buffer.from(image.data).toString('base64');
      const dataUrl = `data:${image.mimeType};base64,${base64}`;

      res.json({
        status: 'success',
        data: {
          id: image.id,
          dataUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const image = await prisma.image.findUnique({
        where: { id: req.params.id },
      });

      if (!image) {
        throw new AppError(404, 'Image not found');
      }

      // Only allow deletion by the owner
      if (image.userId && image.userId !== req.user?.id) {
        throw new AppError(403, 'Not authorized to delete this image');
      }

      await prisma.image.delete({
        where: { id: req.params.id },
      });

      res.json({
        status: 'success',
        message: 'Image deleted',
      });
    } catch (error) {
      next(error);
    }
  },
};
