import { NextRequest, NextResponse } from "next/server";
import { ALL_AGENTS } from "@/canon/agents/all-agents";
import { anthropicCompletionText, type AnthropicMensagem } from "@/lib/anthropic";

export const runtime = "nodejs";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatRequestBody {
  agentId: string;
  messages: ChatMessage[];
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

    return NextResponse.json({ message: assistantText });

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
