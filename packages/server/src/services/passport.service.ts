import { prisma } from '../config/database.js';
import { ACHIEVEMENTS, type AchievementDefinition } from '@coffee/shared';
import type { CoffeeSource } from '@prisma/client';

interface PassportStats {
  totalCoffees: number;
  totalOrigins: number;
  totalRoasters: number;
  totalRoastLevels: number;
  totalTastingNotes: number;
  totalReviews: number;
  totalAnalyses: number;
  origins: string[];
  roasters: string[];
  roastLevels: string[];
  tastingNotes: string[];
  processes: string[];
  originCounts: Record<string, number>;
  roastLevelCounts: Record<string, number>;
  processCounts: Record<string, number>;
}

export const passportService = {
  async getPassportStats(userId: string): Promise<PassportStats> {
    const [userCoffees, reviews, analyses, achievements] = await Promise.all([
      prisma.userCoffee.findMany({
        where: { userId },
        include: { coffee: true },
      }),
      prisma.review.findMany({
        where: { userId },
        include: { coffee: true },
      }),
      prisma.beanAnalysis.count({ where: { userId } }),
      prisma.userAchievement.findMany({ where: { userId } }),
    ]);

    // Track unique values and counts
    const origins = new Set<string>();
    const roasters = new Set<string>();
    const roastLevels = new Set<string>();
    const tastingNotes = new Set<string>();
    const processes = new Set<string>();
    const originCounts: Record<string, number> = {};
    const roastLevelCounts: Record<string, number> = {};
    const processCounts: Record<string, number> = {};

    // Process coffees from UserCoffee
    const allCoffeeIds = new Set<string>();

    userCoffees.forEach((uc) => {
      allCoffeeIds.add(uc.coffeeId);

      // Origins
      origins.add(uc.coffee.origin);
      originCounts[uc.coffee.origin] = (originCounts[uc.coffee.origin] || 0) + 1;

      // Roasters
      if (uc.coffee.roaster) {
        roasters.add(uc.coffee.roaster);
      }

      // Roast levels
      roastLevels.add(uc.coffee.roastLevel);
      roastLevelCounts[uc.coffee.roastLevel] = (roastLevelCounts[uc.coffee.roastLevel] || 0) + 1;

      // Tasting notes
      uc.coffee.tastingNotes.forEach((n) => tastingNotes.add(n));

      // Processes
      processes.add(uc.coffee.process);
      processCounts[uc.coffee.process] = (processCounts[uc.coffee.process] || 0) + 1;
    });

    // Also include coffees from reviews (if not already counted)
    reviews.forEach((r) => {
      if (!allCoffeeIds.has(r.coffeeId)) {
        allCoffeeIds.add(r.coffeeId);

        origins.add(r.coffee.origin);
        originCounts[r.coffee.origin] = (originCounts[r.coffee.origin] || 0) + 1;

        if (r.coffee.roaster) {
          roasters.add(r.coffee.roaster);
        }

        roastLevels.add(r.coffee.roastLevel);
        roastLevelCounts[r.coffee.roastLevel] = (roastLevelCounts[r.coffee.roastLevel] || 0) + 1;

        r.coffee.tastingNotes.forEach((n) => tastingNotes.add(n));

        processes.add(r.coffee.process);
        processCounts[r.coffee.process] = (processCounts[r.coffee.process] || 0) + 1;
      }

      // Also add tasting notes from reviews
      r.tastingNotes.forEach((n) => tastingNotes.add(n));
    });

    return {
      totalCoffees: allCoffeeIds.size,
      totalOrigins: origins.size,
      totalRoasters: roasters.size,
      totalRoastLevels: roastLevels.size,
      totalTastingNotes: tastingNotes.size,
      totalReviews: reviews.length,
      totalAnalyses: analyses,
      origins: Array.from(origins),
      roasters: Array.from(roasters),
      roastLevels: Array.from(roastLevels),
      tastingNotes: Array.from(tastingNotes),
      processes: Array.from(processes),
      originCounts,
      roastLevelCounts,
      processCounts,
    };
  },

  async getUnlockedAchievements(userId: string) {
    return prisma.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: 'desc' },
    });
  },

  async checkAndUnlockAchievements(userId: string): Promise<AchievementDefinition[]> {
    const stats = await this.getPassportStats(userId);
    const existingAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementKey: true },
    });

    const unlockedKeys = new Set(existingAchievements.map((a) => a.achievementKey));
    const newlyUnlocked: AchievementDefinition[] = [];

    for (const achievement of ACHIEVEMENTS) {
      if (unlockedKeys.has(achievement.key)) continue;

      const isUnlocked = this.checkRequirement(achievement, stats);

      if (isUnlocked) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementKey: achievement.key,
            progressSnapshot: this.getProgressSnapshot(achievement, stats),
          },
        });
        newlyUnlocked.push(achievement);
      }
    }

    return newlyUnlocked;
  },

  checkRequirement(achievement: AchievementDefinition, stats: PassportStats): boolean {
    const req = achievement.requirement;

    switch (req.type) {
      case 'coffee_count':
        return stats.totalCoffees >= req.count;

      case 'origin_count':
        return stats.totalOrigins >= req.count;

      case 'specific_origin':
        return (stats.originCounts[req.origin] || 0) >= req.count;

      case 'roaster_count':
        return stats.totalRoasters >= req.count;

      case 'roast_level_all':
        return stats.totalRoastLevels >= 5;

      case 'roast_level_count':
        return (stats.roastLevelCounts[req.level] || 0) >= req.count;

      case 'tasting_notes_count':
        return stats.totalTastingNotes >= req.count;

      case 'review_count':
        return stats.totalReviews >= req.count;

      case 'analysis_count':
        return stats.totalAnalyses >= req.count;

      case 'process_count':
        return (stats.processCounts[req.process] || 0) >= req.count;

      default:
        return false;
    }
  },

  calculateProgress(achievement: AchievementDefinition, stats: PassportStats): { current: number; target: number } {
    const req = achievement.requirement;

    switch (req.type) {
      case 'coffee_count':
        return { current: stats.totalCoffees, target: req.count };

      case 'origin_count':
        return { current: stats.totalOrigins, target: req.count };

      case 'specific_origin':
        return { current: stats.originCounts[req.origin] || 0, target: req.count };

      case 'roaster_count':
        return { current: stats.totalRoasters, target: req.count };

      case 'roast_level_all':
        return { current: stats.totalRoastLevels, target: 5 };

      case 'roast_level_count':
        return { current: stats.roastLevelCounts[req.level] || 0, target: req.count };

      case 'tasting_notes_count':
        return { current: stats.totalTastingNotes, target: req.count };

      case 'review_count':
        return { current: stats.totalReviews, target: req.count };

      case 'analysis_count':
        return { current: stats.totalAnalyses, target: req.count };

      case 'process_count':
        return { current: stats.processCounts[req.process] || 0, target: req.count };

      default:
        return { current: 0, target: 1 };
    }
  },

  getProgressSnapshot(achievement: AchievementDefinition, stats: PassportStats): Record<string, unknown> {
    return {
      totalCoffees: stats.totalCoffees,
      totalOrigins: stats.totalOrigins,
      origins: stats.origins.slice(0, 10),
      timestamp: new Date().toISOString(),
    };
  },

  async addToPassport(userId: string, coffeeId: string, source: CoffeeSource = 'MANUAL') {
    // Check if already exists
    const existing = await prisma.userCoffee.findUnique({
      where: { userId_coffeeId: { userId, coffeeId } },
    });

    if (existing) {
      return existing;
    }

    // Create the entry
    const userCoffee = await prisma.userCoffee.create({
      data: { userId, coffeeId, source },
      include: { coffee: true },
    });

    // Check for new achievements
    await this.checkAndUnlockAchievements(userId);

    return userCoffee;
  },

  async removeFromPassport(userId: string, coffeeId: string) {
    return prisma.userCoffee.delete({
      where: { userId_coffeeId: { userId, coffeeId } },
    });
  },

  async getTriedCoffees(userId: string) {
    const [userCoffees, reviews] = await Promise.all([
      prisma.userCoffee.findMany({
        where: { userId },
        include: { coffee: true },
        orderBy: { triedAt: 'desc' },
      }),
      prisma.review.findMany({
        where: { userId },
        include: { coffee: true },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Merge and deduplicate
    const coffeeMap = new Map<string, {
      id: string;
      name: string;
      origin: string;
      roastLevel: string;
      roaster: string | null;
      imageUrl: string | null;
      triedAt: Date;
      source: string;
      hasReview: boolean;
      rating?: number;
    }>();

    userCoffees.forEach((uc) => {
      coffeeMap.set(uc.coffeeId, {
        id: uc.coffee.id,
        name: uc.coffee.name,
        origin: uc.coffee.origin,
        roastLevel: uc.coffee.roastLevel,
        roaster: uc.coffee.roaster,
        imageUrl: uc.coffee.imageUrl,
        triedAt: uc.triedAt,
        source: uc.source,
        hasReview: false,
      });
    });

    reviews.forEach((r) => {
      if (coffeeMap.has(r.coffeeId)) {
        const existing = coffeeMap.get(r.coffeeId)!;
        existing.hasReview = true;
        existing.rating = r.rating;
      } else {
        coffeeMap.set(r.coffeeId, {
          id: r.coffee.id,
          name: r.coffee.name,
          origin: r.coffee.origin,
          roastLevel: r.coffee.roastLevel,
          roaster: r.coffee.roaster,
          imageUrl: r.coffee.imageUrl,
          triedAt: r.createdAt,
          source: 'REVIEW',
          hasReview: true,
          rating: r.rating,
        });
      }
    });

    return Array.from(coffeeMap.values()).sort(
      (a, b) => b.triedAt.getTime() - a.triedAt.getTime()
    );
  },

  async getAchievementsWithProgress(userId: string) {
    const [stats, unlockedAchievements] = await Promise.all([
      this.getPassportStats(userId),
      prisma.userAchievement.findMany({ where: { userId } }),
    ]);

    const unlockedMap = new Map(
      unlockedAchievements.map((a) => [a.achievementKey, a])
    );

    return ACHIEVEMENTS.map((def) => {
      const unlocked = unlockedMap.get(def.key);
      return {
        ...def,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt,
        progress: this.calculateProgress(def, stats),
      };
    });
  },
};
