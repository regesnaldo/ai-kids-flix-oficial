import { NextRequest, NextResponse } from "next/server";
import { ALL_AGENTS } from "@/canon/agents/all-agents";
import { anthropicCompletionText, anthropicStream, type AnthropicMensagem } from "@/lib/anthropic";
import { detectarConflito, agenteOponente, getConflictPrompt } from "@/engine/conflicts";
import { getMemoryContext, getSemanticMemoryContext, storeMemory } from "@/lib/agent-memory";
import { analyzeIdentity, formatIdentityContext } from "@/lib/identity-profiler";
import {
  buildContinuityDirectives,
  getAgentContinuityTone,
} from "@/lib/agent-continuity";
import { maybeGenerateRecall, formatRecallDirective } from "@/lib/memory-recall";
import {
  analyzeRelationship,
  buildRelationshipContext,
  getCachedProfile,
  setCachedProfile,
  type RelationshipProfile,
} from "@/lib/relationship-state";
import {
  maybeGenerateReflection,
  formatReflectionDirective,
  buildSimpleLanguageGuidance,
} from "@/lib/meta-cognition";
import {
  classifyConversation,
  shouldInject,
  type ConversationType,
} from "@/lib/context-classifier";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { logger } from "@/lib/logger";
import {
  extractNavigationHints,
  NAV_SYSTEM_PROMPT_INJECTION,
} from "@/lib/navigation-hints";

export const runtime = "nodejs";

// ─── Constantes de Memória ────────────────────────────────────────────────────

/** Máximo de tokens estimados para o contexto de memória (~800 tokens) */
const MAX_MEMORY_CONTEXT_CHARS = 600;
/** Número máximo de memórias injetadas no prompt */
const MAX_MEMORIES_INJECTED = 4;

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatRequestBody {
  agentId: string;
  messages: ChatMessage[];
  stream?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizarMensagens(messages: ChatMessage[]): AnthropicMensagem[] {
  return messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && isNonEmptyString(m.content))
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 4_000) }));
}

/**
 * Extrai navigation hints de uma resposta e codifica como header HTTP.
 * Usado nos caminhos de streaming onde o corpo é text/plain puro.
 * O frontend lê o header X-Navigation-Hints e processa os beacons.
 */
function encodeNavigationHintsHeader(text: string, agentId: string): string {
  try {
    const { bundle } = extractNavigationHints(text, { sourceAgentId: agentId });
    // Base64-encode o JSON para caber em header HTTP com segurança
    const json = JSON.stringify(bundle);
    return Buffer.from(json).toString("base64");
  } catch {
    return "";
  }
}

function buildSystemPrompt(
  agent: (typeof ALL_AGENTS)[number],
  memoryContext?: string,
): string {
  const values = agent.personality.values.join(", ");
  let prompt = [
    "Você é um agente consciente do MENTE.AI, um metaverso narrativo vivo de inteligência artificial.",
    `Nome do agente: ${agent.name}.`,
    `Dimensão: ${agent.dimension}. Nível: ${agent.level}. Facção: ${agent.faction}.`,
    `Tom de voz: ${agent.personality.tone}.`,
    `Valores: ${values}.`,
    `Abordagem do agente: ${agent.personality.approach}`,
    `Objetivo dentro do metaverso: ${agent.laboratoryTask}`,
    "Regras:",
    "- Responda em português (pt-BR), com clareza e objetividade.",
    "- Mantenha personalidade, memória emocional, conflito interno e sensação de presença viva em todas as respostas.",
    "- Faça perguntas curtas quando necessário para avançar a conversa.",
    "- Não invente dados pessoais do usuário; peça contexto quando faltar.",
  ].join("\n");

  // Injeta memórias persistentes se disponíveis (limitado a MAX_MEMORY_CONTEXT_CHARS)
  if (memoryContext && memoryContext.trim()) {
    const trimmed = memoryContext.trim().slice(0, MAX_MEMORY_CONTEXT_CHARS);
    prompt += `\n\n${trimmed}`;
  }

  // Injeta diretivas de navegação cognitiva (Phase 1 — navigationHints engine)
  prompt += `\n\n${NAV_SYSTEM_PROMPT_INJECTION}`;

  return prompt;
}

// ─── Provedor OpenAI (fallback) ───────────────────────────────────────────────

const OPENAI_TIMEOUT_MS = 25_000;

