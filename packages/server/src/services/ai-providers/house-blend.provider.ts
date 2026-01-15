import type { AIAnalysisResult } from '@coffee/shared';
import { AppError } from '../../middleware/error.middleware.js';
import type { AIProviderInterface, ProviderConfig } from './base-provider.js';
import { openaiProvider } from './openai.provider.js';
import { claudeProvider } from './claude.provider.js';
import { geminiProvider } from './gemini.provider.js';

type FreeTierBackend = 'OPENAI' | 'CLAUDE' | 'GEMINI';

/**
 * House Blend is the free tier provider that uses the app's own API key.
 * It delegates to whichever provider is configured via FREE_TIER_PROVIDER env var.
 */
export class HouseBlendProvider implements AIProviderInterface {
  readonly name = 'HOUSE_BLEND';
  readonly displayName = 'House Blend (Free)';

  get model(): string {
    return this.getBackendProvider().model;
  }

  private getBackendProvider(): AIProviderInterface {
    const backend = (process.env.FREE_TIER_PROVIDER || 'OPENAI') as FreeTierBackend;

    switch (backend) {
      case 'CLAUDE':
        return claudeProvider;
      case 'GEMINI':
        return geminiProvider;
      case 'OPENAI':
      default:
        return openaiProvider;
    }
  }

  private getBackendApiKey(): string {
    const backend = (process.env.FREE_TIER_PROVIDER || 'OPENAI') as FreeTierBackend;

    let key: string | undefined;

    switch (backend) {
      case 'CLAUDE':
        key = process.env.ANTHROPIC_API_KEY;
        break;
      case 'GEMINI':
        key = process.env.GOOGLE_AI_API_KEY;
        break;
      case 'OPENAI':
      default:
        key = process.env.OPENAI_API_KEY;
        break;
    }

    if (!key) {
      throw new AppError(
        500,
        'House Blend is not configured. Please contact the administrator.'
      );
    }

    return key;
  }

  validateKeyFormat(): boolean {
    // House Blend doesn't require user API keys
    return true;
  }

  async testConnection(): Promise<boolean> {
    try {
      const provider = this.getBackendProvider();
      const apiKey = this.getBackendApiKey();
      return await provider.testConnection({ apiKey });
    } catch {
      return false;
    }
  }

  async analyzeImage(
    imageDataUrl: string,
    _config: ProviderConfig
  ): Promise<AIAnalysisResult> {
    // House Blend ignores the provided config and uses the app's own key
    const provider = this.getBackendProvider();
    const apiKey = this.getBackendApiKey();

    return provider.analyzeImage(imageDataUrl, { apiKey });
  }
}

export const houseBlendProvider = new HouseBlendProvider();
