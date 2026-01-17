import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import type { BrewMethod, RoastLevel } from '@coffee/shared';

export const grinderController = {
  // ==================== GRINDER CRUD ====================

  async getAllGrinders(req: Request, res: Response, next: NextFunction) {
    try {
      const grinders = await prisma.grinder.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { grindSettings: true },
          },
        },
      });

      const formatted = grinders.map((g) => ({
        id: g.id,
        name: g.name,
        brand: g.brand,
        model: g.model,
        burrType: g.burrType,
        settingsCount: g._count.grindSettings,
      }));

      res.json({
        status: 'success',
        data: formatted,
      });
    } catch (error) {
      next(error);
    }
  },

  async getGrinderById(req: Request, res: Response, next: NextFunction) {
    try {
      const grinder = await prisma.grinder.findUnique({
        where: { id: req.params.id },
        include: {
          grindSettings: {
            orderBy: { createdAt: 'desc' },
            include: {
              coffee: {
                select: {
                  id: true,
                  name: true,
                  origin: true,
                  roastLevel: true,
                },
              },
            },
          },
        },
      });

      if (!grinder) {
        throw new AppError(404, 'Grinder not found');
      }

      if (grinder.userId !== req.user?.id) {
        throw new AppError(403, 'You do not have access to this grinder');
      }

      res.json({
        status: 'success',
        data: grinder,
      });
    } catch (error) {
      next(error);
    }
  },

  async createGrinder(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, brand, model, burrType, stepsPerTurn, notes } = req.body;

      const grinder = await prisma.grinder.create({
        data: {
          name,
          brand,
          model,
          burrType,
          stepsPerTurn,
          notes,
          userId: req.user!.id,
        },
      });

      res.status(201).json({
        status: 'success',
        data: grinder,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateGrinder(req: Request, res: Response, next: NextFunction) {
    try {
      const existing = await prisma.grinder.findUnique({
        where: { id: req.params.id },
      });

      if (!existing) {
        throw new AppError(404, 'Grinder not found');
      }

      if (existing.userId !== req.user?.id) {
        throw new AppError(403, 'You can only edit your own grinders');
      }

      const grinder = await prisma.grinder.update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json({
        status: 'success',
        data: grinder,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteGrinder(req: Request, res: Response, next: NextFunction) {
    try {
      const existing = await prisma.grinder.findUnique({
        where: { id: req.params.id },
      });

      if (!existing) {
        throw new AppError(404, 'Grinder not found');
      }

      if (existing.userId !== req.user?.id) {
        throw new AppError(403, 'You can only delete your own grinders');
      }

      await prisma.grinder.delete({
        where: { id: req.params.id },
      });

      res.json({
        status: 'success',
        message: 'Grinder deleted',
      });
    } catch (error) {
      next(error);
    }
  },

  // ==================== GRIND SETTINGS CRUD ====================

  async getAllSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const { grinderId, coffeeId, brewMethod } = req.query;

      const where: Record<string, unknown> = {
        userId: req.user!.id,
      };

      if (grinderId) where.grinderId = grinderId as string;
      if (coffeeId) where.coffeeId = coffeeId as string;
      if (brewMethod) where.brewMethod = brewMethod as BrewMethod;

      const settings = await prisma.grindSetting.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          grinder: {
            select: { id: true, name: true },
          },
          coffee: {
            select: {
              id: true,
              name: true,
              origin: true,
              roastLevel: true,
            },
          },
        },
      });

      res.json({
        status: 'success',
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  },

  async createSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const { setting, brewMethod, grinderId, coffeeId, notes, rating, isDialedIn } = req.body;

      // Verify grinder ownership
      const grinder = await prisma.grinder.findUnique({
        where: { id: grinderId },
      });

      if (!grinder || grinder.userId !== req.user!.id) {
        throw new AppError(404, 'Grinder not found');
      }

      // If marking as dialed in, unmark other settings for same combo
      if (isDialedIn) {
        await prisma.grindSetting.updateMany({
          where: {
            userId: req.user!.id,
            grinderId,
            coffeeId: coffeeId || null,
            brewMethod,
            isDialedIn: true,
          },
          data: { isDialedIn: false },
        });
      }

      const grindSetting = await prisma.grindSetting.create({
        data: {
          setting,
          brewMethod,
          notes,
          rating,
          isDialedIn: isDialedIn || false,
          userId: req.user!.id,
          grinderId,
          coffeeId,
        },
        include: {
          grinder: {
            select: { id: true, name: true },
          },
          coffee: {
            select: {
              id: true,
              name: true,
              origin: true,
              roastLevel: true,
            },
          },
        },
      });

      res.status(201).json({
        status: 'success',
        data: grindSetting,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const existing = await prisma.grindSetting.findUnique({
        where: { id: req.params.id },
      });

      if (!existing) {
        throw new AppError(404, 'Grind setting not found');
      }

      if (existing.userId !== req.user?.id) {
        throw new AppError(403, 'You can only edit your own grind settings');
      }

      // If marking as dialed in, unmark others
      if (req.body.isDialedIn) {
        await prisma.grindSetting.updateMany({
          where: {
            userId: req.user!.id,
            grinderId: existing.grinderId,
            coffeeId: existing.coffeeId,
            brewMethod: existing.brewMethod,
            isDialedIn: true,
            id: { not: req.params.id },
          },
          data: { isDialedIn: false },
        });
      }

      const grindSetting = await prisma.grindSetting.update({
        where: { id: req.params.id },
        data: req.body,
        include: {
          grinder: {
            select: { id: true, name: true },
          },
          coffee: {
            select: {
              id: true,
              name: true,
              origin: true,
              roastLevel: true,
            },
          },
        },
      });

      res.json({
        status: 'success',
        data: grindSetting,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteSetting(req: Request, res: Response, next: NextFunction) {
    try {
      const existing = await prisma.grindSetting.findUnique({
        where: { id: req.params.id },
      });

      if (!existing) {
        throw new AppError(404, 'Grind setting not found');
      }

      if (existing.userId !== req.user?.id) {
        throw new AppError(403, 'You can only delete your own grind settings');
      }

      await prisma.grindSetting.delete({
        where: { id: req.params.id },
      });

      res.json({
        status: 'success',
        message: 'Grind setting deleted',
      });
    } catch (error) {
      next(error);
    }
  },

  // ==================== GRIND SUGGESTIONS ====================

  async getSuggestions(req: Request, res: Response, next: NextFunction) {
    try {
      const { coffeeId, brewMethod, grinderId } = req.query;

      if (!brewMethod) {
        throw new AppError(400, 'Brew method is required');
      }

      const suggestions: Array<{
        setting: string;
        brewMethod: BrewMethod;
        confidence: 'high' | 'medium' | 'low';
        basedOn: string;
        grinder: { id: string; name: string };
        sourceCoffee?: { id: string; name: string; origin: string; roastLevel: RoastLevel };
      }> = [];

      // Get the target coffee info if provided
      let targetCoffee: { roastLevel: RoastLevel; origin: string } | null = null;
      if (coffeeId) {
        const coffee = await prisma.coffee.findUnique({
          where: { id: coffeeId as string },
          select: { roastLevel: true, origin: true },
        });
        targetCoffee = coffee;
      }

      // Build query for finding similar settings
      const where: Record<string, unknown> = {
        userId: req.user!.id,
        brewMethod: brewMethod as BrewMethod,
        isDialedIn: true,
      };

      if (grinderId) {
        where.grinderId = grinderId as string;
      }

      // 1. Exact match - same coffee, same grinder
      if (coffeeId) {
        const exactMatch = await prisma.grindSetting.findFirst({
          where: {
            ...where,
            coffeeId: coffeeId as string,
          },
          include: {
            grinder: { select: { id: true, name: true } },
            coffee: { select: { id: true, name: true, origin: true, roastLevel: true } },
          },
        });

        if (exactMatch) {
          suggestions.push({
            setting: exactMatch.setting,
            brewMethod: exactMatch.brewMethod as BrewMethod,
            confidence: 'high',
            basedOn: `Your dialed-in setting for this exact coffee`,
            grinder: exactMatch.grinder,
            sourceCoffee: exactMatch.coffee || undefined,
          });
        }
      }

      // 2. Same roast level match
      if (targetCoffee && suggestions.length === 0) {
        const roastMatch = await prisma.grindSetting.findFirst({
          where: {
            ...where,
            coffee: {
              roastLevel: targetCoffee.roastLevel,
            },
          },
          include: {
            grinder: { select: { id: true, name: true } },
            coffee: { select: { id: true, name: true, origin: true, roastLevel: true } },
          },
        });

        if (roastMatch) {
          suggestions.push({
            setting: roastMatch.setting,
            brewMethod: roastMatch.brewMethod as BrewMethod,
            confidence: 'medium',
            basedOn: `Based on similar ${targetCoffee.roastLevel.replace('_', '-').toLowerCase()} roast coffee`,
            grinder: roastMatch.grinder,
            sourceCoffee: roastMatch.coffee || undefined,
          });
        }
      }

      // 3. Any dialed-in setting for this method
      if (suggestions.length === 0) {
        const anyMatch = await prisma.grindSetting.findFirst({
          where,
          include: {
            grinder: { select: { id: true, name: true } },
            coffee: { select: { id: true, name: true, origin: true, roastLevel: true } },
          },
        });

        if (anyMatch) {
          suggestions.push({
            setting: anyMatch.setting,
            brewMethod: anyMatch.brewMethod as BrewMethod,
            confidence: 'low',
            basedOn: `Your most recent dialed-in ${brewMethod} setting`,
            grinder: anyMatch.grinder,
            sourceCoffee: anyMatch.coffee || undefined,
          });
        }
      }

      res.json({
        status: 'success',
        data: suggestions,
      });
    } catch (error) {
      next(error);
    }
  },
};
