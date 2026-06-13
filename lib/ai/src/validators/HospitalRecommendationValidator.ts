import { z } from "zod";
import type { HospitalRecommendationOutput } from "../types/ai.types";

const HospitalItemSchema = z.object({
  name: z.string().min(1),
  specialtyMatch: z.string().min(1),
  reason: z.string().min(1),
  score: z.number().int().min(0).max(100),
});

export const HospitalRecommendationSchema = z.object({
  hospitals: z.array(HospitalItemSchema).min(1),
  confidence: z.number().min(0).max(1),
});

export function validateHospitalRecommendation(data: unknown): HospitalRecommendationOutput {
  return HospitalRecommendationSchema.parse(data);
}

export function getHospitalRecommendationFallback(location?: string): HospitalRecommendationOutput {
  return {
    hospitals: [
      {
        name: "Nearest emergency-capable hospital",
        specialtyMatch: "General emergency care",
        reason: `AI hospital matching is temporarily unavailable. Search for accredited hospitals near ${location ?? "your location"} with required specialty.`,
        score: 50,
      },
    ],
    confidence: 0,
    fallback: true,
  };
}
