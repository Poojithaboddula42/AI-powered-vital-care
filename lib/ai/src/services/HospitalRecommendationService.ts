import { GeminiService } from "../gemini/GeminiService";
import { logGeminiError, classifyGeminiError } from "../gemini/GeminiErrorHandler";
import {
  HOSPITAL_RECOMMENDATION_SYSTEM_PROMPT,
  buildHospitalRecommendationUserPrompt,
} from "../prompts/HospitalRecommendationPrompt";
import {
  validateHospitalRecommendation,
  getHospitalRecommendationFallback,
} from "../validators/HospitalRecommendationValidator";
import type { HospitalRecommendationInput, HospitalRecommendationOutput } from "../types/ai.types";

export class HospitalRecommendationService {
  constructor(private readonly gemini: GeminiService = GeminiService.getInstance()) {}

  async recommend(input: HospitalRecommendationInput): Promise<HospitalRecommendationOutput> {
    try {
      const raw = await this.gemini.generateStructuredResponse<HospitalRecommendationOutput>({
        serviceName: "HospitalRecommendationService",
        systemPrompt: HOSPITAL_RECOMMENDATION_SYSTEM_PROMPT,
        userPrompt: buildHospitalRecommendationUserPrompt(input),
      });

      try {
        return validateHospitalRecommendation(raw);
      } catch (validationError) {
        logGeminiError(classifyGeminiError(validationError, "HospitalRecommendationService"));
        const retryRaw = await this.gemini.generateStructuredResponse<HospitalRecommendationOutput>({
          serviceName: "HospitalRecommendationService",
          systemPrompt: HOSPITAL_RECOMMENDATION_SYSTEM_PROMPT,
          userPrompt: `${buildHospitalRecommendationUserPrompt(input)}\n\nIMPORTANT: Return strictly valid JSON with ranked hospitals.`,
        });
        return validateHospitalRecommendation(retryRaw);
      }
    } catch (error) {
      logGeminiError(classifyGeminiError(error, "HospitalRecommendationService"));
      return getHospitalRecommendationFallback(input.location);
    }
  }
}

export const hospitalRecommendationService = new HospitalRecommendationService();
