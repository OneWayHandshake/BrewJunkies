import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/error.middleware.js';

const prisma = new PrismaClient();

// Rate limits for free tier
const ANONYMOUS_DAILY_LIMIT = 3;
const AUTHENTICATED_DAILY_LIMIT = 10;

function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

function getToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export interface UsageInfo {
  used: number;
  limit: number;
  remaining: number;
  resetsAt: Date;
}

export const freeTierService = {
  /**
   * Check if the user/IP can use free tier
   */
  async checkUsage(userId?: string, ip?: string): Promise<UsageInfo> {
    const today = getToday();
    const limit = userId ? AUTHENTICATED_DAILY_LIMIT : ANONYMOUS_DAILY_LIMIT;

    let usage;

    if (userId) {
      usage = await prisma.freeAnalysisUsage.findUnique({
        where: { userId_date: { userId, date: today } },
      });
    } else if (ip) {
      const ipHash = hashIp(ip);
      usage = await prisma.freeAnalysisUsage.findUnique({
        where: { ipHash_date: { ipHash, date: today } },
      });
    } else {
      throw new AppError(400, 'Either userId or IP is required');
    }

    const used = usage?.count ?? 0;

    // Calculate reset time (midnight UTC next day)
    const resetsAt = new Date(today);
    resetsAt.setDate(resetsAt.getDate() + 1);

    return {
      used,
      limit,
      remaining: Math.max(0, limit - used),
      resetsAt,
    };
  },

  /**
   * Record a free tier analysis usage
   */
  async recordUsage(userId?: string, ip?: string): Promise<void> {
    const today = getToday();
    const limit = userId ? AUTHENTICATED_DAILY_LIMIT : ANONYMOUS_DAILY_LIMIT;

    // Check current usage
    const usageInfo = await this.checkUsage(userId, ip);

    if (usageInfo.remaining <= 0) {
      throw new AppError(
        429,
        `You've reached your daily limit of ${limit} free analyses. ` +
        `Your limit resets at ${usageInfo.resetsAt.toISOString()}. ` +
        `Add your own API key to unlock unlimited analyses.`
      );
    }

    // Record the usage
    if (userId) {
      await prisma.freeAnalysisUsage.upsert({
        where: { userId_date: { userId, date: today } },
        update: { count: { increment: 1 } },
        create: { userId, date: today, count: 1 },
      });
    } else if (ip) {
      const ipHash = hashIp(ip);
      await prisma.freeAnalysisUsage.upsert({
        where: { ipHash_date: { ipHash, date: today } },
        update: { count: { increment: 1 } },
        create: { ipHash, date: today, count: 1 },
      });
    }
  },

  /**
   * Get usage info for display
   */
  async getUsageForUser(userId?: string, ip?: string): Promise<UsageInfo> {
    return this.checkUsage(userId, ip);
  },

  /**
   * Cleanup old usage records (run periodically)
   */
  async cleanupOldRecords(daysToKeep = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.freeAnalysisUsage.deleteMany({
      where: { date: { lt: cutoffDate } },
    });

    return result.count;
  },
};
