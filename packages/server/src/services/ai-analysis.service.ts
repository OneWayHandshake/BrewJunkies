import OpenAI from 'openai';
import type { AIAnalysisResult, BrewParameters, RoastLevel } from '@coffee/shared';
import { AppError } from '../middleware/error.middleware.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ANALYSIS_PROMPT = `You are an expert coffee roaster and barista. Analyze this image of coffee beans and provide detailed information.

Return a JSON object with the following structure:
{
  "identified": boolean,           // Whether coffee beans are clearly visible
  "confidence": number,            // 0-1 confidence in your analysis
  "beanType": string | null,       // "Arabica", "Robusta", or "Blend" if identifiable
  "possibleOrigin": string | null, // Country/region if characteristics suggest
  "roastLevel": "LIGHT" | "MEDIUM_LIGHT" | "MEDIUM" | "MEDIUM_DARK" | "DARK",
  "roastLevelConfidence": number,  // 0-1 confidence in roast level
  "observations": string[],        // Visual observations about the beans (color, oil, uniformity, defects)
  "suggestedBrewMethods": string[],// Best brew methods for this roast (e.g., "Pour Over", "Espresso")
  "brewParameters": {
    "espresso": {
      "dose": number,              // grams in
      "yield": number,             // grams out
      "ratio": string,             // e.g., "1:2"
      "temperature": number,       // Celsius
      "pullTime": { "min": number, "max": number },  // seconds
      "pressure": number,          // bars
      "grindSize": string          // descriptive (Fine, Medium-Fine, etc.)
    },
    "pourOver": {
      "dose": number,              // grams
      "waterAmount": number,       // ml
      "ratio": string,             // e.g., "1:16"
      "temperature": number,       // Celsius
      "totalTime": { "min": number, "max": number },  // seconds
      "grindSize": string,
      "bloomTime": number,         // seconds
      "bloomWater": number         // ml
    }
  },
  "tastingNotesLikely": string[],  // Predicted flavor notes based on roast level
  "warnings": string[]             // Any quality concerns (defects, uneven roast, etc.)
}

Guidelines for roast-based recommendations:
- LIGHT: Higher temps (93-96°C), longer extractions, highlight origin characteristics
- MEDIUM_LIGHT: Balanced temps (92-94°C), good for both espresso and filter
- MEDIUM: Versatile temps (91-93°C), balanced sweetness and acidity
- MEDIUM_DARK: Lower temps (89-92°C), shorter extractions, more body
- DARK: Lower temps (88-91°C), shorter extractions, bold flavors

Be precise and only include information you can reasonably infer from the image. If you cannot clearly see coffee beans, set identified to false.`;

interface RawAnalysisResponse {
  identified: boolean;
  confidence: number;
  beanType: string | null;
  possibleOrigin: string | null;
  roastLevel: RoastLevel;
  roastLevelConfidence: number;
  observations: string[];
  suggestedBrewMethods: string[];
  brewParameters: Partial<BrewParameters>;
  tastingNotesLikely: string[];
  warnings: string[];
}

export const aiAnalysisService = {
  async analyzeImage(imageUrl: string): Promise<AIAnalysisResult> {
    if (!process.env.OPENAI_API_KEY) {
      throw new AppError(500, 'OpenAI API key not configured');
    }

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: ANALYSIS_PROMPT },
              { type: 'image_url', image_url: { url: imageUrl, detail: 'high' } },
            ],
          },
        ],
        response_format: { type: 'json_object' },
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new AppError(500, 'No analysis returned from AI');
      }

      const raw: RawAnalysisResponse = JSON.parse(content);

      if (!raw.identified) {
        throw new AppError(400, 'Could not identify a coffee bag in the image. Please upload a clear photo of a coffee bag or package.');
      }

      return this.transformAnalysis(raw, imageUrl);
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof SyntaxError) {
        throw new AppError(500, 'Failed to parse AI response');
      }
      throw new AppError(500, 'Failed to analyze image');
    }
  },

  transformAnalysis(raw: RawAnalysisResponse, imageUrl: string): AIAnalysisResult {
    return {
      imageUrl,
      identified: raw.identified,
      confidence: raw.confidence,
      beanType: raw.beanType,
      possibleOrigin: raw.possibleOrigin,
      roastLevel: raw.roastLevel,
      roastLevelConfidence: raw.roastLevelConfidence,
      observations: raw.observations || [],
      suggestedBrewMethods: raw.suggestedBrewMethods || [],
      brewParameters: raw.brewParameters || {},
      tastingNotesLikely: raw.tastingNotesLikely || [],
      warnings: raw.warnings || [],
      analyzedAt: new Date(),
    };
  },
};
