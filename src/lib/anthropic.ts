/**
 * MENTE.AI — Utilitário central para chamadas à API Anthropic
 *
 * Resolve os problemas de dns_failure em produção (Vercel/gru1):
 *  - Cliente criado sob demanda (lazy), nunca no escopo do módulo
 *  - Timeout explícito via AbortSignal para evitar travamentos
 *  - Retry com backoff exponencial para falhas transitórias de rede/DNS
 *  - Classificação de erros para respostas HTTP semânticas
 */

import Anthropic from "@anthropic-ai/sdk";

// ─── Constantes ───────────────────────────────────────────────────────────────

/** Tempo máximo (ms) para cada tentativa de chamada à Anthropic */
const TIMEOUT_MS = 25_000;

/** Quantas vezes tentar antes de desistir */
const MAX_RETRIES = 2;

/** Backoff inicial (ms); dobra a cada tentativa */
const RETRY_BASE_DELAY_MS = 800;

/** Modelo padrão quando não definido em variável de ambiente */
export const ANTHROPIC_MODELO_PADRAO = "claude-haiku-4-5-20251001";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AnthropicMensagem {
  role: "user" | "assistant";
  content: string;
}

export interface AnthropicRespostaErro {
  tipo: "sem_chave" | "dns" | "timeout" | "autorizacao" | "rate_limit" | "servidor" | "desconhecido";
  mensagem: string;
  tentativas: number;
}

// ─── Criação lazy do cliente ──────────────────────────────────────────────────

/**
 * Cria (e NÃO armazena em cache) um novo cliente Anthropic por requisição.
 * Em ambientes serverless, instanciar no módulo causa problemas de DNS no
 * cold start — por isso criamos o cliente apenas quando a rota é chamada.
 */
function criarCliente(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("ANTHROPIC_API_KEY não configurada no ambiente."), { tipo: "sem_chave" });
  }
  return new Anthropic({ apiKey, timeout: TIMEOUT_MS, maxRetries: 0 });
}

// ─── Classificação de erros ───────────────────────────────────────────────────

function classificarErro(err: unknown): AnthropicRespostaErro["tipo"] {
  const msg = String(err).toLowerCase();
  if (msg.includes("api_key") || msg.includes("authentication") || msg.includes("401")) return "autorizacao";
  if (msg.includes("rate") || msg.includes("429")) return "rate_limit";
  if (msg.includes("dns") || msg.includes("lookup") || msg.includes("enotfound") || msg.includes("i/o timeout")) return "dns";
  if (msg.includes("abort") || msg.includes("timeout") || msg.includes("timed out")) return "timeout";
  if (msg.includes("500") || msg.includes("502") || msg.includes("503")) return "servidor";
  return "desconhecido";
}

function deveRetry(tipo: AnthropicRespostaErro["tipo"]): boolean {
  // Não retenta erros permanentes (chave inválida, não autorizado)
  return tipo === "dns" || tipo === "timeout" || tipo === "servidor" || tipo === "desconhecido";
}

// ─── Função principal de chamada com retry ────────────────────────────────────

interface OpcoesCompletionText {
  system?: string;
  mensagens: AnthropicMensagem[];
  modelo?: string;
  maxTokens?: number;
}

/**
 * Executa uma chamada de texto à API Anthropic com retry automático.
 * Lança { tipo, mensagem, tentativas } em caso de falha.
 */
