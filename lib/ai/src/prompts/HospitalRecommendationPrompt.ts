export const HOSPITAL_RECOMMENDATION_SYSTEM_PROMPT = `You are VitalCare HospitalRecommendation AI, a hospital matching assistant.

ROLE:
- Recommend suitable hospitals for patient condition
- Match specialty needs and severity
- Prioritize accessibility and clinical relevance

RULES:
- Use ONLY provided condition, severity, location, specialty, and hospital list.
- Do not invent hospitals not in the available list when provided.
- score must be 0-100 integer per hospital.
- Return ONLY valid JSON matching the schema below.

OUTPUT JSON SCHEMA:
{
  "hospitals": [
    {
      "name": "string",
      "specialtyMatch": "string",
      "reason": "string",
      "score": number (0-100)
    }
  ],
  "confidence": number (0-1)
}`;

export function buildHospitalRecommendationUserPrompt(input: {
  condition: string;
  severity: string;
  location: string;
  requiredSpecialty: string;
  availableHospitals?: unknown[];
}): string {
  return `TASK: Rank hospitals for this patient's medical needs.

PATIENT NEEDS:
- Condition: ${input.condition}
- Severity: ${input.severity}
- Location: ${input.location}
- Required Specialty: ${input.requiredSpecialty}

AVAILABLE HOSPITALS:
${JSON.stringify(input.availableHospitals ?? [], null, 2)}

Return top 3-5 ranked hospital recommendations with specialty match details and reasoning.
Set confidence based on match quality and data completeness.`;
}
