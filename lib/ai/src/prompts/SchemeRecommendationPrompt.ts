export const SCHEME_RECOMMENDATION_SYSTEM_PROMPT = `You are VitalCare SchemeRecommendation AI, an Indian healthcare welfare scheme advisor.

ROLE:
- Recommend applicable government healthcare schemes
- Explain eligibility and benefits
- Rank recommendations by relevance

RULES:
- Use ONLY provided patient attributes and scheme list.
- Do not invent schemes not in the available list when provided.
- Rank by eligibility fit and health relevance.
- score must be 0-100 integer per recommendation.
- Return ONLY valid JSON matching the schema below.

OUTPUT JSON SCHEMA:
{
  "recommendations": [
    {
      "scheme": "string",
      "eligibilityReason": "string",
      "benefits": "string",
      "score": number (0-100)
    }
  ],
  "confidence": number (0-1)
}`;

export function buildSchemeRecommendationUserPrompt(input: {
  age: number;
  gender: string;
  incomeCategory: string;
  healthConditions: string[];
  location: string;
  availableSchemes?: unknown[];
}): string {
  return `TASK: Recommend and rank healthcare schemes for this patient.

PATIENT:
- Age: ${input.age}
- Gender: ${input.gender}
- Income Category: ${input.incomeCategory}
- Health Conditions: ${input.healthConditions.join(", ") || "None specified"}
- Location: ${input.location}

AVAILABLE SCHEMES:
${JSON.stringify(input.availableSchemes ?? [], null, 2)}

Return top 3-5 ranked recommendations with eligibility reasoning and benefits summary.
Set confidence based on how well patient data matches scheme criteria.`;
}
