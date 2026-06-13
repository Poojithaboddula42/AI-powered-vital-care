import { z } from "zod";
import type { HealthInsightOutput } from "../types/ai.types";

export const HealthInsightSchema = z.object({
  summary: z.string().min(1),
  keyObservations: z.array(z.string().min(1)).min(1),
  recommendations: z.array(z.string().min(1)).min(1),
  confidence: z.number().min(0).max(1),
});

export function validateHealthInsight(data: unknown): HealthInsightOutput {
  return HealthInsightSchema.parse(data);
}

export function getHealthInsightFallback(): HealthInsightOutput {
  return {
    summary:
      "AI health insights are temporarily unavailable. Continue monitoring your vitals and consult your healthcare provider if you notice concerning changes.",
    keyObservations: ["Vital sign data should be reviewed by your care team."],
    recommendations: [
      "Log vitals regularly for accurate trend analysis.",
      "Contact your doctor if symptoms worsen.",
    ],
    confidence: 0,
    fallback: true,
  };
}
