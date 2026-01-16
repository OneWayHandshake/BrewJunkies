export const AchievementCategory = {
  QUANTITY: 'QUANTITY',
  ORIGINS: 'ORIGINS',
  ROAST_LEVELS: 'ROAST_LEVELS',
  ROASTERS: 'ROASTERS',
  TASTING: 'TASTING',
  SPECIAL: 'SPECIAL',
} as const;

export type AchievementCategory = (typeof AchievementCategory)[keyof typeof AchievementCategory];

export const AchievementTier = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
} as const;

export type AchievementTier = (typeof AchievementTier)[keyof typeof AchievementTier];

export type AchievementRequirement =
  | { type: 'coffee_count'; count: number }
  | { type: 'origin_count'; count: number }
  | { type: 'specific_origin'; origin: string; count: number }
  | { type: 'roaster_count'; count: number }
  | { type: 'roast_level_all' }
  | { type: 'roast_level_count'; level: string; count: number }
  | { type: 'tasting_notes_count'; count: number }
  | { type: 'review_count'; count: number }
  | { type: 'analysis_count'; count: number }
  | { type: 'process_count'; process: string; count: number };

export interface AchievementDefinition {
  key: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  tier: AchievementTier;
  requirement: AchievementRequirement;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // ==================== QUANTITY ====================
  {
    key: 'FIRST_SIP',
    name: 'First Sip',
    description: 'Added your first coffee to the passport',
    category: 'QUANTITY',
    icon: 'Coffee',
    tier: 'bronze',
    requirement: { type: 'coffee_count', count: 1 },
  },
  {
    key: 'BEAN_COUNTER',
    name: 'Bean Counter',
    description: 'Added 10 coffees to your passport',
    category: 'QUANTITY',
    icon: 'Hash',
    tier: 'silver',
    requirement: { type: 'coffee_count', count: 10 },
  },
  {
    key: 'COFFEE_CONNOISSEUR',
    name: 'Coffee Connoisseur',
    description: 'Added 25 coffees to your passport',
    category: 'QUANTITY',
    icon: 'Award',
    tier: 'gold',
    requirement: { type: 'coffee_count', count: 25 },
  },
  {
    key: 'COFFEE_MASTER',
    name: 'Coffee Master',
    description: 'Added 50 coffees to your passport',
    category: 'QUANTITY',
    icon: 'Crown',
    tier: 'platinum',
    requirement: { type: 'coffee_count', count: 50 },
  },

  // ==================== ORIGINS ====================
  {
    key: 'EXPLORER',
    name: 'Explorer',
    description: 'Tried coffees from 5 different origins',
    category: 'ORIGINS',
    icon: 'Globe',
    tier: 'bronze',
    requirement: { type: 'origin_count', count: 5 },
  },
  {
    key: 'WORLD_TRAVELER',
    name: 'World Traveler',
    description: 'Tried coffees from 10 different origins',
    category: 'ORIGINS',
    icon: 'Map',
    tier: 'silver',
    requirement: { type: 'origin_count', count: 10 },
  },
  {
    key: 'GLOBE_TROTTER',
    name: 'Globe Trotter',
    description: 'Tried coffees from 15 different origins',
    category: 'ORIGINS',
    icon: 'Compass',
    tier: 'gold',
    requirement: { type: 'origin_count', count: 15 },
  },
  {
    key: 'ETHIOPIAN_EXPERT',
    name: 'Ethiopian Expert',
    description: 'Tried 5 coffees from Ethiopia',
    category: 'ORIGINS',
    icon: 'Star',
    tier: 'silver',
    requirement: { type: 'specific_origin', origin: 'Ethiopia', count: 5 },
  },
  {
    key: 'COLOMBIAN_CHAMPION',
    name: 'Colombian Champion',
    description: 'Tried 5 coffees from Colombia',
    category: 'ORIGINS',
    icon: 'Mountain',
    tier: 'silver',
    requirement: { type: 'specific_origin', origin: 'Colombia', count: 5 },
  },
  {
    key: 'BRAZILIAN_BUFF',
    name: 'Brazilian Buff',
    description: 'Tried 5 coffees from Brazil',
    category: 'ORIGINS',
    icon: 'Leaf',
    tier: 'silver',
    requirement: { type: 'specific_origin', origin: 'Brazil', count: 5 },
  },

