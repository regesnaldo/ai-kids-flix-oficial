/**
 * ─── LLM ADAPTER — OPENAI ──────────────────────────────────────────────
 * OpenAI-compat. Modelo default gpt-4o (override: OPENAI_MODEL).
 */
import { createOpenAICompatAdapter } from "./openai-compat";

export const openaiAdapter = createOpenAICompatAdapter({
  provider: "openai",
  baseURL: "https://api.openai.com/v1",
  apiKeyEnv: "OPENAI_API_KEY",
  defaultModel: "gpt-4o",
  modelEnv: "OPENAI_MODEL",
  defaultTemperature: 0.7,
  defaultMaxTokens: 4096,
  defaultTimeoutMs: 25_000,
});