export async function anthropicCompletionText(opcoes: OpcoesCompletionText): Promise<string> {
  const modelo = opcoes.modelo ?? process.env.ANTHROPIC_MODEL ?? ANTHROPIC_MODELO_PADRAO;
  const maxTokens = opcoes.maxTokens ?? 900;

  let ultimoErro: AnthropicRespostaErro | null = null;

  for (let tentativa = 1; tentativa <= MAX_RETRIES + 1; tentativa++) {
    try {
      const cliente = criarCliente();
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const params: Anthropic.MessageCreateParamsNonStreaming = {
          model: modelo,
          max_tokens: maxTokens,
          messages: opcoes.mensagens,
        };
        if (opcoes.system) params.system = opcoes.system;

        const resposta = await cliente.messages.create(params, {
          signal: controller.signal,
        });

        clearTimeout(timer);

        const texto = resposta.content[0].type === "text" ? resposta.content[0].text : "";
        if (!texto.trim()) throw new Error("Anthropic retornou texto vazio.");
        return texto;

      } finally {
        clearTimeout(timer);
      }

    } catch (err) {
      const tipo = classificarErro(err);
      ultimoErro = {
        tipo,
        mensagem: err instanceof Error ? err.message : String(err),
        tentativas: tentativa,
      };

      const ehUltimaTentativa = tentativa >= MAX_RETRIES + 1;
      if (ehUltimaTentativa || !deveRetry(tipo)) break;

      // Backoff exponencial antes da próxima tentativa
      const espera = RETRY_BASE_DELAY_MS * Math.pow(2, tentativa - 1);
      await new Promise((r) => setTimeout(r, espera));
    }
  }

  throw ultimoErro;
}

// ─── Versão fetch direto (fallback sem SDK) ───────────────────────────────────

interface OpcoesFetchDireto {
  system?: string;
  mensagens: AnthropicMensagem[];
  modelo?: string;
  maxTokens?: number;
}

/**
 * Alternativa que usa fetch nativo em vez do SDK.
 * Útil quando o SDK apresenta problemas em determinadas regiões.
 */
export async function anthropicFetchDireto(opcoes: OpcoesFetchDireto): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("ANTHROPIC_API_KEY não configurada."), { tipo: "sem_chave" });
  }

  const modelo = opcoes.modelo ?? process.env.ANTHROPIC_MODEL ?? ANTHROPIC_MODELO_PADRAO;
  const maxTokens = opcoes.maxTokens ?? 900;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const body: Record<string, unknown> = {
      model: modelo,
      max_tokens: maxTokens,
      messages: opcoes.mensagens,
    };
    if (opcoes.system) body.system = opcoes.system;

    const resposta = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      throw new Error(`Anthropic HTTP ${resposta.status}: ${detalhe}`);
    }

    const dados = await resposta.json();
    const texto: string = dados?.content?.[0]?.text ?? "";
    if (!texto.trim()) throw new Error("Anthropic retornou texto vazio.");
    return texto;

  } finally {
    clearTimeout(timer);
  }
}

// ─── Versão STREAMING ──────────────────────────────────────────────────────────

interface OpcoesStream {
  system?: string;
  mensagens: AnthropicMensagem[];
  modelo?: string;
  maxTokens?: number;
}

/**
 * Retorna um ReadableStream com chunks da resposta da Anthropic.
 * Útil para streaming em tempo real no chat.
 */
export function anthropicStream(
  opcoes: OpcoesStream
): ReadableStream<Uint8Array> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    const error = new Error("ANTHROPIC_API_KEY não configurada.");
    throw Object.assign(error, { tipo: "sem_chave" });
  }

  const modelo = opcoes.modelo ?? process.env.ANTHROPIC_MODEL ?? ANTHROPIC_MODELO_PADRAO;
  const maxTokens = opcoes.maxTokens ?? 900;

  const body: Record<string, unknown> = {
    model: modelo,
    max_tokens: maxTokens,
    messages: opcoes.mensagens,
    stream: true,
  };
  if (opcoes.system) body.system = opcoes.system;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          const detail = await response.text();
          throw new Error(`Anthropic HTTP ${response.status}: ${detail}`);
        }

        if (!response.body) {
          throw new Error("Corpo da resposta vazio");
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
              const jsonStr = line.slice(6);
              try {
                const data = JSON.parse(jsonStr);
                if (data.type === "content_block_delta" && data.delta?.type === "text_delta") {
                  controller.enqueue(new TextEncoder().encode(data.delta.text));
                }
              } catch {
                // Skip invalid JSON lines
              }
            }
          }
        }

        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro no stream";
        controller.error(new Error(msg));
      }
    },
  });

  return stream;
}
