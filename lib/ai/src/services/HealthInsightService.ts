import { GeminiService } from "../gemini/GeminiService";
import { logGeminiError, classifyGeminiError } from "../gemini/GeminiErrorHandler";
import {
  HEALTH_INSIGHT_SYSTEM_PROMPT,
  buildHealthInsightUserPrompt,
} from "../prompts/HealthInsightPrompt";
import {
  validateHealthInsight,
  getHealthInsightFallback,
} from "../validators/HealthInsightValidator";
import type { HealthInsightInput, HealthInsightOutput } from "../types/ai.types";

export class HealthInsightService {
  constructor(private readonly gemini: GeminiService = GeminiService.getInstance()) {}

  async analyze(input: HealthInsightInput): Promise<HealthInsightOutput> {
    try {
      const raw = await this.gemini.generateStructuredResponse<HealthInsightOutput>({
        serviceName: "HealthInsightService",
        systemPrompt: HEALTH_INSIGHT_SYSTEM_PROMPT,
        userPrompt: buildHealthInsightUserPrompt(input),
      });

      try {
        return validateHealthInsight(raw);
      } catch (validationError) {
        logGeminiError(
          classifyGeminiError(validationError, "HealthInsightService"),
        );
        const retryRaw = await this.gemini.generateStructuredResponse<HealthInsightOutput>({
          serviceName: "HealthInsightService",
          systemPrompt: HEALTH_INSIGHT_SYSTEM_PROMPT,
          userPrompt: `${buildHealthInsightUserPrompt(input)}\n\nIMPORTANT: Return strictly valid JSON matching the schema.`,
        });
        return validateHealthInsight(retryRaw);
      }
    } catch (error) {
      logGeminiError(classifyGeminiError(error, "HealthInsightService"));
      return getHealthInsightFallback();
    }
  }
}

export const healthInsightService = new HealthInsightService();
