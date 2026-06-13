import { GeminiService } from "../gemini/GeminiService";
import { logGeminiError, classifyGeminiError } from "../gemini/GeminiErrorHandler";
import {
  DOCTOR_SUMMARY_SYSTEM_PROMPT,
  buildDoctorSummaryUserPrompt,
} from "../prompts/DoctorSummaryPrompt";
import {
  validateDoctorSummary,
  getDoctorSummaryFallback,
} from "../validators/DoctorSummaryValidator";
import type { DoctorSummaryInput, DoctorSummaryOutput } from "../types/ai.types";

export class DoctorSummaryService {
  constructor(private readonly gemini: GeminiService = GeminiService.getInstance()) {}

  async summarize(input: DoctorSummaryInput): Promise<DoctorSummaryOutput> {
    try {
      const raw = await this.gemini.generateStructuredResponse<DoctorSummaryOutput>({
        serviceName: "DoctorSummaryService",
        systemPrompt: DOCTOR_SUMMARY_SYSTEM_PROMPT,
        userPrompt: buildDoctorSummaryUserPrompt(input),
      });

      try {
        return validateDoctorSummary(raw);
      } catch (validationError) {
        logGeminiError(classifyGeminiError(validationError, "DoctorSummaryService"));
        const retryRaw = await this.gemini.generateStructuredResponse<DoctorSummaryOutput>({
          serviceName: "DoctorSummaryService",
          systemPrompt: DOCTOR_SUMMARY_SYSTEM_PROMPT,
          userPrompt: `${buildDoctorSummaryUserPrompt(input)}\n\nIMPORTANT: Return strictly valid JSON matching the schema.`,
        });
        return validateDoctorSummary(retryRaw);
      }
    } catch (error) {
      logGeminiError(classifyGeminiError(error, "DoctorSummaryService"));
      return getDoctorSummaryFallback(input.patientHistory.name);
    }
  }
}

export const doctorSummaryService = new DoctorSummaryService();
