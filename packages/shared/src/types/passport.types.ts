import type { AchievementDefinition } from '../constants/achievements.js';

export const CoffeeSource = {
  MANUAL: 'MANUAL',
  REVIEW: 'REVIEW',
  ANALYSIS: 'ANALYSIS',
  CREATED: 'CREATED',
} as const;

export type CoffeeSource = (typeof CoffeeSource)[keyof typeof CoffeeSource];

export interface PassportStats {
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
}

export interface TriedCoffee {
  id: string;
  name: string;
  origin: string;
  roastLevel: string;
  roaster: string | null;
  imageUrl: string | null;
  triedAt: Date;
  source: CoffeeSource;
  hasReview: boolean;
  rating?: number;
}

export interface UserAchievementData {
  id: string;
  achievementKey: string;
  unlockedAt: Date;
  progressSnapshot?: Record<string, unknown>;
}

export interface AchievementProgress {
  current: number;
  target: number;
}

export interface UserAchievement extends AchievementDefinition {
  unlocked: boolean;
  unlockedAt?: Date;
  progress: AchievementProgress;
}

export interface PassportResponse {
  stats: PassportStats;
  unlockedAchievements: UserAchievementData[];
  allAchievements: AchievementDefinition[];
}

export interface AddToPassportRequest {
  coffeeId: string;
}

export interface AddToPassportResponse {
  id: string;
  userId: string;
  coffeeId: string;
  source: CoffeeSource;
  triedAt: Date;
}
