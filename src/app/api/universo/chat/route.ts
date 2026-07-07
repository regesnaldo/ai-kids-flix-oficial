import { NextRequest, NextResponse } from "next/server";
import { routeAdaptiveNarrative } from "@/engine/router";
import { updateSilentProfile, type InteractionContext } from "@/engine/profiler";
import { ALL_AGENTS } from "@/canon/agents/all-agents";
import { anthropicCompletionText } from "@/lib/anthropic";
import { AGENTS, type AgentId } from "@/canon/agents/canon";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // ── Auth ────────────────────────────────────────────────────────
    const token = getAuthCookieFromRequest(request);
    if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const authPayload = await verifyToken(token);
    if (!authPayload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    const userId = Number(authPayload.userId);

    const body = await request.json();
    const { message, history, agentOverride } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message é obrigatório" }, { status: 400 });
    }

    // Se agentOverride existe, usa esse agente diretamente (universo específico)
    // Caso contrário, usa o roteamento LangChain
    let selectedAgent: string
    let routeDecision: Awaited<ReturnType<typeof routeAdaptiveNarrative>> | null = null

    if (agentOverride) {
      selectedAgent = agentOverride
    } else {
      routeDecision = await routeAdaptiveNarrative({
        userId,
        userText: message,
        currentAgent: "nexus",
      })
      selectedAgent = routeDecision.langchainDecision?.nextAgent ?? "nexus"
    }

    // Fire-and-forget: silent profile tracking não bloqueia a resposta
    const profileContext: InteractionContext = {
      userId,
      choiceLabel: message.slice(0, 255),
      agentId: agentOverride || selectedAgent,
    };
    // Neon wire — executa em background, falha silenciosa
    updateSilentProfile(profileContext).catch(() => {});

    const agent = ALL_AGENTS.find((a) => a.id === selectedAgent);

    if (routeDecision) {
      // routeDecision logged
    }

    if (!agent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });
    }

    const canonAgent = AGENTS[selectedAgent as AgentId]
    const systemPrompt = canonAgent?.cognition?.systemPrompt
      ? [
          canonAgent.cognition.systemPrompt,
          `Tom: ${canonAgent.cognition.tone}.`,
          `Estilo: ${canonAgent.cognition.communicationStyle}.`,
          "Responda em português, mantendo sua personalidade e lembrando do histórico da conversa.",
        ].join("\n\n")
      : [
          `Você é ${agent.name} — ${agent.dimension}.`,
          `Facção: ${agent.faction}. Tom: ${agent.personality.tone}.`,
          agent.personality.approach,
          "Responda em português, mantendo a personalidade do agente e lembrando do histórico da conversa.",
        ].join("\n");

    const messages = [
      ...(history?.slice(-10) || []),
      { role: "user" as const, content: message },
    ];

    const provider = (process.env.LLM_PROVIDER || "").toLowerCase();
    let responseText: string;

    // Prioriza o provider configurado via LLM_PROVIDER.
    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      responseText = await callOpenAI(systemPrompt, messages);
    } else if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
      responseText = await anthropicCompletionText({ system: systemPrompt, mensagens: messages });
    } else if (provider === "groq" && process.env.GROQ_API_KEY) {
      responseText = await callGroq(systemPrompt, messages);
    } else if (process.env.OPENAI_API_KEY) {
      responseText = await callOpenAI(systemPrompt, messages);
    } else if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("...")) {
      responseText = await anthropicCompletionText({ system: systemPrompt, mensagens: messages });
    } else if (process.env.GROQ_API_KEY) {
      responseText = await callGroq(systemPrompt, messages);
    } else {
      const configuredProvider = process.env.LLM_PROVIDER || '(nenhum)';
      const hasOpenAI = !!process.env.OPENAI_API_KEY;
      const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
      const hasGroq = !!process.env.GROQ_API_KEY;
      return NextResponse.json({
        error: "Nenhum provedor LLM configurado",
        details: `LLM_PROVIDER="${configuredProvider}". Chaves disponíveis: OpenAI=${hasOpenAI}, Anthropic=${hasAnthropic}, Groq=${hasGroq}. Configure ao menos uma chave de API nas variáveis de ambiente do Vercel.`,
      }, { status: 503 });
    }

    return NextResponse.json({
      message: responseText,
      agent: selectedAgent,
      archetype: routeDecision?.archetype || 'creative',
      routeReason: routeDecision?.langchainDecision?.reason,
    });

  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    if (process.env.NODE_ENV === 'development') {
      console.error("[universo/chat] Erro detalhado:", {
        message: err.message,
        stack: err.stack?.slice(0, 500),
        cause: (err as any).cause,
      });
    }
    return NextResponse.json(
      {
        error: "Erro ao processar mensagem",
        details: err.message || "Erro desconhecido",
        stack: process.env.NODE_ENV === 'development' ? err.stack?.slice(0, 300) : undefined,
      },
      { status: 500 }
    );
  }
}

async function callOpenAI(system: string, messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY não configurada no ambiente");

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
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`OpenAI HTTP ${response.status}: ${body.slice(0, 300)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Silêncio também é resposta.";
}

async function callGroq(system: string, messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY não configurada");

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Groq HTTP ${response.status}: ${details}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Silêncio também é resposta.";
}