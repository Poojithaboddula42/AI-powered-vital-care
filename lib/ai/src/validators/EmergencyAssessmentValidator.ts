import { z } from "zod";
import type { EmergencyAssessmentOutput, SeverityLevel } from "../types/ai.types";

const SeverityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);

export const EmergencyAssessmentSchema = z.object({
  severity: SeverityEnum,
  riskScore: z.number().int().min(0).max(100),
  explanation: z.string().min(1),
  recommendedAction: z.string().min(1),
  confidence: z.number().min(0).max(1),
});

export function validateEmergencyAssessment(data: unknown): EmergencyAssessmentOutput {
  return EmergencyAssessmentSchema.parse(data);
}

export function getEmergencyAssessmentFallback(severity: SeverityLevel = "MEDIUM"): EmergencyAssessmentOutput {
  return {
    severity,
    riskScore: severity === "CRITICAL" ? 90 : severity === "HIGH" ? 75 : severity === "MEDIUM" ? 50 : 25,
    explanation:
      "Automated emergency assessment is temporarily unavailable. Review vitals manually and follow clinical protocols.",
    recommendedAction:
      "If vitals are abnormal or symptoms are severe, contact emergency services (108/911) or seek immediate medical care.",
    confidence: 0,
    fallback: true,
  };
}
