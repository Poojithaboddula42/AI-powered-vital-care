import { GoogleGenerativeAI } from "@google/generative-ai";
import { loadGeminiConfig } from "./GeminiConfig";
import type { GeminiStructuredRequest } from "../types/ai.types";
import type { GeminiRawResponse } from "./GeminiTypes";
import {
  classifyGeminiError,
  createGeminiError,
  logGeminiError,
  sleep,
} from "./GeminiErrorHandler";

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

export class GeminiService {
  private static instance: GeminiService | null = null;
  private config = loadGeminiConfig();
  private client: GoogleGenerativeAI | null = null;

  private constructor() {
    if (this.config.apiKey) {
      this.client = new GoogleGenerativeAI(this.config.apiKey);
    }
  }

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  static createForTesting(config?: Partial<ReturnType<typeof loadGeminiConfig>>): GeminiService {
    const service = new GeminiService();
    if (config) {
      Object.assign(service.config, config);
      if (config.apiKey) {
        service.client = new GoogleGenerativeAI(config.apiKey);
      }
    }
    return service;
  }

  isConfigured(): boolean {
    return Boolean(this.config.apiKey && this.client);
  }

  async generateStructuredResponse<T>(request: GeminiStructuredRequest): Promise<T> {
    if (!this.client || !this.config.apiKey) {
      const err = createGeminiError("MISSING_API_KEY", "GEMINI_API_KEY is not configured.", {
        serviceName: request.serviceName,
      });
      logGeminiError(err);
      throw err;
    }

    let lastError: unknown;

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const raw = await this.callGemini(request);
        const jsonText = extractJson(raw.text);
        const parsed = JSON.parse(jsonText) as T;
        return parsed;
      } catch (error) {
        lastError = error;
        const classified = classifyGeminiError(error, request.serviceName);
        logGeminiError(classified);

        if (!classified.retryable || attempt === this.config.maxRetries - 1) {
          throw classified;
        }

        const backoffMs = Math.min(1000 * 2 ** attempt, 8000);
        await sleep(backoffMs);
      }
    }

    throw classifyGeminiError(lastError, request.serviceName);
  }

  private async callGemini(request: GeminiStructuredRequest): Promise<GeminiRawResponse> {
    const started = Date.now();
    const model = this.client!.getGenerativeModel({
      model: this.config.model,
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      },
    });

    const prompt = `${request.systemPrompt}\n\n${request.userPrompt}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener("abort", () => {
            reject(new Error(`Gemini request timed out after ${this.config.timeoutMs}ms`));
          });
        }),
      ]);

      const text = result.response.text();
      if (!text?.trim()) {
        throw createGeminiError("INVALID_RESPONSE", "Gemini returned an empty response.", {
          serviceName: request.serviceName,
        });
      }

      return {
        text,
        model: this.config.model,
        durationMs: Date.now() - started,
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}
