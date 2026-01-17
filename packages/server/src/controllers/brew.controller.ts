import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import { passportService } from '../services/passport.service.js';
import type { BrewMethod } from '@coffee/shared';

export const brewController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        brewMethod,
        coffeeId,
        minRating,
        startDate,
        endDate,
        page = '1',
        limit = '20',
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = Math.min(parseInt(limit as string), 100);
      const skip = (pageNum - 1) * limitNum;

      const where: Record<string, unknown> = {
        userId: req.user!.id,
      };

      if (brewMethod) {
        where.brewMethod = brewMethod as BrewMethod;
      }

      if (coffeeId) {
        where.coffeeId = coffeeId as string;
      }

      if (minRating) {
        where.rating = { gte: parseInt(minRating as string) };
      }

      if (startDate || endDate) {
        where.brewedAt = {};
        if (startDate) {
          (where.brewedAt as Record<string, Date>).gte = new Date(startDate as string);
        }
        if (endDate) {
          (where.brewedAt as Record<string, Date>).lte = new Date(endDate as string);
        }
      }

      const [brews, total] = await Promise.all([
        prisma.brewLog.findMany({
          where,
          orderBy: { brewedAt: 'desc' },
          skip,
          take: limitNum,
          include: {
            coffee: {
              select: {
                id: true,
                name: true,
                origin: true,
                roastLevel: true,
                imageUrl: true,
              },
            },
            recipe: {
              select: {
                id: true,
                name: true,
                brewMethod: true,
              },
            },
          },
        }),
        prisma.brewLog.count({ where }),
      ]);

      res.json({
        status: 'success',
        data: brews,
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
      const brew = await prisma.brewLog.findUnique({
        where: { id: req.params.id },
        include: {
          coffee: {
            select: {
              id: true,
              name: true,
              origin: true,
              roastLevel: true,
              imageUrl: true,
              roaster: true,
            },
          },
          recipe: {
            select: {
              id: true,
              name: true,
              brewMethod: true,
            },
          },
        },
      });

      if (!brew) {
        throw new AppError(404, 'Brew log not found');
      }

      if (brew.userId !== req.user?.id) {
        throw new AppError(403, 'You do not have access to this brew log');
      }

      res.json({
        status: 'success',
        data: brew,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        brewMethod,
        coffeeAmount,
        waterAmount,
        grindSize,
        waterTemp,
        brewTime,
        rating,
        tastingNotes,
        notes,
        imageUrl,
        coffeeId,
        recipeId,
        brewedAt,
      } = req.body;

      const brew = await prisma.brewLog.create({
        data: {
          brewMethod,
          coffeeAmount,
          waterAmount,
          grindSize,
          waterTemp,
          brewTime,
          rating,
          tastingNotes: tastingNotes || [],
          notes,
          imageUrl,
          coffeeId,
          recipeId,
          brewedAt: brewedAt ? new Date(brewedAt) : new Date(),
          userId: req.user!.id,
        },
        include: {
          coffee: {
            select: {
              id: true,
              name: true,
              origin: true,
              roastLevel: true,
              imageUrl: true,
            },
          },
          recipe: {
            select: {
              id: true,
              name: true,
              brewMethod: true,
            },
          },
        },
      });

      // Auto-add coffee to passport if specified
      if (coffeeId) {
        await passportService.addToPassport(req.user!.id, coffeeId, 'BREW_LOG');
      }

      res.status(201).json({
        status: 'success',
        data: brew,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      // Check ownership
      const existing = await prisma.brewLog.findUnique({
        where: { id: req.params.id },
      });

      if (!existing) {
        throw new AppError(404, 'Brew log not found');
      }

      if (existing.userId !== req.user?.id) {
        throw new AppError(403, 'You can only edit your own brew logs');
      }

      const brew = await prisma.brewLog.update({
        where: { id: req.params.id },
        data: req.body,
        include: {
          coffee: {
            select: {
              id: true,
              name: true,
              origin: true,
              roastLevel: true,
              imageUrl: true,
            },
          },
          recipe: {
            select: {
              id: true,
              name: true,
              brewMethod: true,
            },
          },
        },
      });

      // Add new coffee to passport if changed
      if (req.body.coffeeId && req.body.coffeeId !== existing.coffeeId) {
        await passportService.addToPassport(req.user!.id, req.body.coffeeId, 'BREW_LOG');
      }

      res.json({
        status: 'success',
        data: brew,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // Check ownership
      const existing = await prisma.brewLog.findUnique({
        where: { id: req.params.id },
      });

      if (!existing) {
        throw new AppError(404, 'Brew log not found');
      }

      if (existing.userId !== req.user?.id) {
        throw new AppError(403, 'You can only delete your own brew logs');
      }

      await prisma.brewLog.delete({
        where: { id: req.params.id },
      });

      res.json({
        status: 'success',
        message: 'Brew log deleted',
      });
    } catch (error) {
      next(error);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { range = 'all' } = req.query;

      // Calculate date range
      let startDate: Date | undefined;
      const now = new Date();

      switch (range) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = undefined;
      }

      const dateFilter = startDate
        ? { brewedAt: { gte: startDate } }
        : {};

      // Get all brew logs for this user within date range
      const brews = await prisma.brewLog.findMany({
        where: {
          userId: req.user!.id,
          ...dateFilter,
        },
        include: {
          coffee: {
            select: {
              id: true,
              name: true,
              origin: true,
              roastLevel: true,
              imageUrl: true,
            },
          },
          recipe: {
            select: {
              id: true,
              name: true,
              brewMethod: true,
            },
          },
        },
        orderBy: { brewedAt: 'desc' },
      });

      // Calculate statistics
      const totalBrews = brews.length;

      // Unique coffees tried
      const uniqueCoffeeIds = new Set(brews.filter(b => b.coffeeId).map(b => b.coffeeId));
      const totalCoffeesTried = uniqueCoffeeIds.size;

      // Unique origins
      const uniqueOrigins = new Set(
        brews.filter(b => b.coffee).map(b => b.coffee!.origin)
      );

      // Average rating
      const ratedBrews = brews.filter(b => b.rating !== null);
      const averageRating = ratedBrews.length > 0
        ? ratedBrews.reduce((sum, b) => sum + b.rating!, 0) / ratedBrews.length
        : null;

      // Total brew time
      const totalBrewTime = brews.reduce((sum, b) => sum + (b.brewTime || 0), 0);

      // Brews by method
      const methodCounts: Record<string, number> = {};
      brews.forEach(b => {
        methodCounts[b.brewMethod] = (methodCounts[b.brewMethod] || 0) + 1;
      });
      const brewsByMethod = Object.entries(methodCounts)
        .map(([method, count]) => ({
          method: method as BrewMethod,
          count,
          percentage: totalBrews > 0 ? Math.round((count / totalBrews) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);

      // Brews by month (last 12 months)
      const monthCounts: Record<string, number> = {};
      brews.forEach(b => {
        const month = b.brewedAt.toISOString().slice(0, 7); // YYYY-MM
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      });
      const brewsByMonth = Object.entries(monthCounts)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-12);

      // Origin distribution
      const originCounts: Record<string, number> = {};
      brews.filter(b => b.coffee).forEach(b => {
        const origin = b.coffee!.origin;
        originCounts[origin] = (originCounts[origin] || 0) + 1;
      });
      const originDistribution = Object.entries(originCounts)
        .map(([origin, count]) => ({
          origin,
          count,
          percentage: totalBrews > 0 ? Math.round((count / totalBrews) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Roast level distribution
      const roastCounts: Record<string, number> = {};
      brews.filter(b => b.coffee).forEach(b => {
        const level = b.coffee!.roastLevel;
        roastCounts[level] = (roastCounts[level] || 0) + 1;
      });
      const roastLevelDistribution = Object.entries(roastCounts)
        .map(([level, count]) => ({
          level,
          count,
          percentage: totalBrews > 0 ? Math.round((count / totalBrews) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count);

      // Top tasting notes
      const noteCounts: Record<string, number> = {};
      brews.forEach(b => {
        b.tastingNotes.forEach(note => {
          noteCounts[note] = (noteCounts[note] || 0) + 1;
        });
      });
      const topTastingNotes = Object.entries(noteCounts)
        .map(([note, count]) => ({ note, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Recent brews (top 5)
      const recentBrews = brews.slice(0, 5).map(b => ({
        id: b.id,
        brewMethod: b.brewMethod,
        coffeeAmount: b.coffeeAmount,
        waterAmount: b.waterAmount,
        rating: b.rating,
        tastingNotes: b.tastingNotes,
        coffee: b.coffee,
        recipe: b.recipe,
        brewedAt: b.brewedAt,
      }));

      res.json({
        status: 'success',
        data: {
          totalBrews,
          totalCoffeesTried,
          uniqueOrigins: uniqueOrigins.size,
          averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
          totalBrewTime,
          brewsByMethod,
          brewsByMonth,
          originDistribution,
          roastLevelDistribution,
          topTastingNotes,
          recentBrews,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
