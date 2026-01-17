import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIAnalysisResult } from '@coffee/shared';
import { AppError } from '../../middleware/error.middleware.js';
import {
  type AIProviderInterface,
  type ProviderConfig,
  ANALYSIS_PROMPT,
  transformAnalysis,
  parseAIResponse,
} from './base-provider.js';

export class GeminiProvider implements AIProviderInterface {
  readonly name = 'GEMINI';
  readonly displayName = 'Gemini 2.5 Flash';
  readonly model = 'gemini-2.5-flash';

  validateKeyFormat(key: string): boolean {
    // Google API keys are typically 39 characters and start with 'AIza'
    return key.startsWith('AIza') && key.length >= 35;
  }

  async testConnection(config: ProviderConfig): Promise<boolean> {
    try {
      const genAI = new GoogleGenerativeAI(config.apiKey);
      const model = genAI.getGenerativeModel({ model: this.model });

      // Make a minimal API call to test the key
      await model.generateContent('Hi');
      return true;
    } catch {
      return false;
    }
  }

  async analyzeImage(
    imageDataUrl: string,
    config: ProviderConfig
  ): Promise<AIAnalysisResult> {
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({ model: this.model });

    // Extract base64 data and media type from data URL
    const match = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) {
      throw new AppError(400, 'Invalid image data URL format');
    }

    const mimeType = match[1];
    const base64Data = match[2];

    try {
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType,
            data: base64Data,
          },
        },
        { text: ANALYSIS_PROMPT },
      ]);

      const response = await result.response;
      const content = response.text();

      if (!content) {
        throw new AppError(500, 'No analysis returned from Gemini');
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
        throw new AppError(500, 'Failed to parse Gemini response');
      }
      // Log the full error for debugging
      console.error('Gemini API Error:', error);
      // Google AI errors
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('401')) {
        throw new AppError(401, 'Invalid Google AI API key');
      }
      if (errorMessage.includes('RATE_LIMIT') || errorMessage.includes('429')) {
        throw new AppError(429, 'Gemini rate limit exceeded. Please try again later.');
      }
      if (errorMessage.includes('PERMISSION_DENIED')) {
        throw new AppError(403, 'Gemini API permission denied. Please check your API key has access to Gemini 1.5 Pro.');
      }
      throw new AppError(500, `Failed to analyze image with Gemini: ${errorMessage}`);
    }
  }
}

export const geminiProvider = new GeminiProvider();
