import { ChatOpenAI } from "@langchain/openai";
import { deepseekProvider } from "./deepseek";
import { groqProvider } from "./groq";

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
  provider?: LLMProviderMode;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

interface ResolvedProvider {
  baseURL: string;
  apiKey: string;
  model: string;
}

// ─── Sync resolve (legado — sem fallback em execução) ───────────────────

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

// ─── Legacy factory (ChatOpenAI / LangChain) ─────────────────────────────

export function createLLM(options: LLMOptions = {}): ChatOpenAI {
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

/** @deprecated Use createLLM() instead. */
export function createAgentLLM(): ChatOpenAI {
  return createLLM({ provider: "auto" });
}

// ─── Async fallback resolver (ping DeepSeek antes, cai no Groq se falhar) ―

export interface ProviderInstance {
  chat: (messages: any[]) => Promise<{ content: string; provider: string }>;
}

export async function resolveProviderWithFallback(preferred?: string): Promise<{
  provider: ProviderInstance;
  name: string;
}> {
  // 1. Se usuário prefere Groq explicitamente, usa direto
  if (preferred === "groq") {
    console.log("[LLM] Using Groq (explicit preference)");
    return { provider: groqProvider(), name: "groq" };
  }

  // 2. Se não tem chave DeepSeek, vai direto pro Groq
  if (!process.env.DEEPSEEK_API_KEY) {
    console.log("[LLM] DeepSeek key missing, using Groq fallback");
    return { provider: groqProvider(), name: "groq" };
  }

  // 3. Tenta DeepSeek primeiro — ping de validação
  try {
    const testResponse = await fetch("https://api.deepseek.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
    });

    if (testResponse.ok) {
      console.log("[LLM] DeepSeek validated, using deepseek-v4-pro");
      return { provider: deepseekProvider(), name: "deepseek" };
    }

    // 401, 403, etc. = chave inválida
    console.warn(`[LLM] DeepSeek auth failed (${testResponse.status}), falling back to Groq`);
    return { provider: groqProvider(), name: "groq" };
  } catch (error) {
    // Network error, timeout, etc.
    console.warn("[LLM] DeepSeek unreachable, falling back to Groq:", error);
    return { provider: groqProvider(), name: "groq" };
  }
}
