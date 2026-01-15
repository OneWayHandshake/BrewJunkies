import { RoastLevel, ProcessMethod, BrewMethod } from '../constants/index.js';

export interface Coffee {
  id: string;
  name: string;
  description: string | null;
  origin: string;
  region: string | null;
  farm: string | null;
  altitude: string | null;
  process: ProcessMethod;
  roastLevel: RoastLevel;
  roaster: string | null;
  roastDate: Date | null;
  variety: string | null;
  brewParams: BrewParameters;
  tastingNotes: string[];
  acidity: number | null;
  body: number | null;
  sweetness: number | null;
  imageUrl: string | null;
  averageRating: number | null;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoffeeListItem {
  id: string;
  name: string;
  origin: string;
  roastLevel: RoastLevel;
  tastingNotes: string[];
  imageUrl: string | null;
  averageRating: number | null;
  reviewCount: number;
}

export interface BrewParameters {
  espresso?: EspressoParams;
  pourOver?: PourOverParams;
  frenchPress?: FrenchPressParams;
  aeropress?: AeropressParams;
  coldBrew?: ColdBrewParams;
  drip?: DripParams;
}

export interface EspressoParams {
  dose: number;
  yield: number;
  ratio: string;
  temperature: number;
  pullTime: {
    min: number;
    max: number;
  };
  pressure: number;
  grindSize: string;
}

export interface PourOverParams {
  dose: number;
  waterAmount: number;
  ratio: string;
  temperature: number;
  totalTime: {
    min: number;
    max: number;
  };
  grindSize: string;
  bloomTime: number;
  bloomWater: number;
}

export interface FrenchPressParams {
  dose: number;
  waterAmount: number;
  ratio: string;
  temperature: number;
  steepTime: {
    min: number;
    max: number;
  };
  grindSize: string;
}

export interface AeropressParams {
  dose: number;
  waterAmount: number;
  ratio: string;
  temperature: number;
  brewTime: {
    min: number;
    max: number;
  };
  grindSize: string;
  method: 'standard' | 'inverted';
}

export interface ColdBrewParams {
  dose: number;
  waterAmount: number;
  ratio: string;
  steepTime: {
    min: number;
    max: number;
  };
  grindSize: string;
}

export interface DripParams {
  dose: number;
  waterAmount: number;
  ratio: string;
  grindSize: string;
}

export interface CoffeeFilters {
  origin?: string[];
  roastLevel?: RoastLevel[];
  brewMethod?: BrewMethod;
  minRating?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CreateCoffeeData {
  name: string;
  description?: string;
  origin: string;
  region?: string;
  farm?: string;
  altitude?: string;
  process: ProcessMethod;
  roastLevel: RoastLevel;
  roaster?: string;
  roastDate?: Date;
  variety?: string;
  brewParams?: BrewParameters;
  tastingNotes?: string[];
  acidity?: number;
  body?: number;
  sweetness?: number;
  imageUrl?: string;
}
