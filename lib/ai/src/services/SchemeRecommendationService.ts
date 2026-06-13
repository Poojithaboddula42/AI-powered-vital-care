import { GeminiService } from "../gemini/GeminiService";
import { logGeminiError, classifyGeminiError } from "../gemini/GeminiErrorHandler";
import {
  SCHEME_RECOMMENDATION_SYSTEM_PROMPT,
  buildSchemeRecommendationUserPrompt,
} from "../prompts/SchemeRecommendationPrompt";
import {
  validateSchemeRecommendation,
  getSchemeRecommendationFallback,
} from "../validators/SchemeRecommendationValidator";
import type { SchemeRecommendationInput, SchemeRecommendationOutput } from "../types/ai.types";

export class SchemeRecommendationService {
  constructor(private readonly gemini: GeminiService = GeminiService.getInstance()) {}

  async recommend(input: SchemeRecommendationInput): Promise<SchemeRecommendationOutput> {
    try {
      const raw = await this.gemini.generateStructuredResponse<SchemeRecommendationOutput>({
        serviceName: "SchemeRecommendationService",
        systemPrompt: SCHEME_RECOMMENDATION_SYSTEM_PROMPT,
        userPrompt: buildSchemeRecommendationUserPrompt(input),
      });

      try {
        return validateSchemeRecommendation(raw);
      } catch (validationError) {
        logGeminiError(classifyGeminiError(validationError, "SchemeRecommendationService"));
        const retryRaw = await this.gemini.generateStructuredResponse<SchemeRecommendationOutput>({
          serviceName: "SchemeRecommendationService",
          systemPrompt: SCHEME_RECOMMENDATION_SYSTEM_PROMPT,
          userPrompt: `${buildSchemeRecommendationUserPrompt(input)}\n\nIMPORTANT: Return strictly valid JSON with ranked recommendations.`,
        });
        return validateSchemeRecommendation(retryRaw);
      }
    } catch (error) {
      logGeminiError(classifyGeminiError(error, "SchemeRecommendationService"));
      return getSchemeRecommendationFallback();
    }
  }
}

export const schemeRecommendationService = new SchemeRecommendationService();