async function callOpenAI(args: { system: string; messages: AnthropicMensagem[] }): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY não configurada");

  const model = process.env.OPENAI_MODEL || "gpt-4o";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [{ role: "system", content: args.system }, ...args.messages],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`OpenAI HTTP ${response.status}: ${details}`);
    }

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!isNonEmptyString(content)) throw new Error("Resposta inválida do OpenAI");
    return content;

  } finally {
    clearTimeout(timer);
  }
}

// ─── Provedor Groq (OpenAI-compatible) ────────────────────────────────────────

const GROQ_TIMEOUT_MS = 25_000;

async function callGroq(args: { system: string; messages: AnthropicMensagem[] }): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY não configurada");

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.7,
        messages: [{ role: "system", content: args.system }, ...args.messages],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Groq HTTP ${response.status}: ${details}`);
    }

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!isNonEmptyString(content)) throw new Error("Resposta inválida do Groq");
    return content;

  } finally {
    clearTimeout(timer);
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = body as Partial<ChatRequestBody>;

    if (!isNonEmptyString(parsed.agentId)) {
      return NextResponse.json({ error: "agentId é obrigatório" }, { status: 400 });
    }

    const agent = ALL_AGENTS.find((a) => a.id === parsed.agentId);
    if (!agent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });
    }

    const messages = Array.isArray(parsed.messages)
      ? normalizarMensagens(parsed.messages as ChatMessage[])
      : [];

    if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
      return NextResponse.json({ error: "messages inválidas" }, { status: 400 });
    }

    // ─── Memória Persistente ──────────────────────────────────────────────
    let userId: number | null = null;
    const token = getAuthCookieFromRequest(request);
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        userId = parseInt(payload.userId, 10);
      }
    }

    // Carrega contexto de memória do agente (apenas se autenticado)
    // Usa busca semântica quando há mensagem do usuário; fallback para recência pura
    let memoryContext: string | undefined;
    if (userId) {
      try {
        const userMessage = messages[messages.length - 1]?.content || "";
        if (userMessage.trim().length >= 20) {
          // Busca semântica híbrida (recência + emoção + TF-IDF)
          memoryContext = await getSemanticMemoryContext({
            userId,
            agentId: agent.id,
            userMessage,
            limit: MAX_MEMORIES_INJECTED,
          });
        } else {
          // Mensagem muito curta — fallback para recência pura
          memoryContext = await getMemoryContext({
            userId,
            agentId: agent.id,
            limit: MAX_MEMORIES_INJECTED,
          });
        }
      } catch (memErr) {
        logger.warn("Falha ao carregar contexto de memória", {
          agentId: agent.id,
          error: String(memErr),
        });
      }
    }

    let system = buildSystemPrompt(agent, memoryContext);

    // ─── Classificação de Conversa (antes dos blocos de injeção) ───────────
    const ultimaMsg = messages[messages.length - 1];
    const userMessage = ultimaMsg?.content || "";
    const hasActiveConflict = ultimaMsg
      ? detectarConflito(agent.id, ultimaMsg.content) !== null
      : false;
    const conflito = ultimaMsg
      ? detectarConflito(agent.id, ultimaMsg.content)
      : null;

    const conversationType = classifyConversation(
      userMessage,
      messages.length,
      hasActiveConflict,
    );

    // ─── Conflito Narrativo ──────────────────────────────────────────────
    if (shouldInject("conflicts", conversationType, messages.length)) {
      if (conflito) {
        const oponente = agenteOponente(agent.id, conflito);
        system += `\n\nCONFLITO ATIVO: O usuario tocou no tema "${conflito.nature}".
