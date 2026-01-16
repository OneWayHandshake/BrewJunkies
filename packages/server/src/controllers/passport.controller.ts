import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { passportService } from '../services/passport.service.js';
import { ACHIEVEMENTS } from '@coffee/shared';
import { AppError } from '../middleware/error.middleware.js';

const addToPassportSchema = z.object({
  coffeeId: z.string(),
});

export const passportController = {
  // GET /api/passport - Get passport overview
  async getPassport(req: Request, res: Response, next: NextFunction) {
    try {
      const [stats, unlockedAchievements] = await Promise.all([
        passportService.getPassportStats(req.user!.id),
        passportService.getUnlockedAchievements(req.user!.id),
      ]);

      res.json({
        status: 'success',
        data: {
          stats,
          unlockedAchievements,
          allAchievements: ACHIEVEMENTS,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/passport/coffees - Get tried coffees
  async getTriedCoffees(req: Request, res: Response, next: NextFunction) {
    try {
      const coffees = await passportService.getTriedCoffees(req.user!.id);

      res.json({
        status: 'success',
        data: coffees,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/passport/coffees - Add coffee to passport
  async addCoffee(req: Request, res: Response, next: NextFunction) {
    try {
      const { coffeeId } = addToPassportSchema.parse(req.body);

      const userCoffee = await passportService.addToPassport(
        req.user!.id,
        coffeeId,
        'MANUAL'
      );

      res.status(201).json({
        status: 'success',
        data: userCoffee,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Invalid request'));
      }
      next(error);
    }
  },

  // DELETE /api/passport/coffees/:coffeeId - Remove from passport
  async removeCoffee(req: Request, res: Response, next: NextFunction) {
    try {
      await passportService.removeFromPassport(req.user!.id, req.params.coffeeId);

      res.json({
        status: 'success',
        message: 'Removed from passport',
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/passport/achievements - Get all achievements with progress
  async getAchievements(req: Request, res: Response, next: NextFunction) {
    try {
      const achievements = await passportService.getAchievementsWithProgress(req.user!.id);

      res.json({
        status: 'success',
        data: achievements,
      });
    } catch (error) {
      next(error);
    }
  },
};
