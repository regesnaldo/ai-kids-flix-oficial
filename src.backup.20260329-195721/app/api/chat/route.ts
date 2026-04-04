import { NextRequest, NextResponse } from "next/server";
import { ALL_AGENTS } from "@/canon/agents/all-agents";

export const runtime = "nodejs";

type ChatRole = "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface ChatRequestBody {
  agentId: string;
  messages: ChatMessage[];
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && isNonEmptyString(m.content))
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, 4000) }));
}

function buildSystemPrompt(agent: (typeof ALL_AGENTS)[number]): string {
  const tone = agent.personality.tone;
  const values = agent.personality.values.join(", ");
  return [
    "Você é um agente da plataforma MENTE.AI.",
    `Nome do agente: ${agent.name}.`,
    `Dimensão: ${agent.dimension}. Nível: ${agent.level}. Facção: ${agent.faction}.`,
    `Tom de voz: ${tone}.`,
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

async function callOpenAI(args: { system: string; messages: ChatMessage[] }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY não configurada");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
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
    throw new Error(`OpenAI API error: ${details}`);
  }

  const data: any = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!isNonEmptyString(content)) {
    throw new Error("Resposta inválida do OpenAI");
  }
  return content;
}

async function callAnthropic(args: { system: string; messages: ChatMessage[] }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY não configurada");
  }

  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      system: args.system,
      max_tokens: 900,
      messages: args.messages,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Anthropic API error: ${details}`);
  }

  const data: any = await response.json();
  const content = data?.content?.[0]?.text;
  if (!isNonEmptyString(content)) {
    throw new Error("Resposta inválida do Anthropic");
  }
  return content;
}

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

    const messages = Array.isArray(parsed.messages) ? normalizeMessages(parsed.messages as ChatMessage[]) : [];
    if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
      return NextResponse.json({ error: "messages inválidas" }, { status: 400 });
    }

    const system = buildSystemPrompt(agent);
    const provider = (process.env.LLM_PROVIDER || "").toLowerCase();

    let assistantText: string;
    if (provider === "openai") {
      assistantText = await callOpenAI({ system, messages });
    } else if (provider === "anthropic") {
      assistantText = await callAnthropic({ system, messages });
    } else if (process.env.ANTHROPIC_API_KEY) {
      assistantText = await callAnthropic({ system, messages });
    } else if (process.env.OPENAI_API_KEY) {
      assistantText = await callOpenAI({ system, messages });
    } else {
      return NextResponse.json(
        { error: "Nenhum provedor configurado. Defina ANTHROPIC_API_KEY ou OPENAI_API_KEY." },
        { status: 503 }
      );
    }

    return NextResponse.json({ message: assistantText });
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao processar chat", details: String(error) },
      { status: 500 }
    );
  }
}