  // ==================== ROAST LEVELS ====================
  {
    key: 'ROAST_MASTER',
    name: 'Roast Master',
    description: 'Tried all 5 roast levels',
    category: 'ROAST_LEVELS',
    icon: 'Flame',
    tier: 'gold',
    requirement: { type: 'roast_level_all' },
  },
  {
    key: 'LIGHT_ROAST_LOVER',
    name: 'Light Roast Lover',
    description: 'Tried 10 light roast coffees',
    category: 'ROAST_LEVELS',
    icon: 'Sun',
    tier: 'silver',
    requirement: { type: 'roast_level_count', level: 'LIGHT', count: 10 },
  },
  {
    key: 'DARK_SIDE',
    name: 'The Dark Side',
    description: 'Tried 10 dark roast coffees',
    category: 'ROAST_LEVELS',
    icon: 'Moon',
    tier: 'silver',
    requirement: { type: 'roast_level_count', level: 'DARK', count: 10 },
  },

  // ==================== TASTING ====================
  {
    key: 'FLAVOR_HUNTER',
    name: 'Flavor Hunter',
    description: 'Discovered 20 unique tasting notes',
    category: 'TASTING',
    icon: 'Sparkles',
    tier: 'silver',
    requirement: { type: 'tasting_notes_count', count: 20 },
  },
  {
    key: 'SUPER_TASTER',
    name: 'Super Taster',
    description: 'Discovered 40 unique tasting notes',
    category: 'TASTING',
    icon: 'Zap',
    tier: 'gold',
    requirement: { type: 'tasting_notes_count', count: 40 },
  },

  // ==================== ROASTERS ====================
  {
    key: 'ROASTER_SCOUT',
    name: 'Roaster Scout',
    description: 'Tried coffees from 5 different roasters',
    category: 'ROASTERS',
    icon: 'Store',
    tier: 'bronze',
    requirement: { type: 'roaster_count', count: 5 },
  },
  {
    key: 'ROASTER_HUNTER',
    name: 'Roaster Hunter',
    description: 'Tried coffees from 15 different roasters',
    category: 'ROASTERS',
    icon: 'Search',
    tier: 'silver',
    requirement: { type: 'roaster_count', count: 15 },
  },

  // ==================== SPECIAL ====================
  {
    key: 'CRITIC',
    name: 'Coffee Critic',
    description: 'Written 10 coffee reviews',
    category: 'SPECIAL',
    icon: 'PenTool',
    tier: 'silver',
    requirement: { type: 'review_count', count: 10 },
  },
  {
    key: 'AI_ENTHUSIAST',
    name: 'AI Enthusiast',
    description: 'Used AI analysis 10 times',
    category: 'SPECIAL',
    icon: 'Bot',
    tier: 'silver',
    requirement: { type: 'analysis_count', count: 10 },
  },
  {
    key: 'NATURAL_LOVER',
    name: 'Natural Lover',
    description: 'Tried 5 natural process coffees',
    category: 'SPECIAL',
    icon: 'Grape',
    tier: 'bronze',
    requirement: { type: 'process_count', process: 'NATURAL', count: 5 },
  },
];

export const ACHIEVEMENT_TIER_COLORS = {
  bronze: 'from-amber-600 to-amber-800',
  silver: 'from-slate-300 to-slate-500',
  gold: 'from-yellow-400 to-yellow-600',
  platinum: 'from-purple-400 to-purple-600',
} as const;
