import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AIProvider } from '@prisma/client';
import { prisma } from '../config/database.js';
import { getProvider, requiresUserKey, getProviderInfo } from '../services/ai-providers/index.js';
import { apiKeyService } from '../services/api-key.service.js';
import { freeTierService } from '../services/free-tier.service.js';
import { AppError } from '../middleware/error.middleware.js';

const analyzeSchema = z.object({
  imageId: z.string(),
  provider: z.enum(['OPENAI', 'CLAUDE', 'GEMINI', 'HOUSE_BLEND']).optional(),
});

export const analyzeController = {
  /**
   * POST /api/analyze - Analyze coffee beans image
   */
  async analyze(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageId, provider: requestedProvider } = analyzeSchema.parse(req.body);

      // Determine which provider to use
      let providerName: AIProvider = 'HOUSE_BLEND';

      if (requestedProvider) {
        providerName = requestedProvider;
      } else if (req.user) {
        // Use user's preferred provider
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (user) {
          providerName = user.preferredProvider;
        }
      }

      // Fetch image from database
      const image = await prisma.image.findUnique({
        where: { id: imageId },
      });

      if (!image) {
        throw new AppError(404, 'Image not found');
      }

      // Convert to base64 data URL
      const base64 = Buffer.from(image.data).toString('base64');
      const dataUrl = `data:${image.mimeType};base64,${base64}`;

      // Get the provider instance
      const provider = getProvider(providerName);

      // Get the API key for the provider
      let apiKey: string | null = null;

      if (requiresUserKey(providerName)) {
        // User must have their own key
        if (!req.user) {
          throw new AppError(
            401,
            'You need to sign in and add an API key to use this provider'
          );
        }

        apiKey = await apiKeyService.getDecryptedKey(req.user.id, providerName);
        if (!apiKey) {
          throw new AppError(
            400,
            `You need to configure a ${providerName} API key in your profile settings`
          );
        }
      } else {
        // Using House Blend - check rate limits
        const userId = req.user?.id;
        const ip = req.ip || req.socket.remoteAddress;

        // Check and record usage (throws if limit exceeded)
        await freeTierService.recordUsage(userId, ip);
      }

      // Perform the analysis
      const analysis = await provider.analyzeImage(dataUrl, { apiKey: apiKey || '' });

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
            provider: providerName,
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
          provider: providerName,
          providerDisplayName: provider.displayName,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Invalid request body'));
      }
      next(error);
    }
  },

  /**
   * GET /api/analyze - Get analysis history
   */
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

  /**
   * GET /api/analyze/:id - Get a specific analysis
   */
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

  /**
   * GET /api/analyze/providers - Get available providers info
   */
  async getProviders(req: Request, res: Response, next: NextFunction) {
    try {
      const providers = getProviderInfo();

      // If user is authenticated, include their configuration
      let userConfig = null;
      if (req.user) {
        userConfig = await apiKeyService.getUserApiKeys(req.user.id);
      }

      // Get free tier usage
      const userId = req.user?.id;
      const ip = req.ip || req.socket.remoteAddress;
      const freeTierUsage = await freeTierService.getUsageForUser(userId, ip);

      res.json({
        status: 'success',
        data: {
          providers,
          userConfig,
          freeTierUsage,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
