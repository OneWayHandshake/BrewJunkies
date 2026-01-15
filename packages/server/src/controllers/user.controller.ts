import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';

export const userController = {
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.id },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              reviews: true,
              favorites: true,
              analyses: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError(404, 'User not found');
      }

      res.json({
        status: 'success',
        data: {
          ...user,
          reviewCount: user._count.reviews,
          favoriteCount: user._count.favorites,
          analysisCount: user._count.analyses,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, avatarUrl } = req.body;

      const user = await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          ...(name && { name }),
          ...(avatarUrl && { avatarUrl }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      res.json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async getFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: req.user!.id },
        include: {
          coffee: {
            select: {
              id: true,
              name: true,
              origin: true,
              roastLevel: true,
              imageUrl: true,
              tastingNotes: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        status: 'success',
        data: favorites.map((f) => f.coffee),
      });
    } catch (error) {
      next(error);
    }
  },

  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await prisma.review.findMany({
        where: { userId: req.user!.id },
        include: {
          coffee: {
            select: {
              id: true,
              name: true,
              origin: true,
              imageUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.json({
        status: 'success',
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  },
};
