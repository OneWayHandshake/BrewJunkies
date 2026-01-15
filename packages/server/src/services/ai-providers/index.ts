import type { AIProvider as AIProviderEnum } from '@prisma/client';
import type { AIProviderInterface } from './base-provider.js';
import { openaiProvider } from './openai.provider.js';
import { claudeProvider } from './claude.provider.js';
import { geminiProvider } from './gemini.provider.js';
import { houseBlendProvider } from './house-blend.provider.js';

export { type AIProviderInterface, type ProviderConfig } from './base-provider.js';
export { openaiProvider } from './openai.provider.js';
export { claudeProvider } from './claude.provider.js';
export { geminiProvider } from './gemini.provider.js';
export { houseBlendProvider } from './house-blend.provider.js';

/**
 * Map of all available AI providers
 */
export const providers: Record<AIProviderEnum, AIProviderInterface> = {
  OPENAI: openaiProvider,
  CLAUDE: claudeProvider,
  GEMINI: geminiProvider,
  HOUSE_BLEND: houseBlendProvider,
};

/**
 * Get a provider by its enum value
 */
export function getProvider(providerName: AIProviderEnum): AIProviderInterface {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Unknown provider: ${providerName}`);
  }
  return provider;
}

/**
 * Get display information for all providers
 */
export function getProviderInfo(): Array<{
  name: AIProviderEnum;
  displayName: string;
  model: string;
  requiresKey: boolean;
}> {
  return [
    {
      name: 'HOUSE_BLEND',
      displayName: houseBlendProvider.displayName,
      model: houseBlendProvider.model,
      requiresKey: false,
    },
    {
      name: 'OPENAI',
      displayName: openaiProvider.displayName,
      model: openaiProvider.model,
      requiresKey: true,
    },
    {
      name: 'CLAUDE',
      displayName: claudeProvider.displayName,
      model: claudeProvider.model,
      requiresKey: true,
    },
    {
      name: 'GEMINI',
      displayName: geminiProvider.displayName,
      model: geminiProvider.model,
      requiresKey: true,
    },
  ];
}

/**
 * Providers that require user API keys
 */
export const PROVIDERS_REQUIRING_KEY: AIProviderEnum[] = ['OPENAI', 'CLAUDE', 'GEMINI'];

/**
 * Check if a provider requires a user API key
 */
export function requiresUserKey(providerName: AIProviderEnum): boolean {
  return PROVIDERS_REQUIRING_KEY.includes(providerName);
}
