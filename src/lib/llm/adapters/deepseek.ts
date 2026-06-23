/**
 * ─── LLM ADAPTER — DEEPSEEK ────────────────────────────────────────────
 * OpenAI-compat. Modelo default deepseek-v4-pro (preserva logos/generate).
 * Nota: não lê DEEPSEEK_MODEL por padrão — o call site histórico hardcodeava
 * o modelo; passar opts.model para override explícito.
 */
import { createOpenAICompatAdapter } from "./openai-compat";

export const deepseekAdapter = createOpenAICompatAdapter({
  provider: "deepseek",
  baseURL: "https://api.deepseek.com/v1",
  apiKeyEnv: "DEEPSEEK_API_KEY",
  defaultModel: "deepseek-v4-pro",
  defaultTemperature: 0.7,
  defaultMaxTokens: 4096,
  defaultTimeoutMs: 25_000,
});
