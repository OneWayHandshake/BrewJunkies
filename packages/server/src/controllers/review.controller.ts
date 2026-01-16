import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import { passportService } from '../services/passport.service.js';

const createReviewSchema = z.object({
  coffeeId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().optional(),
  brewMethod: z.string(),
  brewParams: z.record(z.unknown()).optional(),
  tastingNotes: z.array(z.string()).optional(),
});

const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  title: z.string().optional(),
  content: z.string().optional(),
  brewMethod: z.string().optional(),
  brewParams: z.record(z.unknown()).optional(),
  tastingNotes: z.array(z.string()).optional(),
});

export const reviewController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = createReviewSchema.parse(req.body);

      // Check if user already reviewed this coffee
      const existing = await prisma.review.findUnique({
        where: {
          userId_coffeeId: {
            userId: req.user!.id,
            coffeeId: data.coffeeId,
          },
        },
      });

      if (existing) {
        throw new AppError(400, 'You have already reviewed this coffee');
      }

      const review = await prisma.review.create({
        data: {
          ...data,
          userId: req.user!.id,
          brewParams: data.brewParams || undefined,
          tastingNotes: data.tastingNotes || [],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      // Auto-add to passport when reviewing
      await passportService.addToPassport(req.user!.id, data.coffeeId, 'REVIEW');

      res.status(201).json({
        status: 'success',
        data: review,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Validation failed'));
      }
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = updateReviewSchema.parse(req.body);

      const review = await prisma.review.findUnique({
        where: { id: req.params.id },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      if (review.userId !== req.user!.id) {
        throw new AppError(403, 'Not authorized to update this review');
      }

      const updated = await prisma.review.update({
        where: { id: req.params.id },
        data,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      });

      res.json({
        status: 'success',
        data: updated,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Validation failed'));
      }
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await prisma.review.findUnique({
        where: { id: req.params.id },
      });

      if (!review) {
        throw new AppError(404, 'Review not found');
      }

      if (review.userId !== req.user!.id) {
        throw new AppError(403, 'Not authorized to delete this review');
      }

      await prisma.review.delete({
        where: { id: req.params.id },
      });

      res.json({
        status: 'success',
        message: 'Review deleted',
      });
    } catch (error) {
      next(error);
    }
  },
};
