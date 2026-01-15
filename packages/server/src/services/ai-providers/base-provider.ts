import type { AIAnalysisResult, BrewParameters, RoastLevel } from '@coffee/shared';

/**
 * Configuration passed to provider methods
 */
export interface ProviderConfig {
  apiKey: string;
}

/**
 * Raw analysis response from AI providers (before transformation)
 */
export interface RawAnalysisResponse {
  identified: boolean;
  confidence: number;
  brandName: string | null;
  coffeeName: string | null;
  beanType: string | null;
  possibleOrigin: string | null;
  roastLevel: RoastLevel;
  roastLevelConfidence: number;
  observations: string[];
  tastingNotes: string[];
  flavorProfile: string | null;
  weight: string | null;
  suggestedBrewMethods: string[];
  brewParameters: Partial<BrewParameters>;
  tastingNotesLikely: string[];
  warnings: string[];
}

/**
 * Base interface for all AI providers
 */
export interface AIProviderInterface {
  /** Internal provider name (e.g., 'OPENAI') */
  readonly name: string;

  /** Display name for UI (e.g., 'OpenAI GPT-4o') */
  readonly displayName: string;

  /** Model identifier being used */
  readonly model: string;

  /**
   * Validates the format of an API key (basic pattern check)
   */
  validateKeyFormat(key: string): boolean;

  /**
   * Tests if the API key is valid by making a minimal API call
   */
  testConnection(config: ProviderConfig): Promise<boolean>;

  /**
   * Analyzes an image of coffee beans and returns structured results
   * @param imageDataUrl Base64 data URL of the image
   * @param config Provider configuration including API key
   */
  analyzeImage(imageDataUrl: string, config: ProviderConfig): Promise<AIAnalysisResult>;
}

/**
 * Common analysis prompt shared across all providers
 */
export const ANALYSIS_PROMPT = `You are an expert coffee specialist. Analyze this image of a coffee bag/package and extract all visible information from the packaging.

Return a JSON object with the following structure:
{
  "identified": boolean,           // Whether this is clearly a coffee bag/package
  "confidence": number,            // 0-1 confidence in your analysis
  "brandName": string | null,      // Brand/roaster name visible on the bag
  "coffeeName": string | null,     // Product name or blend name
  "beanType": string | null,       // "Arabica", "Robusta", "Blend", or specific variety if stated
  "possibleOrigin": string | null, // Country/region if listed on package
  "roastLevel": "LIGHT" | "MEDIUM_LIGHT" | "MEDIUM" | "MEDIUM_DARK" | "DARK",
  "roastLevelConfidence": number,  // 0-1 confidence in roast level (higher if explicitly stated on bag)
  "observations": string[],        // Other notable info from the packaging (certifications, process method, altitude, etc.)
  "tastingNotes": string[],        // Tasting notes if listed on the bag (e.g., "chocolate", "citrus", "berry")
  "flavorProfile": string | null,  // Overall flavor description if provided
  "weight": string | null,         // Package weight if visible (e.g., "250g", "12oz")
  "suggestedBrewMethods": string[],// Recommended brew methods if listed, or infer from roast level
  "brewParameters": {
    "espresso": {
      "dose": number,              // grams in (suggest 18 as default)
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
  "tastingNotesLikely": string[],  // If no tasting notes on bag, predict based on origin and roast
  "warnings": string[]             // Any concerns (unclear info, conflicting details, etc.)
}

Guidelines for roast-based brew recommendations:
- LIGHT: Higher temps (93-96°C), longer extractions, highlight origin characteristics
- MEDIUM_LIGHT: Balanced temps (92-94°C), good for both espresso and filter
- MEDIUM: Versatile temps (91-93°C), balanced sweetness and acidity
- MEDIUM_DARK: Lower temps (89-92°C), shorter extractions, more body
- DARK: Lower temps (88-91°C), shorter extractions, bold flavors

Priority: Extract actual text from the packaging first. Only infer/predict when information is not visible.
If roast level is explicitly stated on the bag (e.g., "Light Roast", "Dark Roast"), use that with high confidence.
If you cannot clearly identify this as a coffee bag/package, set identified to false.

IMPORTANT: Return ONLY the JSON object, no additional text.`;

/**
 * Transform raw AI response into standardized AIAnalysisResult
 */
export function transformAnalysis(
  raw: RawAnalysisResponse,
  imageUrl: string
): AIAnalysisResult {
  return {
    imageUrl,
    identified: raw.identified,
    confidence: raw.confidence,
    brandName: raw.brandName,
    coffeeName: raw.coffeeName,
    beanType: raw.beanType,
    possibleOrigin: raw.possibleOrigin,
    roastLevel: raw.roastLevel,
    roastLevelConfidence: raw.roastLevelConfidence,
    observations: raw.observations || [],
    tastingNotes: raw.tastingNotes || [],
    flavorProfile: raw.flavorProfile,
    weight: raw.weight,
    suggestedBrewMethods: raw.suggestedBrewMethods || [],
    brewParameters: raw.brewParameters || {},
    tastingNotesLikely: raw.tastingNotesLikely || [],
    warnings: raw.warnings || [],
    analyzedAt: new Date(),
  };
}

/**
 * Parse JSON response from AI, handling common issues
 */
export function parseAIResponse(content: string): RawAnalysisResponse {
  // Try to extract JSON from the response (some models add extra text)
  let jsonStr = content.trim();

  // Handle markdown code blocks
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  // Try to find JSON object boundaries
  const startIdx = jsonStr.indexOf('{');
  const endIdx = jsonStr.lastIndexOf('}');
  if (startIdx !== -1 && endIdx !== -1) {
    jsonStr = jsonStr.slice(startIdx, endIdx + 1);
  }

  return JSON.parse(jsonStr);
}
