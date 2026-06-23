/**
 * ─── LLM ADAPTER — OPENAI-COMPAT CORE ──────────────────────────────────
 *
 * Factory compartilhada para providers compatíveis com a API OpenAI
 * (chat/completions): OpenAI, Groq, DeepSeek. Cada um configura baseURL,
 * env var de chave, modelo default e timeouts.
 *
 * Streaming preserva o comportamento atual do projeto (fake-stream):
 * gera o texto completo e yielding em um único chunk. Streaming incremental
 * real para OpenAI/Groq é melhoria futura.
 *
 * Vive dentro de src/lib/llm/**.
 */

import { LLMProviderError, type LLMGenerateOptions, type LLMResult, type LLMProviderName } from "../types";

export interface CompatConfig {
  provider: LLMProviderName;
  baseURL: string;
  apiKeyEnv: string;
  defaultModel: string;
  /** Env var opcional de override de modelo. */
  modelEnv?: string;
  defaultTemperature: number;
  defaultMaxTokens: number;
  defaultTimeoutMs: number;
}

function classifyStatus(status: number): LLMProviderError["tipo"] {
  if (status === 401 || status === 403) return "autorizacao";
  if (status === 429) return "rate_limit";
  if (status >= 500) return "servidor";
  return "desconhecido";
}

export function createOpenAICompatAdapter(cfg: CompatConfig) {
  function resolve(): { apiKey: string; model: string } {
    const apiKey = process.env[cfg.apiKeyEnv];
    if (!apiKey || apiKey.includes("...") || apiKey.length < 20) {
      throw new LLMProviderError(cfg.provider, 0, "sem_chave", `${cfg.apiKeyEnv} não configurada.`);
    }
    const model = (cfg.modelEnv ? process.env[cfg.modelEnv] : undefined) || cfg.defaultModel;
    return { apiKey, model };
  }

  function buildBody(opts: LLMGenerateOptions, model: string): Record<string, unknown> {
    const messages: Array<{ role: string; content: string }> = [];
    if (opts.system) messages.push({ role: "system", content: opts.system });
    for (const m of opts.messages) messages.push({ role: m.role, content: m.content });

    const body: Record<string, unknown> = {
      model,
      messages,
      temperature: opts.temperature ?? cfg.defaultTemperature,
      max_tokens: opts.maxTokens ?? cfg.defaultMaxTokens,
    };
    if (opts.responseFormat === "json") {
      body.response_format = { type: "json_object" };
    }
    return body;
  }

  async function generate(opts: LLMGenerateOptions): Promise<LLMResult> {
    const { apiKey, model } = resolve();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? cfg.defaultTimeoutMs);

    try {
      const response = await fetch(`${cfg.baseURL}/chat/completions`, {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildBody(opts, model)),
      });

      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new LLMProviderError(
          cfg.provider,
          response.status,
          classifyStatus(response.status),
          `${cfg.provider} HTTP ${response.status}: ${detail.slice(0, 200)}`,
        );
      }

      const data = await response.json();
      const content: string = data?.choices?.[0]?.message?.content ?? "";
      const promptTokens: number = data?.usage?.prompt_tokens ?? 0;
      const completionTokens: number = data?.usage?.completion_tokens ?? 0;

      return {
        content,
        usage: { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens },
        provider: cfg.provider,
        model,
      };
    } catch (err) {
      if (err instanceof LLMProviderError) throw err;
      // AbortError → timeout
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("abort") || msg.includes("AbortError")) {
        throw new LLMProviderError(cfg.provider, 0, "timeout", `${cfg.provider} timeout.`);
      }
      throw new LLMProviderError(cfg.provider, 0, "desconhecido", msg);
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Fake-stream: preserva o comportamento atual (OpenAI/Groq no projeto
   * enfileiravam o texto completo). Streaming incremental real é futuro.
   */
  async function* stream(opts: LLMGenerateOptions): AsyncGenerator<string> {
    const result = await generate(opts);
    if (result.content) yield result.content;
  }

  return { generate, stream, provider: cfg.provider };
}
