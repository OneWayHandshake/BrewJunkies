import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import type { BrewMethod } from '@coffee/shared';

export const recipeController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { brewMethod, defaultOnly, page = '1', limit = '50' } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = Math.min(parseInt(limit as string), 100);
      const skip = (pageNum - 1) * limitNum;

      const where: Record<string, unknown> = {};

      if (brewMethod) {
        where.brewMethod = brewMethod as BrewMethod;
      }

      if (defaultOnly === 'true') {
        where.isDefault = true;
      } else if (req.user) {
        // Show default recipes + user's custom recipes + public recipes
        where.OR = [{ isDefault: true }, { userId: req.user.id }, { isPublic: true }];
      } else {
        // Non-authenticated: show only default and public recipes
        where.OR = [{ isDefault: true }, { isPublic: true }];
      }

      const [recipes, total] = await Promise.all([
        prisma.brewRecipe.findMany({
          where,
          orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
          skip,
          take: limitNum,
          select: {
            id: true,
            name: true,
            description: true,
            brewMethod: true,
            isDefault: true,
            isPublic: true,
            coffeeAmount: true,
            waterAmount: true,
            ratio: true,
            waterTemp: true,
            grindSize: true,
            steps: true,
            totalTime: true,
            author: true,
            source: true,
            userId: true,
            user: {
              select: { id: true, name: true },
            },
            createdAt: true,
          },
        }),
        prisma.brewRecipe.count({ where }),
      ]);

      res.json({
        status: 'success',
        data: recipes,
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
      const recipe = await prisma.brewRecipe.findUnique({
        where: { id: req.params.id },
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      });

      if (!recipe) {
        throw new AppError(404, 'Recipe not found');
      }

      // Check if user can access this recipe
      const canAccess = recipe.isDefault || recipe.isPublic || recipe.userId === req.user?.id;
      if (!canAccess) {
        throw new AppError(403, 'You do not have access to this recipe');
      }

      res.json({
        status: 'success',
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        description,
        brewMethod,
        coffeeAmount,
        waterAmount,
        ratio,
        waterTemp,
        grindSize,
        steps,
        totalTime,
        author,
        source,
        isPublic,
      } = req.body;

      const recipe = await prisma.brewRecipe.create({
        data: {
          name,
          description,
          brewMethod,
          coffeeAmount,
          waterAmount,
          ratio,
          waterTemp,
          grindSize,
          steps: steps || [],
          totalTime,
          author,
          source,
          isDefault: false,
          isPublic: isPublic || false,
          userId: req.user!.id,
        },
      });

      res.status(201).json({
        status: 'success',
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      // Check ownership
      const existing = await prisma.brewRecipe.findUnique({
        where: { id: req.params.id },
      });

      if (!existing) {
        throw new AppError(404, 'Recipe not found');
      }

      if (existing.isDefault || existing.userId !== req.user?.id) {
        throw new AppError(403, 'You can only edit your own recipes');
      }

      const recipe = await prisma.brewRecipe.update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json({
        status: 'success',
        data: recipe,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      // Check ownership
      const existing = await prisma.brewRecipe.findUnique({
        where: { id: req.params.id },
      });

      if (!existing) {
        throw new AppError(404, 'Recipe not found');
      }

      if (existing.isDefault || existing.userId !== req.user?.id) {
        throw new AppError(403, 'You can only delete your own recipes');
      }

      await prisma.brewRecipe.delete({
        where: { id: req.params.id },
      });

      res.json({
        status: 'success',
        message: 'Recipe deleted',
      });
    } catch (error) {
      next(error);
    }
  },

  // Get community (public) recipes only
  async getCommunity(req: Request, res: Response, next: NextFunction) {
    try {
      const { brewMethod, page = '1', limit = '20' } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = Math.min(parseInt(limit as string), 100);
      const skip = (pageNum - 1) * limitNum;

      const where: Record<string, unknown> = {
        isPublic: true,
        isDefault: false, // Exclude default recipes from community
      };

      if (brewMethod) {
        where.brewMethod = brewMethod as BrewMethod;
      }

      const [recipes, total] = await Promise.all([
        prisma.brewRecipe.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: limitNum,
          select: {
            id: true,
            name: true,
            description: true,
            brewMethod: true,
            isDefault: true,
            isPublic: true,
            coffeeAmount: true,
            waterAmount: true,
            ratio: true,
            totalTime: true,
            author: true,
            user: {
              select: { id: true, name: true },
            },
            createdAt: true,
          },
        }),
        prisma.brewRecipe.count({ where }),
      ]);

      res.json({
        status: 'success',
        data: recipes,
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

  // Clone a recipe to user's collection
  async clone(req: Request, res: Response, next: NextFunction) {
    try {
      const original = await prisma.brewRecipe.findUnique({
        where: { id: req.params.id },
      });

      if (!original) {
        throw new AppError(404, 'Recipe not found');
      }

      // Can only clone public or default recipes
      if (!original.isPublic && !original.isDefault && original.userId !== req.user?.id) {
        throw new AppError(403, 'You cannot clone this recipe');
      }

      const clone = await prisma.brewRecipe.create({
        data: {
          name: `${original.name} (Copy)`,
          description: original.description,
          brewMethod: original.brewMethod,
          coffeeAmount: original.coffeeAmount,
          waterAmount: original.waterAmount,
          ratio: original.ratio,
          waterTemp: original.waterTemp,
          grindSize: original.grindSize,
          steps: original.steps as object,
          totalTime: original.totalTime,
          author: original.author,
          source: original.source,
          isDefault: false,
          isPublic: false,
          clonedFromId: original.id,
          userId: req.user!.id,
        },
      });

      res.status(201).json({
        status: 'success',
        data: clone,
      });
    } catch (error) {
      next(error);
    }
  },
};
