/**
 * ─── LLM PROVIDER ABSTRACTION ──────────────────────────────────────────
 *
 * Single entry point for ALL LLM calls in MENTE.AI.
 * No engine or route should instantiate ChatOpenAI, ChatGroq, or
 * call api.groq.com / api.deepseek.com directly.
 *
 * Usage:
 *   import { createLLM } from '@/lib/llm/provider'
 *   const llm = createLLM({ provider: 'deepseek', temperature: 0.7 })
 *   const response = await llm.invoke(messages)
 */

import { ChatOpenAI } from "@langchain/openai";
import { initLangSmith } from "@/lib/langsmith";

// ─── Provider URLs ──────────────────────────────────────────────────────

const PROVIDER_URLS = {
  deepseek: "https://api.deepseek.com/v1",
  groq: "https://api.groq.com/openai/v1",
} as const;

// ─── Default models ─────────────────────────────────────────────────────

const DEFAULT_MODELS = {
  deepseek: "deepseek-v4-pro",
  groq: "llama-3.3-70b-versatile",
} as const;

// ─── Types ──────────────────────────────────────────────────────────────

export type LLMProvider = "deepseek" | "groq";
export type LLMProviderMode = LLMProvider | "auto";

export interface LLMOptions {
  /** Specific provider. 'auto' tries DeepSeek first, falls back to Groq. */
  provider?: LLMProviderMode;
  /** Override default model for the chosen provider. */
  model?: string;
  /** Temperature (0-2). Default: 0.7 */
  temperature?: number;
  /** Max tokens. Default: 4096 */
  maxTokens?: number;
}

// ─── Provider resolution ────────────────────────────────────────────────

interface ResolvedProvider {
  baseURL: string;
  apiKey: string;
  model: string;
}

function resolveProvider(options: LLMOptions): ResolvedProvider {
  const mode = options.provider ?? "auto";

  if (mode === "deepseek" || mode === "auto") {
    const key = process.env.DEEPSEEK_API_KEY;
    if (key && key.length > 20 && !key.includes("...")) {
      return {
        baseURL: PROVIDER_URLS.deepseek,
        apiKey: key,
        model: options.model ?? DEFAULT_MODELS.deepseek,
      };
    }
  }

  if (mode === "groq" || mode === "auto") {
    const key = process.env.GROQ_API_KEY;
    if (key && key.length > 20 && !key.includes("...")) {
      return {
        baseURL: PROVIDER_URLS.groq,
        apiKey: key,
        model: options.model ?? DEFAULT_MODELS.groq,
      };
    }
  }

  // Both unavailable — throw with clear message
  const tried = mode === "auto"
    ? "DeepSeek (DEEPSEEK_API_KEY) e Groq (GROQ_API_KEY)"
    : mode === "deepseek"
      ? "DeepSeek (DEEPSEEK_API_KEY)"
      : "Groq (GROQ_API_KEY)";

  throw new Error(
    `[createLLM] Nenhum provedor disponível. Tentou: ${tried}. ` +
    `Configure ao menos uma API key no .env.local.`
  );
}

// ─── Factory ────────────────────────────────────────────────────────────

/**
 * Cria uma instância de ChatOpenAI apontando para o provedor resolvido.
 *
 * DeepSeek e Groq são compatíveis com a API OpenAI — usamos ChatOpenAI
 * com baseURL customizado. NÃO importamos @langchain/deepseek.
 *
 * Modo 'auto' (padrão):
 *   1. Tenta DEEPSEEK_API_KEY → https://api.deepseek.com/v1
 *   2. Fallback GROQ_API_KEY    → https://api.groq.com/openai/v1
 *   3. Nenhum → lança erro
 */
export function createLLM(options: LLMOptions = {}): ChatOpenAI {
  initLangSmith();
  const resolved = resolveProvider(options);

  return new ChatOpenAI({
    model: resolved.model,
    apiKey: resolved.apiKey,
    configuration: {
      baseURL: resolved.baseURL,
    },
    temperature: options.temperature ?? 0.7,
    maxTokens: options.maxTokens ?? 4096,
  });
}

// ─── Convenience — replaces old createAgentLLM() ────────────────────────

/**
 * @deprecated Use createLLM() instead.
 * Mantido para compatibilidade durante transição.
 */
export function createAgentLLM(): ChatOpenAI {
  return createLLM({ provider: "auto" });
}

// ─── Provider fallback with connectivity check ──────────────────────────

export interface ResolvedProviderWithFallback {
  baseURL: string;
  apiKey: string;
  model: string;
  provider: LLMProvider;
}

/**
 * Tenta DeepSeek primeiro (ping /v1/models). Se falhar, cai no Groq.
 * Se ambos falharem, lança erro.
 */
export async function resolveProviderWithFallback(): Promise<ResolvedProviderWithFallback> {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (deepseekKey && deepseekKey.length > 20) {
    try {
      const ping = await fetch(`${PROVIDER_URLS.deepseek}/models`, {
        headers: { Authorization: `Bearer ${deepseekKey}` },
        signal: AbortSignal.timeout(5000),
      });
      if (ping.ok) {
        console.log("[PROVIDER] DEEPSEEK OK");
        return {
          baseURL: PROVIDER_URLS.deepseek,
          apiKey: deepseekKey,
          model: DEFAULT_MODELS.deepseek,
          provider: "deepseek",
        };
      }
      console.log("[PROVIDER] DEEPSEEK FAILED — status", ping.status);
    } catch {
      console.log("[PROVIDER] DEEPSEEK FAILED — network error");
    }
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey && groqKey.length > 20) {
    try {
      const ping = await fetch(`${PROVIDER_URLS.groq}/models`, {
        headers: { Authorization: `Bearer ${groqKey}` },
        signal: AbortSignal.timeout(5000),
      });
      if (ping.ok) {
        console.log("[PROVIDER] FALLBACK TO GROQ");
        return {
          baseURL: PROVIDER_URLS.groq,
          apiKey: groqKey,
          model: DEFAULT_MODELS.groq,
          provider: "groq",
        };
      }
      console.log("[PROVIDER] GROQ FAILED — status", ping.status);
    } catch {
      console.log("[PROVIDER] GROQ FAILED — network error");
    }
  }

  throw new Error(
    "Nenhum provedor LLM disponível. DeepSeek e Groq falharam no ping de conectividade."
  );
}

// ─── Raw fetch chat completion ──────────────────────────────────────────

export async function chat(
  provider: ResolvedProviderWithFallback,
  messages: { role: string; content: string }[],
  options?: { maxTokens?: number; temperature?: number },
): Promise<string> {
  const response = await fetch(`${provider.baseURL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${provider.apiKey}`,
    },
    body: JSON.stringify({
      model: provider.model,
      messages,
      max_tokens: options?.maxTokens ?? 2000,
      temperature: options?.temperature ?? 0.9,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `[${provider.provider}] HTTP ${response.status}: ${text.slice(0, 200)}`,
    );
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
