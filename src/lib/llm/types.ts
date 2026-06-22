/**
 * ─── LLM LAYER — TYPES ─────────────────────────────────────────────────
 *
 * Tipos unificados de request/response para a camada LLM centralizada.
 * Nenhum arquivo fora de src/lib/llm/** deve instanciar SDKs ou chamar
 * fetch para api.anthropic/openai/groq/deepseek.com — use generateLLM()/streamLLM().
 */

/** Provedores suportados pela camada LLM. */
export type LLMProviderName = "anthropic" | "openai" | "groq" | "deepseek";

/** Modo de resolução de provider: específico ou "auto" (respeita LLM_PROVIDER env). */
export type LLMProviderMode = LLMProviderName | "auto";

/** Mensagem no formato unificado (compatível com OpenAI e Anthropic). */
export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Opções de uma chamada LLM. */
export interface LLMGenerateOptions {
  /** Provider específico. "auto" respeita process.env.LLM_PROVIDER, fallback para a 1ª key válida. */
  provider?: LLMProviderMode;
  /** Override do modelo default do provider. */
  model?: string;
  /** Prompt de sistema (vira role "system" no OpenAI-compat; field `system` no Anthropic). */
  system?: string;
  /** Mensagens da conversa (sem a de system — use `system`). */
  messages: LLMMessage[];
  /** Temperatura (0-2). Default por adapter. */
  temperature?: number;
  /** Máximo de tokens de saída. */
  maxTokens?: number;
  /** Identificador do usuário para rate-limit + cost-tracker. Omitir => "anonymous". */
  userId?: string | number;
  /** Rota/origem da chamada (ex: "api/chat") para observabilidade de custo. */
  route?: string;
  /** Força resposta em JSON (response_format json_object no OpenAI-compat). */
  responseFormat?: "json";
  /** Timeout por chamada em ms. Default por adapter. */
  timeoutMs?: number;
}

/** Resultado unificado de uma chamada LLM. */
export interface LLMResult {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  provider: LLMProviderName;
  model: string;
}

// ─── Erros tipados ──────────────────────────────────────────────────────

/** Lançado quando o rate-limit (por usuário ou global) é excedido. */
export class LLMRateLimitError extends Error {
  readonly scope: "user" | "global";
  readonly userId: string;
  constructor(scope: "user" | "global", userId: string, message?: string) {
    super(
      message ??
        `Rate limit LLM excedido (scope=${scope}, user=${userId}). Tente novamente em alguns segundos.`,
    );
    this.name = "LLMRateLimitError";
    this.scope = scope;
    this.userId = userId;
  }
}

/** Lançado quando o provider retorna erro (HTTP não-2xx, rede, timeout, chave inválida). */
export class LLMProviderError extends Error {
  readonly provider: LLMProviderName;
  readonly status: number;
  readonly tipo: "sem_chave" | "autorizacao" | "rate_limit" | "dns" | "timeout" | "servidor" | "desconhecido";
  constructor(
    provider: LLMProviderName,
    status: number,
    tipo: LLMProviderError["tipo"],
    message: string,
  ) {
    super(message);
    this.name = "LLMProviderError";
    this.provider = provider;
    this.status = status;
    this.tipo = tipo;
  }
}
