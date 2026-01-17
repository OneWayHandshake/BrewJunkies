import { BrewMethod, RoastLevel } from '../constants/index.js';

// ==================== BREW STEP ====================

export interface BrewStep {
  id: string;
  order: number;
  type: 'bloom' | 'pour' | 'wait' | 'stir' | 'press' | 'finish';
  instruction: string;
  duration: number; // seconds
  pourAmount?: number; // ml
  targetWeight?: number; // grams (cumulative)
}

// ==================== BREW RECIPE ====================

export interface BrewRecipe {
  id: string;
  name: string;
  description: string | null;
  brewMethod: BrewMethod;
  isDefault: boolean;
  isPublic: boolean;
  coffeeAmount: number; // grams
  waterAmount: number; // ml
  ratio: string; // e.g., "1:15"
  waterTemp: number | null; // Celsius
  grindSize: string | null;
  steps: BrewStep[];
  totalTime: number; // seconds
  author: string | null;
  source: string | null;
  clonedFromId: string | null;
  userId: string | null;
  user?: { id: string; name: string } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrewRecipeListItem {
  id: string;
  name: string;
  description: string | null;
  brewMethod: BrewMethod;
  isDefault: boolean;
  isPublic: boolean;
  coffeeAmount: number;
  waterAmount: number;
  ratio: string;
  totalTime: number;
  author: string | null;
  user?: { id: string; name: string } | null;
}

export interface CreateBrewRecipeData {
  name: string;
  description?: string;
  brewMethod: BrewMethod;
  coffeeAmount: number;
  waterAmount: number;
  ratio: string;
  waterTemp?: number;
  grindSize?: string;
  steps: Omit<BrewStep, 'id'>[];
  totalTime: number;
  author?: string;
  source?: string;
  isPublic?: boolean;
}

export interface UpdateBrewRecipeData {
  name?: string;
  description?: string;
  coffeeAmount?: number;
  waterAmount?: number;
  ratio?: string;
  waterTemp?: number;
  grindSize?: string;
  steps?: Omit<BrewStep, 'id'>[];
  totalTime?: number;
  isPublic?: boolean;
}

// ==================== BREW LOG ====================

export interface BrewLog {
  id: string;
  brewMethod: BrewMethod;
  coffeeAmount: number; // grams
  waterAmount: number; // ml (or yield for espresso)
  grindSize: string | null;
  waterTemp: number | null; // Celsius
  brewTime: number | null; // actual time in seconds
  rating: number | null; // 1-5
  tastingNotes: string[];
  notes: string | null;
  imageUrl: string | null;
  userId: string;
  coffeeId: string | null;
  coffee?: BrewLogCoffee | null;
  recipeId: string | null;
  recipe?: BrewLogRecipe | null;
  brewedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrewLogCoffee {
  id: string;
  name: string;
  origin: string;
  roastLevel: RoastLevel;
  imageUrl: string | null;
}

export interface BrewLogRecipe {
  id: string;
  name: string;
  brewMethod: BrewMethod;
}

export interface BrewLogListItem {
  id: string;
  brewMethod: BrewMethod;
  coffeeAmount: number;
  waterAmount: number;
  rating: number | null;
  tastingNotes: string[];
  coffee?: BrewLogCoffee | null;
  recipe?: BrewLogRecipe | null;
  brewedAt: Date;
}

// Full detail view for editing
export interface BrewLogDetail {
  id: string;
  brewMethod: BrewMethod;
  coffeeAmount: number;
  waterAmount: number;
  grindSize: string | null;
  waterTemp: number | null;
  brewTime: number | null;
  rating: number | null;
  tastingNotes: string[];
  notes: string | null;
  imageUrl: string | null;
  coffee?: BrewLogCoffee | null;
  recipe?: BrewLogRecipe | null;
  brewedAt: Date;
}

export interface CreateBrewLogData {
  brewMethod: BrewMethod;
  coffeeAmount: number;
  waterAmount: number;
  grindSize?: string;
  waterTemp?: number;
  brewTime?: number;
  rating?: number;
  tastingNotes?: string[];
  notes?: string;
  imageUrl?: string;
  coffeeId?: string;
  recipeId?: string;
  brewedAt?: Date;
}

export interface UpdateBrewLogData {
  brewMethod?: BrewMethod;
  coffeeAmount?: number;
  waterAmount?: number;
  grindSize?: string;
  waterTemp?: number;
  brewTime?: number;
  rating?: number;
  tastingNotes?: string[];
  notes?: string;
  imageUrl?: string;
  coffeeId?: string;
  recipeId?: string;
}

export interface BrewLogFilters {
  brewMethod?: BrewMethod;
  coffeeId?: string;
  minRating?: number;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

// ==================== BREW STATISTICS ====================

export interface BrewStats {
  totalBrews: number;
  totalCoffeesTried: number;
  uniqueOrigins: number;
  averageRating: number | null;
  totalBrewTime: number; // seconds
  brewsByMethod: BrewMethodCount[];
  brewsByMonth: MonthlyBrewCount[];
  originDistribution: OriginCount[];
  roastLevelDistribution: RoastLevelCount[];
  topTastingNotes: TastingNoteCount[];
  recentBrews: BrewLogListItem[];
}

export interface BrewMethodCount {
  method: BrewMethod;
  count: number;
  percentage: number;
}

export interface MonthlyBrewCount {
  month: string; // YYYY-MM format
  count: number;
}

export interface OriginCount {
  origin: string;
  count: number;
  percentage: number;
}

export interface RoastLevelCount {
  level: RoastLevel;
  count: number;
  percentage: number;
}

export interface TastingNoteCount {
  note: string;
  count: number;
}

export interface StatsDateRange {
  range: 'week' | 'month' | 'year' | 'all';
  startDate?: Date;
  endDate?: Date;
}

// ==================== TIMER STATE ====================

export interface ActiveBrew {
  recipeId: string;
  recipeName: string;
  steps: BrewStep[];
  currentStepIndex: number;
  timeRemaining: number; // seconds
  totalElapsed: number; // seconds
  isRunning: boolean;
  isPaused: boolean;
  scale: number; // multiplier for recipe scaling
}
