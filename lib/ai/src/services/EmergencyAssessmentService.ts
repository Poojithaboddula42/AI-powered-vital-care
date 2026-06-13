import { GeminiService } from "../gemini/GeminiService";
import { logGeminiError, classifyGeminiError } from "../gemini/GeminiErrorHandler";
import {
  EMERGENCY_ASSESSMENT_SYSTEM_PROMPT,
  buildEmergencyAssessmentUserPrompt,
} from "../prompts/EmergencyAssessmentPrompt";
import {
  validateEmergencyAssessment,
  getEmergencyAssessmentFallback,
} from "../validators/EmergencyAssessmentValidator";
import type { EmergencyAssessmentInput, EmergencyAssessmentOutput } from "../types/ai.types";

function inferSeverityFromVitals(vitals: EmergencyAssessmentInput["currentVitals"]): EmergencyAssessmentOutput["severity"] {
  if (vitals.spo2 < 90 || vitals.systolicBp > 180 || vitals.heartRate > 120) return "CRITICAL";
  if (vitals.spo2 < 94 || vitals.systolicBp > 140 || vitals.glucose > 200) return "HIGH";
  if (vitals.status === "critical") return "CRITICAL";
  if (vitals.status === "risk") return "MEDIUM";
  return "LOW";
}

export class EmergencyAssessmentService {
  constructor(private readonly gemini: GeminiService = GeminiService.getInstance()) {}

  async assess(input: EmergencyAssessmentInput): Promise<EmergencyAssessmentOutput> {
    try {
      const raw = await this.gemini.generateStructuredResponse<EmergencyAssessmentOutput>({
        serviceName: "EmergencyAssessmentService",
        systemPrompt: EMERGENCY_ASSESSMENT_SYSTEM_PROMPT,
        userPrompt: buildEmergencyAssessmentUserPrompt(input),
      });

      try {
        return validateEmergencyAssessment(raw);
      } catch (validationError) {
        logGeminiError(
          classifyGeminiError(validationError, "EmergencyAssessmentService"),
        );
        const retryRaw = await this.gemini.generateStructuredResponse<EmergencyAssessmentOutput>({
          serviceName: "EmergencyAssessmentService",
          systemPrompt: EMERGENCY_ASSESSMENT_SYSTEM_PROMPT,
          userPrompt: `${buildEmergencyAssessmentUserPrompt(input)}\n\nIMPORTANT: Return strictly valid JSON with severity as LOW|MEDIUM|HIGH|CRITICAL.`,
        });
        return validateEmergencyAssessment(retryRaw);
      }
    } catch (error) {
      logGeminiError(classifyGeminiError(error, "EmergencyAssessmentService"));
      return getEmergencyAssessmentFallback(inferSeverityFromVitals(input.currentVitals));
    }
  }
}

export const emergencyAssessmentService = new EmergencyAssessmentService();
