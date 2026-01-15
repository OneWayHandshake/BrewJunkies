import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database.js';
import { aiAnalysisService } from '../services/ai-analysis.service.js';
import { AppError } from '../middleware/error.middleware.js';

const analyzeSchema = z.object({
  imageId: z.string(),
});

export const analyzeController = {
  async analyze(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageId } = analyzeSchema.parse(req.body);

      // Fetch image from database
      const image = await prisma.image.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        throw new AppError(404, 'Image not found');
      }

      // Convert to base64 data URL for OpenAI
      const base64 = Buffer.from(image.data).toString('base64');
      const dataUrl = `data:${image.mimeType};base64,${base64}`;

      const analysis = await aiAnalysisService.analyzeImage(dataUrl);

      // Save to database if user is authenticated
      let savedId: string | undefined;
      if (req.user) {
        const saved = await prisma.beanAnalysis.create({
          data: {
            imageId,
            identifiedBean: analysis.beanType,
            confidence: analysis.confidence,
            roastLevel: analysis.roastLevel,
            suggestedParams: analysis.brewParameters,
            observations: analysis.observations,
            userId: req.user.id,
          },
        });
        savedId = saved.id;
      }

      res.json({
        status: 'success',
        data: {
          analysis,
          savedId,
          imageId,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Invalid image ID'));
      }
      next(error);
    }
  },

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const analyses = await prisma.beanAnalysis.findMany({
        where: { userId: req.user!.id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      res.json({
        status: 'success',
        data: analyses,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const analysis = await prisma.beanAnalysis.findUnique({
        where: { id: req.params.id },
      });

      if (!analysis) {
        throw new AppError(404, 'Analysis not found');
      }

      if (analysis.userId !== req.user!.id) {
        throw new AppError(403, 'Not authorized to view this analysis');
      }

      res.json({
        status: 'success',
        data: analysis,
      });
    } catch (error) {
      next(error);
    }
  },
};
