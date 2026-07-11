/**
 * ─── LLM ADAPTER — MORPHLLM ────────────────────────────────────────────
 * OpenAI-compat. Modelo default morph-glm52-744b (override: MORPHLLM_MODEL).
 * Endpoint: https://api.morphllm.com/v1
 */
import { createOpenAICompatAdapter } from "./openai-compat";

export const morphllmAdapter = createOpenAICompatAdapter({
  provider: "morphllm",
  baseURL: "https://api.morphllm.com/v1",
  apiKeyEnv: "MORPHLLM_API_KEY",
  defaultModel: "morph-glm52-744b",
  modelEnv: "MORPHLLM_MODEL",
  defaultTemperature: 0.7,
  defaultMaxTokens: 4096,
  defaultTimeoutMs: 25_000,
});