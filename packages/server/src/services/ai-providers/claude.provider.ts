import Anthropic from '@anthropic-ai/sdk';
import type { AIAnalysisResult } from '@coffee/shared';
import { AppError } from '../../middleware/error.middleware.js';
import {
  type AIProviderInterface,
  type ProviderConfig,
  ANALYSIS_PROMPT,
  transformAnalysis,
  parseAIResponse,
} from './base-provider.js';

export class ClaudeProvider implements AIProviderInterface {
  readonly name = 'CLAUDE';
  readonly displayName = 'Claude Sonnet 4';
  readonly model = 'claude-sonnet-4-20250514';

  validateKeyFormat(key: string): boolean {
    // Anthropic keys start with 'sk-ant-' and are quite long
    return key.startsWith('sk-ant-') && key.length >= 90;
  }

  async testConnection(config: ProviderConfig): Promise<boolean> {
    try {
      const client = new Anthropic({ apiKey: config.apiKey });

      // Make a minimal API call to test the key
      await client.messages.create({
        model: this.model,
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      });
      return true;
    } catch {
      return false;
    }
  }

  async analyzeImage(
    imageDataUrl: string,
    config: ProviderConfig
  ): Promise<AIAnalysisResult> {
    const client = new Anthropic({ apiKey: config.apiKey });

    // Extract base64 data and media type from data URL
    const match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      throw new AppError(400, 'Invalid image data URL format');
    }

    const mediaType = match[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
    const base64Data = match[2];

    try {
      const response = await client.messages.create({
        model: this.model,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data,
                },
              },
              {
                type: 'text',
                text: ANALYSIS_PROMPT,
              },
            ],
          },
        ],
      });

      const textBlock = response.content.find((block) => block.type === 'text');
      if (!textBlock || textBlock.type !== 'text') {
        throw new AppError(500, 'No analysis returned from Claude');
      }

      const raw = parseAIResponse(textBlock.text);

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
        throw new AppError(500, 'Failed to parse Claude response');
      }
      if (error instanceof Anthropic.APIError) {
        console.error('Claude API Error:', error.status, error.message);
        if (error.status === 401) {
          throw new AppError(401, 'Invalid Anthropic API key');
        }
        if (error.status === 429) {
          throw new AppError(429, 'Anthropic rate limit exceeded. Please try again later.');
        }
        if (error.status === 400) {
          throw new AppError(400, `Claude API error: ${error.message}`);
        }
        if (error.status === 404) {
          throw new AppError(500, `Claude model not found: ${this.model}`);
        }
      }
      console.error('Claude analysis error:', error);
      throw new AppError(500, 'Failed to analyze image with Claude');
    }
  }
}

export const claudeProvider = new ClaudeProvider();
