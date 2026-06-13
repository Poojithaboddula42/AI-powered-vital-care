import type { GeminiServiceError, GeminiErrorCode } from "./GeminiTypes";

const SAFE_FALLBACK_MESSAGE =
  "AI analysis is temporarily unavailable. Please rely on your clinical team and recorded vitals.";

export function createGeminiError(
  code: GeminiErrorCode,
  message: string,
  options?: { serviceName?: string; cause?: unknown; retryable?: boolean },
): GeminiServiceError {
  return {
    code,
    message,
    serviceName: options?.serviceName,
    cause: options?.cause,
   retryable: options?.retryable ?? (code === "RATE_LIMIT" || code === "NETWORK" || code === "TIMEOUT"),
  };
}

export function classifyGeminiError(error: unknown, serviceName?: string): GeminiServiceError {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (lower.includes("api key") || lower.includes("api_key")) {
    return createGeminiError("MISSING_API_KEY", "Gemini API key is not configured.", { serviceName, cause: error });
  }
  if (lower.includes("429") || lower.includes("rate") || lower.includes("quota")) {
    return createGeminiError("RATE_LIMIT", "Gemini rate limit reached.", { serviceName, cause: error, retryable: true });
  }
  if (lower.includes("timeout") || lower.includes("aborted")) {
    return createGeminiError("TIMEOUT", "Gemini request timed out.", { serviceName, cause: error, retryable: true });
  }
  if (lower.includes("fetch") || lower.includes("network") || lower.includes("econn")) {
    return createGeminiError("NETWORK", "Network error communicating with Gemini.", { serviceName, cause: error, retryable: true });
  }
  if (lower.includes("json") || lower.includes("parse")) {
    return createGeminiError("INVALID_RESPONSE", "Gemini returned an invalid response.", { serviceName, cause: error });
  }

  return createGeminiError("UNKNOWN", message, { serviceName, cause: error });
}

export function logGeminiError(error: GeminiServiceError): void {
  console.error(
    JSON.stringify({
      level: "error",
      component: "gemini",
      code: error.code,
      service: error.serviceName,
      message: error.message,
      retryable: error.retryable,
    }),
  );
}

export function getSafeFallbackMessage(): string {
  return SAFE_FALLBACK_MESSAGE;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
