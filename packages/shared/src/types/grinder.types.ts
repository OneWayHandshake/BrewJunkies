import { BrewMethod, RoastLevel } from '../constants/index.js';

// ==================== GRINDER ====================

export interface Grinder {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  burrType: string | null;
  stepsPerTurn: number | null;
  notes: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrinderListItem {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  burrType: string | null;
  settingsCount: number;
}

export interface CreateGrinderData {
  name: string;
  brand?: string;
  model?: string;
  burrType?: string;
  stepsPerTurn?: number;
  notes?: string;
}

export interface UpdateGrinderData {
  name?: string;
  brand?: string;
  model?: string;
  burrType?: string;
  stepsPerTurn?: number;
  notes?: string;
}

// ==================== GRIND SETTING ====================

export interface GrindSetting {
  id: string;
  setting: string;
  brewMethod: BrewMethod;
  notes: string | null;
  rating: number | null;
  isDialedIn: boolean;
  userId: string;
  grinderId: string;
  grinder?: GrinderListItem;
  coffeeId: string | null;
  coffee?: GrindSettingCoffee | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GrindSettingCoffee {
  id: string;
  name: string;
  origin: string;
  roastLevel: RoastLevel;
}

export interface GrindSettingListItem {
  id: string;
  setting: string;
  brewMethod: BrewMethod;
  notes: string | null;
  rating: number | null;
  isDialedIn: boolean;
  grinder: {
    id: string;
    name: string;
  };
  coffee?: {
    id: string;
    name: string;
    origin: string;
    roastLevel: RoastLevel;
  } | null;
  createdAt: Date;
}

export interface CreateGrindSettingData {
  setting: string;
  brewMethod: BrewMethod;
  grinderId: string;
  coffeeId?: string;
  notes?: string;
  rating?: number;
  isDialedIn?: boolean;
}

export interface UpdateGrindSettingData {
  setting?: string;
  brewMethod?: BrewMethod;
  notes?: string;
  rating?: number;
  isDialedIn?: boolean;
  coffeeId?: string;
}

// ==================== GRIND SUGGESTION ====================

export interface GrindSuggestion {
  setting: string;
  brewMethod: BrewMethod;
  confidence: 'high' | 'medium' | 'low';
  basedOn: string; // Description of what the suggestion is based on
  grinder: {
    id: string;
    name: string;
  };
  sourceCoffee?: {
    id: string;
    name: string;
    origin: string;
    roastLevel: RoastLevel;
  };
}
