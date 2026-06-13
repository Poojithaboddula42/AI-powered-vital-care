export interface GeminiConfigOptions {
  apiKey: string;
  model: string;
  timeoutMs: number;
  maxRetries: number;
}

export function loadGeminiConfig(): GeminiConfigOptions {
  const apiKey = process.env["GEMINI_API_KEY"] ?? "";
  const model = process.env["GEMINI_MODEL"] ?? "gemini-2.5-flash";
  const timeoutMs = Number(process.env["GEMINI_TIMEOUT_MS"] ?? "30000");
  const maxRetries = Number(process.env["GEMINI_MAX_RETRIES"] ?? "3");

  return {
    apiKey,
    model,
    timeoutMs: Number.isNaN(timeoutMs) ? 30000 : timeoutMs,
    maxRetries: Number.isNaN(maxRetries) ? 3 : maxRetries,
  };
}

export function isGeminiConfigured(): boolean {
  return Boolean(process.env["GEMINI_API_KEY"]);
}
