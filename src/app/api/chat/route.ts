import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { ALL_AGENTS } from "@/canon/agents/all-agents";
import { anthropicCompletionText, type AnthropicMensagem } from "@/lib/anthropic";
import { routeAgent, type ArchetypeId } from "@/engine/router";
import { db } from "@/lib/db";
import { interactiveDecisions, userProfile } from "@/lib/db/schema";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";
import { profileInteraction } from "@/engine/profiler";

export const runtime = "nodejs";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatRequestBody {
  agentId?: string;
  messages: ChatMessage[];
  dimensoes?: {
    emocional: number;
    intelectual: number;
    moral: number;
  };
  escolhasRecentes?: string[];
  perfilHint?: ArchetypeId;
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

function buildSystemPrompt(agent: (typeof ALL_AGENTS)[number]): string {
  const values = agent.personality.values.join(", ");
  return [
    "Você é um agente da plataforma MENTE.AI.",
    `Nome do agente: ${agent.name}.`,
    `Dimensão: ${agent.dimension}. Nível: ${agent.level}. Facção: ${agent.faction}.`,
    `Tom de voz: ${agent.personality.tone}.`,
    `Valores: ${values}.`,
    `Abordagem do agente: ${agent.personality.approach}`,
    `Missão no laboratório: ${agent.laboratoryTask}`,
    "Regras:",
    "- Responda em português (pt-BR), com clareza e objetividade.",
    "- Mantenha a personalidade e a abordagem do agente em todas as respostas.",
    "- Faça perguntas curtas quando necessário para avançar a conversa.",
    "- Não invente dados pessoais do usuário; peça contexto quando faltar.",
  ].join("\n");
}

const ROUTED_AGENT_FALLBACKS: Record<string, string[]> = {
  axiom: ["logos", "nexus"],
  kaos: ["aurora", "volt", "nexus"],
  terra: ["psyche", "nexus"],
  lyra: ["aurora", "psyche"],
  stratos: ["nexus", "logos"],
  prism: ["aurora", "nexus"],
};

function resolveAgentFromCatalog(preferredAgentId: string): (typeof ALL_AGENTS)[number] | null {
  const direct = ALL_AGENTS.find((a) => a.id === preferredAgentId);
  if (direct) return direct;

  const fallbacks = ROUTED_AGENT_FALLBACKS[preferredAgentId] ?? [];
  for (const fallbackId of fallbacks) {
    const fallback = ALL_AGENTS.find((a) => a.id === fallbackId);
    if (fallback) return fallback;
  }

  return null;
}

// ─── Provedor OpenAI (fallback) ───────────────────────────────────────────────

const OPENAI_TIMEOUT_MS = 25_000;

async function getAuthenticatedUserId(req: NextRequest): Promise<number | null> {
  const token = getAuthCookieFromRequest(req);
  if (!token) return null;
  const payload = await verifyToken(token);
  const userId = payload?.userId ? Number(payload.userId) : NaN;
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

async function updateSilentProfileInBackground(args: {
  userId: number;
  latestUserMessage: string;
  fullHistory: AnthropicMensagem[];
}) {
  try {
    const [profile] = await db
      .select()
      .from(userProfile)
      .where(eq(userProfile.userId, args.userId))
      .limit(1);

    const recentDecisions = await db
      .select({ choiceLabel: interactiveDecisions.choiceLabel })
      .from(interactiveDecisions)
      .where(eq(interactiveDecisions.userId, args.userId))
      .orderBy(desc(interactiveDecisions.id))
      .limit(8);

    const userTexts = args.fullHistory
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .slice(-8);

    const profiled = profileInteraction({
      texto: args.latestUserMessage,
      historico: userTexts,
      escolhasRecentes: recentDecisions.map((d) => d.choiceLabel).reverse(),
      dimensoesAtuais: {
        emocional: profile?.dimensaoEmocional ?? 0,
        intelectual: profile?.dimensaoIntelectual ?? 0,
        moral: profile?.dimensaoMoral ?? 0,
      },
    });

    await db
      .insert(userProfile)
      .values({
        userId: args.userId,
        dimensaoEmocional: profiled.dimensoes.emocional,
        dimensaoIntelectual: profiled.dimensoes.intelectual,
        dimensaoMoral: profiled.dimensoes.moral,
        agentHistory: profile?.agentHistory ?? [],
        updatedAt: new Date(),
      })
      .onDuplicateKeyUpdate({
        set: {
          dimensaoEmocional: profiled.dimensoes.emocional,
          dimensaoIntelectual: profiled.dimensoes.intelectual,
          dimensaoMoral: profiled.dimensoes.moral,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.error("[chat] silent profiler failed:", error);
  }
}

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

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const parsed = body as Partial<ChatRequestBody>;

    let requestedAgentId = isNonEmptyString(parsed.agentId) ? parsed.agentId.trim() : "";
    let routed:
      | {
          archetype: ArchetypeId;
          agentId: string;
          secondaryAgentIds: string[];
        }
      | null = null;

    if (!requestedAgentId) {
      const dimensoes = parsed.dimensoes;
      if (!dimensoes) {
        return NextResponse.json(
          { error: "agentId é obrigatório quando dimensoes não forem enviadas" },
          { status: 400 },
        );
      }

      routed = routeAgent({
        dimensoes,
        escolhasRecentes: Array.isArray(parsed.escolhasRecentes) ? parsed.escolhasRecentes : [],
        perfilHint: parsed.perfilHint ?? null,
      });
      requestedAgentId = routed.agentId;
    }

    const agent = resolveAgentFromCatalog(requestedAgentId);
    if (!agent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });
    }

    const messages = Array.isArray(parsed.messages)
      ? normalizarMensagens(parsed.messages as ChatMessage[])
      : [];

    if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
      return NextResponse.json({ error: "messages inválidas" }, { status: 400 });
    }

    const system = buildSystemPrompt(agent);
    const provider = (process.env.LLM_PROVIDER || "").toLowerCase();

    let assistantText: string;

    // Seleção de provedor: variável LLM_PROVIDER > presença de chave > erro
    if (provider === "openai") {
      assistantText = await callOpenAI({ system, messages });

    } else if (provider === "anthropic" || process.env.ANTHROPIC_API_KEY) {
      // ✅ Usa utilitário central: lazy client + retry + timeout + logs semânticos
      assistantText = await anthropicCompletionText({ system, mensagens: messages });

    } else if (process.env.OPENAI_API_KEY) {
      assistantText = await callOpenAI({ system, messages });

    } else {
      return NextResponse.json(
        { error: "Nenhum provedor configurado. Defina ANTHROPIC_API_KEY ou OPENAI_API_KEY." },
        { status: 503 }
      );
    }

    const userId = await getAuthenticatedUserId(request);
    if (userId) {
      const latestUserMessage = messages[messages.length - 1]?.content ?? "";
      void updateSilentProfileInBackground({
        userId,
        latestUserMessage,
        fullHistory: messages,
      });
    }

    return NextResponse.json({
      message: assistantText,
      routedAgentId: requestedAgentId,
      agentIdUsado: agent.id,
      archetype: routed?.archetype ?? null,
      secondaryAgentIds: routed?.secondaryAgentIds ?? [],
    });

  } catch (error: unknown) {
    const err = error as { tipo?: string; mensagem?: string; tentativas?: number };

    // Erros classificados vindos do utilitário Anthropic
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

    // Erro genérico (OpenAI ou inesperado)
    console.error("[chat] Erro inesperado:", error);
    return NextResponse.json(
      { error: "Falha ao processar chat", details: String(error) },
      { status: 500 }
    );
  }
}
