/**
 * ─── LLM ADAPTER — GROQ ────────────────────────────────────────────────
 * OpenAI-compat. Modelo default llama-3.3-70b-versatile (override: GROQ_MODEL).
 */
import { createOpenAICompatAdapter } from "./openai-compat";

export const groqAdapter = createOpenAICompatAdapter({
  provider: "groq",
  baseURL: "https://api.groq.com/openai/v1",
  apiKeyEnv: "GROQ_API_KEY",
  defaultModel: "llama-3.3-70b-versatile",
  modelEnv: "GROQ_MODEL",
  defaultTemperature: 0.7,
  defaultMaxTokens: 4096,
  defaultTimeoutMs: 25_000,
});
