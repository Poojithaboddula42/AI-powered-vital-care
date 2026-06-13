import { z } from "zod";
import type { SchemeRecommendationOutput } from "../types/ai.types";

const SchemeItemSchema = z.object({
  scheme: z.string().min(1),
  eligibilityReason: z.string().min(1),
  benefits: z.string().min(1),
  score: z.number().int().min(0).max(100),
});

export const SchemeRecommendationSchema = z.object({
  recommendations: z.array(SchemeItemSchema).min(1),
  confidence: z.number().min(0).max(1),
});

export function validateSchemeRecommendation(data: unknown): SchemeRecommendationOutput {
  return SchemeRecommendationSchema.parse(data);
}

export function getSchemeRecommendationFallback(): SchemeRecommendationOutput {
  return {
    recommendations: [
      {
        scheme: "Ayushman Bharat – PM-JAY",
        eligibilityReason: "General health insurance scheme for eligible Indian families.",
        benefits: "Coverage up to ₹5 lakh per family per year for hospitalization.",
        score: 70,
      },
    ],
    confidence: 0,
    fallback: true,
  };
}
