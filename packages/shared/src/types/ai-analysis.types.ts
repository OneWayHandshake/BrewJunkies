import { RoastLevel } from '../constants/index.js';
import { BrewParameters } from './coffee.types.js';

// AI Provider types
export type AIProviderType = 'OPENAI' | 'CLAUDE' | 'GEMINI' | 'HOUSE_BLEND';

export interface AIProviderInfo {
  name: AIProviderType;
  displayName: string;
  model: string;
  requiresKey: boolean;
}

export interface UserApiKeyInfo {
  provider: AIProviderType;
  isConfigured: boolean;
  isValid: boolean;
  maskedKey?: string;
  lastUsedAt?: Date;
}

export interface UserAISettings {
  keys: UserApiKeyInfo[];
  preferredProvider: AIProviderType;
}

export interface FreeTierUsage {
  used: number;
  limit: number;
  remaining: number;
  resetsAt: Date;
}

export interface AIAnalysisResult {
  imageUrl: string;
  identified: boolean;
  confidence: number;
  brandName: string | null;
  coffeeName: string | null;
  beanType: string | null;
  possibleOrigin: string | null;
  roastLevel: RoastLevel | null;
  roastLevelConfidence: number;
  observations: string[];
  tastingNotes: string[];
  flavorProfile: string | null;
  weight: string | null;
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
  provider: AIProviderType;
  createdAt: Date;
}

export interface AnalyzeImageRequest {
  imageId: string;
  provider?: AIProviderType;
}

export interface AnalyzeImageResponse {
  analysis: AIAnalysisResult;
  savedId?: string;
  imageId: string;
  provider: AIProviderType;
  providerDisplayName: string;
}

export interface ProvidersInfoResponse {
  providers: AIProviderInfo[];
  userConfig: UserAISettings | null;
  freeTierUsage: FreeTierUsage;
}
