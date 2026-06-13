export type GeminiErrorCode =
  | "MISSING_API_KEY"
  | "TIMEOUT"
  | "RATE_LIMIT"
  | "NETWORK"
  | "INVALID_RESPONSE"
  | "VALIDATION_FAILED"
  | "UNKNOWN";

export interface GeminiServiceError {
  code: GeminiErrorCode;
  message: string;
  serviceName?: string;
  retryable: boolean;
  cause?: unknown;
}

export interface GeminiRawResponse {
  text: string;
  model: string;
  durationMs: number;
}
