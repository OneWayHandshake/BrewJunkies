import { RoastLevel } from '../constants/index.js';
import { BrewParameters } from './coffee.types.js';

export interface AIAnalysisResult {
  imageUrl: string;
  identified: boolean;
  confidence: number;
  beanType: string | null;
  possibleOrigin: string | null;
  roastLevel: RoastLevel | null;
  roastLevelConfidence: number;
  observations: string[];
  suggestedBrewMethods: string[];
  brewParameters: Partial<BrewParameters>;
  tastingNotesLikely: string[];
  warnings: string[];
  analyzedAt: Date;
}

export interface BeanAnalysis {
  id: string;
  imageUrl: string;
  identifiedBean: string | null;
  confidence: number | null;
  roastLevel: RoastLevel | null;
  suggestedParams: Partial<BrewParameters>;
  observations: string[];
  userId: string | null;
  coffeeId: string | null;
  createdAt: Date;
}

export interface AnalyzeImageRequest {
  imageUrl: string;
}

export interface AnalyzeImageResponse {
  analysis: AIAnalysisResult;
  savedId?: string;
}
