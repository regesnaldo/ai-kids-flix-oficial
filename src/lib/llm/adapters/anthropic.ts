/**
 * ─── LLM ADAPTER — ANTHROPIC ───────────────────────────────────────────
 *
 * Mensagens via Anthropic Messages API (api.anthropic.com/v1/messages).
 * Reutiliza a lógica madura do antigo src/lib/anthropic.ts:
 *   - cliente criado sob demanda (lazy) — evita problemas de DNS em serverless
 *   - timeout explícito via AbortSignal
 *   - retry com backoff exponencial para falhas transitórias
 *   - classificação de erros → LLMProviderError(tipo)
 *
 * Streaming: SSE incremental (content_block_delta). Non-stream: SDK messages.create.
 *
 * Vive dentro de src/lib/llm/** — único lugar permitido a importar @anthropic-ai/sdk.
 */

import Anthropic from "@anthropic-ai/sdk";
import { LLMProviderError, type LLMGenerateOptions, type LLMResult } from "../types";

// ─── Constantes ──────────────────────────────────────────────────────────

const TIMEOUT_MS = 25_000;
const MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 800;
const ANTHROPIC_VERSION = "2023-06-01";

/** Modelo padrão (pode ser overriden por ANTHROPIC_MODEL ou opts.model). */
export const ANTHROPIC_MODELO_PADRAO = "claude-haiku-4-5-20251001";

// ─── Tipos legacy (back-compat p/ antigos importadores de @/lib/anthropic) ─

export interface AnthropicMensagem {
  role: "user" | "assistant";
  content: string;
}

type ErrorTipo =
  | "sem_chave"
  | "dns"
  | "timeout"
  | "autorizacao"
  | "rate_limit"
  | "servidor"
  | "desconhecido";

// ─── Helpers ──────────────────────────────────────────────────────────────

function classificarErro(err: unknown): ErrorTipo {
  const msg = String(err).toLowerCase();
  if (msg.includes("api_key") || msg.includes("authentication") || msg.includes("401")) return "autorizacao";
  if (msg.includes("rate") || msg.includes("429")) return "rate_limit";
  if (msg.includes("dns") || msg.includes("lookup") || msg.includes("enotfound") || msg.includes("i/o timeout")) return "dns";
  if (msg.includes("abort") || msg.includes("timeout") || msg.includes("timed out")) return "timeout";
  if (msg.includes("500") || msg.includes("502") || msg.includes("503")) return "servidor";
  return "desconhecido";
}

function deveRetry(tipo: ErrorTipo): boolean {
  return tipo === "dns" || tipo === "timeout" || tipo === "servidor" || tipo === "desconhecido";
}

function resolverModelo(opts: LLMGenerateOptions): string {
  return opts.model ?? process.env.ANTHROPIC_MODEL ?? ANTHROPIC_MODELO_PADRAO;
}

function criarCliente(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.includes("...") || apiKey.length < 20) {
    throw new LLMProviderError("anthropic", 0, "sem_chave", "ANTHROPIC_API_KEY não configurada no ambiente.");
  }
  return new Anthropic({ apiKey, timeout: TIMEOUT_MS, maxRetries: 0 });
}

function toAnthropicMessages(opts: LLMGenerateOptions): AnthropicMensagem[] {
  return opts.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
}

// ─── Adapter: generate (non-stream, com retry) ────────────────────────────

