export const RoastLevel = {
  LIGHT: 'LIGHT',
  MEDIUM_LIGHT: 'MEDIUM_LIGHT',
  MEDIUM: 'MEDIUM',
  MEDIUM_DARK: 'MEDIUM_DARK',
  DARK: 'DARK',
} as const;

export type RoastLevel = (typeof RoastLevel)[keyof typeof RoastLevel];

export const ROAST_LEVEL_LABELS: Record<RoastLevel, string> = {
  LIGHT: 'Light',
  MEDIUM_LIGHT: 'Medium-Light',
  MEDIUM: 'Medium',
  MEDIUM_DARK: 'Medium-Dark',
  DARK: 'Dark',
};

export const ProcessMethod = {
  WASHED: 'WASHED',
  NATURAL: 'NATURAL',
  HONEY: 'HONEY',
  ANAEROBIC: 'ANAEROBIC',
  WET_HULLED: 'WET_HULLED',
  OTHER: 'OTHER',
} as const;

export type ProcessMethod = (typeof ProcessMethod)[keyof typeof ProcessMethod];

export const PROCESS_METHOD_LABELS: Record<ProcessMethod, string> = {
  WASHED: 'Washed',
  NATURAL: 'Natural',
  HONEY: 'Honey',
  ANAEROBIC: 'Anaerobic',
  WET_HULLED: 'Wet Hulled',
  OTHER: 'Other',
};

export const BrewMethod = {
  ESPRESSO: 'ESPRESSO',
  POUR_OVER: 'POUR_OVER',
  FRENCH_PRESS: 'FRENCH_PRESS',
  AEROPRESS: 'AEROPRESS',
  COLD_BREW: 'COLD_BREW',
  DRIP: 'DRIP',
  MOKA_POT: 'MOKA_POT',
  SIPHON: 'SIPHON',
  OTHER: 'OTHER',
} as const;

export type BrewMethod = (typeof BrewMethod)[keyof typeof BrewMethod];

export const BREW_METHOD_LABELS: Record<BrewMethod, string> = {
  ESPRESSO: 'Espresso',
  POUR_OVER: 'Pour Over',
  FRENCH_PRESS: 'French Press',
  AEROPRESS: 'AeroPress',
  COLD_BREW: 'Cold Brew',
  DRIP: 'Drip',
  MOKA_POT: 'Moka Pot',
  SIPHON: 'Siphon',
  OTHER: 'Other',
};

export const ContentCategory = {
  ORIGINS: 'ORIGINS',
  ROASTING: 'ROASTING',
  BREWING: 'BREWING',
  EQUIPMENT: 'EQUIPMENT',
  HISTORY: 'HISTORY',
  CULTURE: 'CULTURE',
} as const;

export type ContentCategory =
  (typeof ContentCategory)[keyof typeof ContentCategory];

export const CONTENT_CATEGORY_LABELS: Record<ContentCategory, string> = {
  ORIGINS: 'Origins',
  ROASTING: 'Roasting',
  BREWING: 'Brewing',
  EQUIPMENT: 'Equipment',
  HISTORY: 'History',
  CULTURE: 'Culture',
};

export const COMMON_TASTING_NOTES = [
  'Chocolate',
  'Caramel',
  'Nutty',
  'Fruity',
  'Berry',
  'Citrus',
  'Floral',
  'Honey',
  'Vanilla',
  'Spicy',
  'Earthy',
  'Smoky',
  'Wine',
  'Stone Fruit',
  'Tropical',
  'Bright',
  'Clean',
  'Complex',
  'Balanced',
  'Sweet',
] as const;

export const COFFEE_ORIGINS = [
  'Ethiopia',
  'Colombia',
  'Brazil',
  'Kenya',
  'Guatemala',
  'Costa Rica',
  'Panama',
  'Indonesia',
  'Vietnam',
  'Honduras',
  'Peru',
  'Mexico',
  'Rwanda',
  'Burundi',
  'Yemen',
  'Jamaica',
  'Hawaii',
  'India',
  'Nicaragua',
  'El Salvador',
] as const;
