import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service.js';
import { AppError } from '../middleware/error.middleware.js';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = registerSchema.parse(req.body);
      const result = await authService.register(data);

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        status: 'success',
        data: {
          user: result.user,
          tokens: {
            accessToken: result.tokens.accessToken,
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Validation failed'));
      }
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = loginSchema.parse(req.body);
      const result = await authService.login(data);

      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 'success',
        data: {
          user: result.user,
          tokens: {
            accessToken: result.tokens.accessToken,
          },
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new AppError(400, 'Validation failed'));
      }
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new AppError(401, 'No refresh token provided');
      }

      const result = await authService.refreshTokens(refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 'success',
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      res.clearCookie('refreshToken');
      res.json({
        status: 'success',
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, 'Authentication failed');
      }

      const tokens = authService.generateTokens(req.user.id);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // Redirect to frontend with access token
      const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      res.redirect(`${clientUrl}/auth/callback?token=${tokens.accessToken}`);
    } catch (error) {
      next(error);
    }
  },
};
