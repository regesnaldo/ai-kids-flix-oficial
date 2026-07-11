/**
 * ─── LLM LAYER — COST TRACKER ──────────────────────────────────────────
 *
 * Observabilidade de custo/tokens por chamada LLM. Emite uma linha JSON
 * estruturada via logger (lib/logger.ts) para ingestão posterior
 * (Vercel Logs / Datadog / etc.).
 *
 * Usa logger.warn (não info) porque em produção MIN_LEVEL=warn — assim o
 * log de custo aparece no stdout em todos os ambientes.
 *
 * Preços APPROXIMADOS por 1M tokens (USD), env-overridable via LLM_PRICING_JSON.
 * Não use para faturamento — use para detecção de anomalias e ranking de custo.
 */

import { logger } from "@/lib/logger";
import type { LLMProviderName } from "./types";

interface ProviderPricing {
  /** USD por 1M tokens de entrada. */
  inputPerMillion: number;
  /** USD por 1M tokens de saída. */
  outputPerMillion: number;
}

// Preços aproximados (jun/2026). Override via LLM_PRICING_JSON.
const DEFAULT_PRICING: Record<LLMProviderName, ProviderPricing> = {
  anthropic: { inputPerMillion: 1.0, outputPerMillion: 5.0 }, // claude-haiku tier
  openai: { inputPerMillion: 2.5, outputPerMillion: 10.0 }, // gpt-4o
  groq: { inputPerMillion: 0.59, outputPerMillion: 0.79 }, // llama-3.3-70b
  deepseek: { inputPerMillion: 0.27, outputPerMillion: 1.1 }, // deepseek-chat
  morphllm: { inputPerMillion: 0, outputPerMillion: 0 }, // TODO: preço placeholder — morphllm ainda não está conectado a nenhuma funcionalidade em uso. Buscar preço real em https://api.morphllm.com antes de ativar este provedor de verdade.
};

function loadPricing(): Record<LLMProviderName, ProviderPricing> {
  const raw = process.env.LLM_PRICING_JSON;
  if (!raw) return DEFAULT_PRICING;
  try {
    return { ...DEFAULT_PRICING, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PRICING;
  }
}

/** Estima tokens de saída a partir do texto quando o provider não retorna usage. ~4 chars/token. */
function estimateTokensFromText(text: string): number {
  return Math.ceil(text.length / 4);
}

export interface CostRecord {
  provider: LLMProviderName;
  model: string;
  promptTokens: number;
  completionTokens: number;
  userId: string;
  route?: string;
  estimatedCostUsd: number;
}

/**
 * Calcula e loga o custo de uma chamada LLM.
 * Se completionTokens for 0 e content não-vazio, estima a partir do texto.
 */
export function trackCost(params: {
  provider: LLMProviderName;
  model: string;
  promptTokens: number;
  completionTokens: number;
  userId?: string | number;
  route?: string;
  content?: string;
}): CostRecord {
  const pricing = loadPricing()[params.provider] ?? DEFAULT_PRICING[params.provider];

  const completionTokens =
    params.completionTokens > 0
      ? params.completionTokens
      : params.content
        ? estimateTokensFromText(params.content)
        : 0;

  const estimatedCostUsd =
    (params.promptTokens * pricing.inputPerMillion +
      completionTokens * pricing.outputPerMillion) /
    1_000_000;

  const userId =
    params.userId === undefined || params.userId === null || params.userId === ""
      ? "anonymous"
      : String(params.userId);

  const record: CostRecord = {
    provider: params.provider,
    model: params.model,
    promptTokens: params.promptTokens,
    completionTokens,
    userId,
    route: params.route,
    estimatedCostUsd,
  };

  // warn => visível em produção (MIN_LEVEL=warn). Estruturado para ingestão.
  logger.warn("llm.cost", {
    ...record,
    event: "llm.call",
  });

  return record;
}
