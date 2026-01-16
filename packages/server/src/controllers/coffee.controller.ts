import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import type { RoastLevel, ProcessMethod } from '@coffee/shared';
import { passportService } from '../services/passport.service.js';

export const coffeeController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        origin,
        roastLevel,
        minRating,
        search,
        sort = '-createdAt',
        page = '1',
        limit = '20',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = Math.min(parseInt(limit as string), 100);
      const skip = (pageNum - 1) * limitNum;

      const where: Record<string, unknown> = {};

      if (origin) {
        where.origin = { in: (origin as string).split(',') };
      }

      if (roastLevel) {
        where.roastLevel = { in: (roastLevel as string).split(',') as RoastLevel[] };
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { origin: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const orderBy: Record<string, 'asc' | 'desc'> = {};
      const sortField = (sort as string).startsWith('-')
        ? (sort as string).slice(1)
        : (sort as string);
      const sortOrder = (sort as string).startsWith('-') ? 'desc' : 'asc';
      orderBy[sortField] = sortOrder;

      const [coffees, total] = await Promise.all([
        prisma.coffee.findMany({
          where,
          orderBy,
          skip,
          take: limitNum,
          select: {
            id: true,
            name: true,
            origin: true,
            roastLevel: true,
            tastingNotes: true,
            imageUrl: true,
            _count: { select: { reviews: true } },
          },
        }),
        prisma.coffee.count({ where }),
      ]);

      // Calculate average ratings
      const coffeeIds = coffees.map((c) => c.id);
      const ratings = await prisma.review.groupBy({
        by: ['coffeeId'],
        where: { coffeeId: { in: coffeeIds } },
        _avg: { rating: true },
      });

      const ratingsMap = new Map(ratings.map((r) => [r.coffeeId, r._avg.rating]));

      const coffeesWithRating = coffees.map((c) => ({
        ...c,
        averageRating: ratingsMap.get(c.id) || null,
        reviewCount: c._count.reviews,
      }));

      // Filter by minRating if specified
      let filtered = coffeesWithRating;
      if (minRating) {
        const minRatingNum = parseFloat(minRating as string);
        filtered = coffeesWithRating.filter(
          (c) => c.averageRating && c.averageRating >= minRatingNum
        );
      }

      res.json({
        status: 'success',
        data: filtered,
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const coffee = await prisma.coffee.findUnique({
        where: { id: req.params.id },
        include: {
          _count: { select: { reviews: true } },
        },
      });

      if (!coffee) {
        throw new AppError(404, 'Coffee not found');
      }

      // Get average rating
      const avgRating = await prisma.review.aggregate({
        where: { coffeeId: coffee.id },
        _avg: { rating: true },
      });

      // Check if user has favorited
      let isFavorite = false;
      if (req.user) {
        const favorite = await prisma.favorite.findUnique({
          where: {
            userId_coffeeId: {
              userId: req.user.id,
              coffeeId: coffee.id,
            },
          },
        });
        isFavorite = !!favorite;
      }

      res.json({
        status: 'success',
        data: {
          ...coffee,
          averageRating: avgRating._avg.rating,
          reviewCount: coffee._count.reviews,
          isFavorite,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const coffee = await prisma.coffee.create({
        data: req.body,
      });

      // Auto-add to passport when user creates a coffee
      if (req.user) {
        await passportService.addToPassport(req.user.id, coffee.id, 'CREATED');
      }

      res.status(201).json({
        status: 'success',
        data: coffee,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const coffee = await prisma.coffee.update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json({
        status: 'success',
        data: coffee,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.coffee.delete({
        where: { id: req.params.id },
      });

      res.json({
        status: 'success',
        message: 'Coffee deleted',
      });
    } catch (error) {
      next(error);
    }
  },

  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await prisma.review.findMany({
        where: { coffeeId: req.params.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
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

  async addFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.favorite.create({
        data: {
          userId: req.user!.id,
          coffeeId: req.params.id,
        },
      });

      res.status(201).json({
        status: 'success',
        message: 'Added to favorites',
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        res.json({
          status: 'success',
          message: 'Already in favorites',
        });
        return;
      }
      next(error);
    }
  },

  async removeFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      await prisma.favorite.delete({
        where: {
          userId_coffeeId: {
            userId: req.user!.id,
            coffeeId: req.params.id,
          },
        },
      });

      res.json({
        status: 'success',
        message: 'Removed from favorites',
      });
    } catch (error) {
      next(error);
    }
  },
};
