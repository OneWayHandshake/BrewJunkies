import OpenAI from 'openai';
import type { AIAnalysisResult } from '@coffee/shared';
import { AppError } from '../../middleware/error.middleware.js';
import {
  type AIProviderInterface,
  type ProviderConfig,
  ANALYSIS_PROMPT,
  transformAnalysis,
  parseAIResponse,
} from './base-provider.js';

export class OpenAIProvider implements AIProviderInterface {
  readonly name = 'OPENAI';
  readonly displayName = 'OpenAI GPT-4o';
  readonly model = 'gpt-4o';

  validateKeyFormat(key: string): boolean {
    // OpenAI keys start with 'sk-' and are typically 51+ chars
    return key.startsWith('sk-') && key.length >= 40;
  }

  async testConnection(config: ProviderConfig): Promise<boolean> {
    try {
      const client = new OpenAI({ apiKey: config.apiKey });

      // Make a minimal API call to test the key
      await client.models.list();
      return true;
    } catch {
      return false;
    }
  }

  async analyzeImage(
    imageDataUrl: string,
    config: ProviderConfig
  ): Promise<AIAnalysisResult> {
    const client = new OpenAI({ apiKey: config.apiKey });

    try {
      const response = await client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: ANALYSIS_PROMPT },
              { type: 'image_url', image_url: { url: imageDataUrl, detail: 'high' } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new AppError(500, 'No analysis returned from OpenAI');
      }

      const raw = parseAIResponse(content);

      if (!raw.identified) {
        throw new AppError(
          400,
          'Could not identify a coffee bag in the image. Please upload a clear photo of a coffee bag or package.'
        );
      }

      return transformAnalysis(raw, imageDataUrl);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof SyntaxError) {
        throw new AppError(500, 'Failed to parse OpenAI response');
      }
      if (error instanceof OpenAI.APIError) {
        if (error.status === 401) {
          throw new AppError(401, 'Invalid OpenAI API key');
        }
        if (error.status === 429) {
          throw new AppError(429, 'OpenAI rate limit exceeded. Please try again later.');
        }
      }
      throw new AppError(500, 'Failed to analyze image with OpenAI');
    }
  }
}

export const openaiProvider = new OpenAIProvider();
