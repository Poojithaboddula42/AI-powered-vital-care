import { z } from "zod";
import type { DoctorSummaryOutput } from "../types/ai.types";

export const DoctorSummarySchema = z.object({
  clinicalSummary: z.string().min(1),
  criticalAlerts: z.array(z.string()),
  importantObservations: z.array(z.string().min(1)).min(1),
  confidence: z.number().min(0).max(1),
});

export function validateDoctorSummary(data: unknown): DoctorSummaryOutput {
  return DoctorSummarySchema.parse(data);
}

export function getDoctorSummaryFallback(patientName?: string): DoctorSummaryOutput {
  return {
    clinicalSummary: `AI clinical summary for ${patientName ?? "the patient"} is temporarily unavailable. Review vitals, alerts, and recent history manually.`,
    criticalAlerts: [],
    importantObservations: ["Refer to recorded vitals and alert history for clinical decisions."],
    confidence: 0,
    fallback: true,
  };
}