export async function generate(opts: LLMGenerateOptions): Promise<LLMResult> {
  const modelo = resolverModelo(opts);
  const maxTokens = opts.maxTokens ?? 900;
  const mensagens = toAnthropicMessages(opts);

  let ultimoErro: LLMProviderError | null = null;

  for (let tentativa = 1; tentativa <= MAX_RETRIES + 1; tentativa++) {
    try {
      const cliente = criarCliente();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? TIMEOUT_MS);

      try {
        const params: Anthropic.MessageCreateParamsNonStreaming = {
          model: modelo,
          max_tokens: maxTokens,
          messages: mensagens,
        };
        if (opts.system) params.system = opts.system;

        const resposta = await cliente.messages.create(params, { signal: controller.signal });
        clearTimeout(timer);

        const texto = resposta.content[0]?.type === "text" ? resposta.content[0].text : "";
        const promptTokens = resposta.usage?.input_tokens ?? 0;
        const completionTokens = resposta.usage?.output_tokens ?? 0;

        return {
          content: texto,
          usage: { promptTokens, completionTokens, totalTokens: promptTokens + completionTokens },
          provider: "anthropic",
          model: modelo,
        };
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      // Erro já tipado pelo próprio adapter (ex: sem_chave) — propaga sem retry.
      if (err instanceof LLMProviderError) throw err;

      const tipo = classificarErro(err);
      ultimoErro = new LLMProviderError(
        "anthropic",
        0,
        tipo,
        err instanceof Error ? err.message : String(err),
      );

      const ehUltima = tentativa >= MAX_RETRIES + 1;
      if (ehUltima || !deveRetry(tipo)) break;

      const espera = RETRY_BASE_DELAY_MS * Math.pow(2, tentativa - 1);
      await new Promise((r) => setTimeout(r, espera));
    }
  }

  throw ultimoErro ?? new LLMProviderError("anthropic", 0, "desconhecido", "Falha desconhecida.");
}

// ─── Adapter: stream (SSE incremental via fetch) ──────────────────────────

export async function* stream(opts: LLMGenerateOptions): AsyncGenerator<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.includes("...") || apiKey.length < 20) {
    throw new LLMProviderError("anthropic", 0, "sem_chave", "ANTHROPIC_API_KEY não configurada.");
  }

  const modelo = resolverModelo(opts);
  const maxTokens = opts.maxTokens ?? 900;
  const body: Record<string, unknown> = {
    model: modelo,
    max_tokens: maxTokens,
    messages: toAnthropicMessages(opts),
    stream: true,
  };
  if (opts.system) body.system = opts.system;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new LLMProviderError(
      "anthropic",
      response.status,
      classificarErro(`HTTP ${response.status}`),
      `Anthropic HTTP ${response.status}: ${detail.slice(0, 200)}`,
    );
  }
  if (!response.body) {
    throw new LLMProviderError("anthropic", 0, "desconhecido", "Corpo da resposta vazio.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (line.startsWith("data: ") && !line.includes("[DONE]")) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.type === "content_block_delta" && data.delta?.type === "text_delta") {
            yield data.delta.text as string;
          }
        } catch {
          // linha inválida — ignora
        }
      }
    }
  }
}

// ─── Back-compat: API legada do antigo @/lib/anthropic ────────────────────

interface OpcoesLegacy {
  system?: string;
  mensagens: AnthropicMensagem[];
  modelo?: string;
  maxTokens?: number;
}

/** Equivalente ao antigo anthropicCompletionText. Retorna apenas o texto. */
export async function anthropicCompletionText(opcoes: OpcoesLegacy): Promise<string> {
  const result = await generate({
    provider: "anthropic",
    model: opcoes.modelo,
    system: opcoes.system,
    messages: opcoes.mensagens.map((m) => ({ role: m.role, content: m.content })),
    maxTokens: opcoes.maxTokens,
  });
  if (!result.content.trim()) throw new LLMProviderError("anthropic", 0, "desconhecido", "Anthropic retornou texto vazio.");
  return result.content;
}

/** Equivalente ao antigo anthropicStream. Retorna ReadableStream<Uint8Array>. */
export function anthropicStream(opcoes: OpcoesLegacy): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream({
          provider: "anthropic",
          model: opcoes.modelo,
          system: opcoes.system,
          messages: opcoes.mensagens.map((m) => ({ role: m.role, content: m.content })),
          maxTokens: opcoes.maxTokens,
        })) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      } catch (err) {
        controller.error(err instanceof Error ? err : new Error(String(err)));
      }
    },
  });
}
