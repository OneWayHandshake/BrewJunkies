import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AIProvider } from '@prisma/client';
import { apiKeyService } from '../services/api-key.service.js';
import { freeTierService } from '../services/free-tier.service.js';
import { getProviderInfo } from '../services/ai-providers/index.js';
import { AppError } from '../middleware/error.middleware.js';

const providerSchema = z.enum(['OPENAI', 'CLAUDE', 'GEMINI']);
const apiKeySchema = z.object({
  apiKey: z.string().min(20, 'API key is too short'),
});
const preferredSchema = z.object({
  provider: z.enum(['OPENAI', 'CLAUDE', 'GEMINI', 'HOUSE_BLEND']),
});

export const apiKeyController = {
  /**
   * GET /api/keys - List user's API key configuration
   */
  async listKeys(req: Request, res: Response, next: NextFunction) {
    try {
      const keysInfo = await apiKeyService.getUserApiKeys(req.user!.id);
      const providers = getProviderInfo();

      res.json({
        status: 'success',
        data: {
          ...keysInfo,
          providers,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/keys/:provider - Add or update an API key
   */
  async saveKey(req: Request, res: Response, next: NextFunction) {
    try {
      const provider = providerSchema.parse(req.params.provider) as AIProvider;
      const { apiKey } = apiKeySchema.parse(req.body);

      await apiKeyService.saveApiKey(req.user!.id, provider, apiKey);

      res.json({
        status: 'success',
        message: `${provider} API key saved successfully`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Invalid provider or API key'));
      }
      next(error);
    }
  },

  /**
   * DELETE /api/keys/:provider - Remove an API key
   */
  async deleteKey(req: Request, res: Response, next: NextFunction) {
    try {
      const provider = providerSchema.parse(req.params.provider) as AIProvider;

      await apiKeyService.deleteApiKey(req.user!.id, provider);

      res.json({
        status: 'success',
        message: `${provider} API key removed`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Invalid provider'));
      }
      next(error);
    }
  },

  /**
   * POST /api/keys/:provider/test - Test an API key
   */
  async testKey(req: Request, res: Response, next: NextFunction) {
    try {
      const provider = providerSchema.parse(req.params.provider) as AIProvider;

      const result = await apiKeyService.testApiKey(req.user!.id, provider);

      res.json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Invalid provider'));
      }
      next(error);
    }
  },

  /**
   * PATCH /api/keys/preferred - Set preferred provider
   */
  async setPreferred(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider } = preferredSchema.parse(req.body);

      await apiKeyService.setPreferredProvider(req.user!.id, provider);

      res.json({
        status: 'success',
        message: `Preferred provider set to ${provider}`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Invalid provider'));
      }
      next(error);
    }
  },

  /**
   * GET /api/keys/usage - Get free tier usage info
   */
  async getUsage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const ip = req.ip || req.socket.remoteAddress;

      const usage = await freeTierService.getUsageForUser(userId, ip);

      res.json({
        status: 'success',
        data: usage,
      });
    } catch (error) {
      next(error);
    }
  },
};
