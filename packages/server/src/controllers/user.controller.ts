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
              brewLogs: true,
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
          brewCount: user._count.brewLogs,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfileStats(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      // Get counts
      const [counts, topOrigins, recentBrews] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: {
            _count: {
              select: {
                reviews: true,
                favorites: true,
                analyses: true,
                brewLogs: true,
                brewRecipes: true,
              },
            },
          },
        }),
        // Get top 5 origins from brew logs
        prisma.brewLog.groupBy({
          by: ['coffeeId'],
          where: {
            userId,
            coffeeId: { not: null },
          },
          _count: { coffeeId: true },
          orderBy: { _count: { coffeeId: 'desc' } },
          take: 10,
        }).then(async (results) => {
          if (results.length === 0) return [];
          const coffeeIds = results.map((r) => r.coffeeId).filter(Boolean) as string[];
          const coffees = await prisma.coffee.findMany({
            where: { id: { in: coffeeIds } },
            select: { id: true, origin: true },
          });
          // Group by origin and count
          const originCounts: Record<string, number> = {};
          for (const result of results) {
            const coffee = coffees.find((c) => c.id === result.coffeeId);
            if (coffee) {
              originCounts[coffee.origin] = (originCounts[coffee.origin] || 0) + result._count.coffeeId;
            }
          }
          return Object.entries(originCounts)
            .map(([origin, count]) => ({ origin, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        }),
        // Get last 5 brews
        prisma.brewLog.findMany({
          where: { userId },
          orderBy: { brewedAt: 'desc' },
          take: 5,
          select: {
            id: true,
            brewMethod: true,
            rating: true,
            brewedAt: true,
            coffee: {
              select: { id: true, name: true, origin: true },
            },
          },
        }),
      ]);

      // Count unique coffees tried
      const uniqueCoffees = await prisma.brewLog.findMany({
        where: { userId, coffeeId: { not: null } },
        distinct: ['coffeeId'],
        select: { coffeeId: true },
      });

      res.json({
        status: 'success',
        data: {
          counts: {
            reviews: counts?._count.reviews || 0,
            favorites: counts?._count.favorites || 0,
            analyses: counts?._count.analyses || 0,
            brews: counts?._count.brewLogs || 0,
            recipes: counts?._count.brewRecipes || 0,
            uniqueCoffees: uniqueCoffees.length,
          },
          topOrigins,
          recentBrews,
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
