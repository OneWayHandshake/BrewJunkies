import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { AppError } from '../middleware/error.middleware.js';
import type { User } from '@prisma/client';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResult {
  user: Omit<User, 'passwordHash'>;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

function sanitizeUser(user: User): Omit<User, 'passwordHash'> {
  const { passwordHash, ...sanitized } = user;
  return sanitized;
}

export const authService = {
  generateTokens(userId: string) {
    const accessToken = jwt.sign(
      { userId, type: 'access' },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );

    return { accessToken, refreshToken };
  },

  async register(data: RegisterData): Promise<AuthResult> {
    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new AppError(400, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash,
      },
    });

    const tokens = this.generateTokens(user.id);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: sanitizeUser(user),
      tokens,
    };
  },

  async login(data: LoginData): Promise<AuthResult> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !user.passwordHash) {
      throw new AppError(401, 'Invalid email or password');
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const tokens = this.generateTokens(user.id);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: sanitizeUser(user),
      tokens,
    };
  },

  async refreshTokens(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
        userId: string;
        type: string;
      };

      if (payload.type !== 'refresh') {
        throw new AppError(401, 'Invalid token type');
      }

      // Check if token exists in database
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new AppError(401, 'Invalid or expired refresh token');
      }

      // Delete old token
      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      // Generate new tokens
      const tokens = this.generateTokens(payload.userId);

      // Store new refresh token
      await prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: payload.userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return tokens;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(401, 'Invalid refresh token');
    }
  },

  async logout(token: string) {
    await prisma.refreshToken.deleteMany({
      where: { token },
    });
  },
};