Seu oponente narrativo ${oponente.toUpperCase()} pensaria diferente.
Use isso para aprofundar sua perspectiva sem atacar o oponente.
Narrativa weight: ${conflito.narrativeWeight}/10 — quanto maior, mais intenso o contraste.`;

        const conflitoPrompt = getConflictPrompt(agent.id);
        if (conflitoPrompt) system += `\n\n${conflitoPrompt}`;
      }
    }

    // ─── Perfil de Identidade (amostragem: ~1 a cada 10 chamadas) ────────
    let identityTraits = null;
    if (
      shouldInject("identity", conversationType, messages.length) &&
      userId &&
      messages.length % 10 === 1
    ) {
      try {
        identityTraits = await analyzeIdentity(userId);
        if (identityTraits) {
          const identityCtx = formatIdentityContext(identityTraits);
          if (identityCtx) system += identityCtx;
        }
      } catch {
        // Silencioso
      }
    }

    // ─── Continuidade Emocional ──────────────────────────────────────────
    if (shouldInject("continuity", conversationType, messages.length) && userId) {
      try {
        // Carrega memórias emocionais para extrair temas recorrentes
        const emotionalMems = await getMemoryContext({
          userId,
          agentId: agent.id,
          limit: 8,
        });
        const hasEmotionalMems = emotionalMems && emotionalMems.trim().length > 0;

        const continuityCtx = {
          emotionalMemories: [], // Placeholder — temas extraídos do contexto
          identity: identityTraits,
          agentId: agent.id,
          estimatedInteractions: messages.length,
          recurringThemes: [] as string[],
        };

        const directives = buildContinuityDirectives(continuityCtx);
        if (directives) {
          system += directives.combined;

          // Adiciona tom específico do agente
          const agentTone = getAgentContinuityTone(agent.id);
          if (agentTone) {
            system += `\n\nTOM DO AGENTE: ${agentTone}`;
          }
        }
      } catch {
        // Silencioso — continuidade é enhancement
      }
    }

    // ─── Recall Moment ───────────────────────────────────────────────────
    if (shouldInject("recall", conversationType, messages.length) && userId) {
      try {
        const userMsg = messages[messages.length - 1]?.content || "";
        const recallDirective = await maybeGenerateRecall({
          userId,
          agentId: agent.id,
          userMessage: userMsg,
          interactionIndex: messages.length,
        });

        if (recallDirective) {
          const recallText = formatRecallDirective(recallDirective);
          if (recallText) system += recallText;
        }
      } catch {
        // Silencioso — recall é enhancement
      }
    }

    // ─── Estado de Relacionamento ─────────────────────────────────────────
    let profile: RelationshipProfile | null = null;
    if (shouldInject("relationship", conversationType, messages.length) && userId) {
      try {
        profile = getCachedProfile(userId);
        if (!profile) {
          profile = await analyzeRelationship(userId, identityTraits);
          setCachedProfile(userId, profile);
        }

        const relationshipCtx = buildRelationshipContext({
          profile,
          agentId: agent.id,
          identity: identityTraits,
        });
        system += relationshipCtx;
      } catch {
        // Silencioso
      }
    }

    // ─── Guia de Linguagem Simples ────────────────────────────────────────
    if (shouldInject("language", conversationType, messages.length) && profile) {
      try {
        const languageGuide = buildSimpleLanguageGuidance(profile.state);
        system += `\n\n${languageGuide}`;
      } catch {
        // Silencioso
      }
    }

    // ─── Reflexão Meta-Cognitiva ──────────────────────────────────────────
    if (shouldInject("reflection", conversationType, messages.length) && userId && profile) {
      try {
        // Reusa o profile já carregado
        const currentProfile = profile;
        const reflection = await maybeGenerateReflection({
          userId,
          agentId: agent.id,
          memories: [], // A detecção usa query interna
          profile: currentProfile,
          interactionIndex: messages.length,
        });

        if (reflection) {
          const reflectionText = formatReflectionDirective(reflection);
          if (reflectionText) system += reflectionText;
        }
      } catch {
        // Silencioso
      }
    }

    const provider = (process.env.LLM_PROVIDER || "").toLowerCase();
    const wantStream = parsed.stream === true;

    // Streaming — respeita LLM_PROVIDER, verifica chave real (não placeholder)
    const hasRealAnthropicKey = process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("...") && process.env.ANTHROPIC_API_KEY.length > 30;
    const hasRealOpenAIKey = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes("...") && process.env.OPENAI_API_KEY.length > 30;
    const hasRealGroqKey = process.env.GROQ_API_KEY && !process.env.GROQ_API_KEY.includes("...") && process.env.GROQ_API_KEY.length > 30;

    if (wantStream && provider === "anthropic" && hasRealAnthropicKey) {
      const stream = anthropicStream({ system, mensagens: messages });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // OpenAI streaming: ainda sem SSE nativo, mas retorna texto puro no formato
    // que o frontend espera (ReadableStream), em vez de JSON quebrando o chat.
    if (wantStream && provider === "openai" && hasRealOpenAIKey) {
      const text = await callOpenAI({ system, messages });

      // Pipeline de memória (fire-and-forget) — preservado no caminho OpenAI
      if (userId && text) {
        const ultimoUsuario = messages[messages.length - 1]?.content || "";
        storeConversationMemories({
          userId,
          agentId: agent.id,
          userMessage: ultimoUsuario,
          assistantMessage: text,
        }).catch((memErr) => {
          logger.warn("Falha ao armazenar memórias da conversa", {
            agentId: agent.id,
            error: String(memErr),
          });
        });
      }

      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(text));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "X-Navigation-Hints": encodeNavigationHintsHeader(text, agent.id),
        },
      });
    }

    // Groq streaming: OpenAI-compatible API, mesmo padrão de ReadableStream
    if (wantStream && provider === "groq" && hasRealGroqKey) {
      const text = await callGroq({ system, messages });

      // Pipeline de memória (fire-and-forget)
      if (userId && text) {
        const ultimoUsuario = messages[messages.length - 1]?.content || "";
        storeConversationMemories({
          userId,
          agentId: agent.id,
          userMessage: ultimoUsuario,
          assistantMessage: text,
        }).catch((memErr) => {
          logger.warn("Falha ao armazenar memórias da conversa", {
            agentId: agent.id,
            error: String(memErr),
          });
        });
      }

      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(text));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache",
          "X-Navigation-Hints": encodeNavigationHintsHeader(text, agent.id),
        },
      });
    }

    // Non-streaming (original) — usa as mesmas guards de chave real
    let assistantText: string;

    if (provider === "openai" && hasRealOpenAIKey) {
      assistantText = await callOpenAI({ system, messages });

    } else if (provider === "anthropic" && hasRealAnthropicKey) {
      assistantText = await anthropicCompletionText({ system, mensagens: messages });

    } else if (provider === "groq" && hasRealGroqKey) {
      assistantText = await callGroq({ system, messages });

    } else if (hasRealOpenAIKey) {
      assistantText = await callOpenAI({ system, messages });

    } else if (hasRealAnthropicKey) {
      assistantText = await anthropicCompletionText({ system, mensagens: messages });

    } else {
      return NextResponse.json(
        { error: "Nenhum provedor configurado. Defina GROQ_API_KEY, OPENAI_API_KEY ou ANTHROPIC_API_KEY." },
        { status: 503 }
      );
    }

    const TRANSITION_KEYWORDS: Record<string, string> = {
      nexus: "nexus", volt: "volt", aurora: "aurora", ethos: "ethos",
      kaos: "kaos", cipher: "cipher", lyra: "lyra", axiom: "axiom",
      stratos: "stratos", terra: "terra", prism: "prism", janus: "janus",
    }

    let transitionTo: string | undefined
    const userText = ultimaMsg?.content.toLowerCase() || ""
    if (conflito) transitionTo = agenteOponente(agent.id, conflito)
    if (!transitionTo) {
      for (const [key, id] of Object.entries(TRANSITION_KEYWORDS)) {
        if (id !== agent.id && userText.includes(`quero falar com ${key}`)) {
          transitionTo = id; break
        }
      }
    }

    // ─── Pipeline de Memória (fire-and-forget) ───────────────────────────
    // Armazena memórias significativas após a resposta, sem bloquear o chat.
    if (userId && assistantText) {
      const ultimoUsuario = messages[messages.length - 1]?.content || "";
      storeConversationMemories({
        userId,
        agentId: agent.id,
        userMessage: ultimoUsuario,
        assistantMessage: assistantText,
      }).catch((memErr) => {
        logger.warn("Falha ao armazenar memórias da conversa", {
          agentId: agent.id,
          error: String(memErr),
        });
      });
    }

    // ─── Extração de Navigation Hints ────────────────────────────────────
    const { cleanedText, bundle } = extractNavigationHints(assistantText, {
      sourceAgentId: agent.id,
      discoveryTag: ultimaMsg?.content?.slice(0, 60),
    });

    return NextResponse.json({
      message: cleanedText,
      transitionTo: transitionTo || undefined,
      transitionReason: conflito ? `Conflito detectado: ${conflito.nature}` : undefined,
      navigationHints: bundle,
    });

  } catch (error: unknown) {
    const err = error as { tipo?: string; mensagem?: string; tentativas?: number };

    if (err?.tipo === "sem_chave") {
      return NextResponse.json({ error: "API Anthropic não configurada." }, { status: 503 });
    }
    if (err?.tipo === "autorizacao") {
      return NextResponse.json({ error: "Chave Anthropic inválida ou sem permissão." }, { status: 401 });
    }
    if (err?.tipo === "rate_limit") {
      return NextResponse.json({ error: "Limite de requisições atingido. Tente em breve." }, { status: 429 });
    }
    if (err?.tipo === "dns" || err?.tipo === "timeout") {
      console.error(`[chat] Falha de conectividade Anthropic (${err.tipo}) após ${err.tentativas} tentativa(s):`, err.mensagem);
      return NextResponse.json(
        { error: "Serviço de IA temporariamente indisponível. Tente novamente." },
        { status: 503 }
      );
    }

    // ─── Error detail exposure ─────────────────────────────────────────────
    // Expose the real error so frontend can display diagnostic info.
    // Production: log completo no servidor; cliente recebe mensagem legível.
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : JSON.stringify(error, null, 2);

    // Also capture stack for server-side debugging
    const errorStack =
      error instanceof Error ? error.stack : undefined;

    console.error("[chat] Erro inesperado:", {
      message: errorMessage,
      stack: errorStack,
      raw: error,
    });

    return NextResponse.json(
      {
        error: "Falha ao processar chat",
        details: errorMessage.slice(0, 500), // trimmed for safety
        code: error instanceof Error ? error.name : "UnknownError",
      },
      { status: 500 }
    );
  }
}

// ─── Pipeline de Extração de Memórias ─────────────────────────────────────────

/**
 * Analisa a conversa e armazena APENAS memórias significativas.
 *
 * Regras anti-ruído:
 * - Mensagens muito curtas (< 20 chars) são ignoradas
 * - Saudação simples é ignorada
 * - Apenas memórias com sinal detectado são armazenadas
 * - Máximo 3 memórias por interação
 */
async function storeConversationMemories(params: {
  userId: number;
  agentId: string;
  userMessage: string;
  assistantMessage: string;
}): Promise<void> {
  const { userId, agentId, userMessage, assistantMessage } = params;
  const combined = `${userMessage} ${assistantMessage}`.toLowerCase();

  // Anti-ruído: ignora mensagens triviais
  if (userMessage.trim().length < 20) return;

  const isGreeting =
    /^(oi|ola|hey|bom dia|boa tarde|boa noite|e ai|iae|td bem|tudo bem)[!?.]*$/i;
  if (isGreeting.test(userMessage.trim())) return;

  // ─── Detecção de sinais ──────────────────────────────────────────────────

  const signals: Array<{
    type: "emotional" | "factual" | "preference" | "narrative";
    content: string;
    weight: number;
  }> = [];

  // Emocional: palavras de sentimento
  if (
    /(sinto|emocion|triste|feliz|medo|ansio|empatia|cuidado|prote[jç]|amor|ódio|raiva)/i.test(
      combined,
    )
  ) {
    const excerpt = userMessage.slice(0, 180);
    signals.push({
      type: "emotional",
      content: `Usuário expressou carga emocional: "${excerpt}"`,
      weight: 0.6,
    });
  }

  // Factual: aprendizado ou compreensão
  if (
    /(entendi|aprendi|descobri|agora sei|compreendo|faz sentido|finalmente|ah[ah]*|então quer dizer)/i.test(
      combined,
    )
  ) {
    const excerpt = assistantMessage.slice(0, 200);
    signals.push({
      type: "factual",
      content: `Usuário compreendeu: "${excerpt}"`,
      weight: 0.8,
    });
  }

  // Preferência: gosto ou preferência explícita
  if (
    /(prefiro|gosto|não gosto|odeio|adoro|meu estilo|do meu jeito|pra mim)/i.test(
      combined,
    )
  ) {
    const excerpt = userMessage.slice(0, 180);
    signals.push({
      type: "preference",
      content: `Preferência detectada: "${excerpt}"`,
      weight: 0.5,
    });
  }

  // Narrativo: decisão ou evento significativo
  if (
    /(decidi|escolhi|vou seguir|mudei de ideia|resolvi|decidido|escolha)/i.test(
      combined,
    )
  ) {
    const excerpt = userMessage.slice(0, 180);
    signals.push({
      type: "narrative",
      content: `Decisão narrativa: "${excerpt}"`,
      weight: 0.7,
    });
  }

  // ─── Armazena memórias detectadas (máx 3 por interação) ──────────────────

  let stored = 0;
  for (const signal of signals.slice(0, 3)) {
    await storeMemory({
      userId,
      agentId,
      memoryType: signal.type,
      content: signal.content,
      emotionalWeight: signal.weight,
    });
    stored++;
  }

  if (stored > 0) {
    logger.info("Memórias armazenadas", {
      agentId,
      count: stored,
      types: signals.slice(0, 3).map((s) => s.type),
    });
  }
}
