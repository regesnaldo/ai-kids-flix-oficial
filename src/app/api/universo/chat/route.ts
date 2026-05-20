import { NextRequest, NextResponse } from "next/server";
import { routeAdaptiveNarrative } from "@/engine/router";
import { getUserProfile, updateUserProfile } from "@/engine/profiler";
import { ALL_AGENTS } from "@/canon/agents/all-agents";
import { anthropicCompletionText } from "@/lib/anthropic";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history, userId = 0, agentOverride } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message é obrigatório" }, { status: 400 });
    }

    const userProfile = await getUserProfile(userId);

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

    if (userProfile && routeDecision?.langchainDecision) {
      await updateUserProfile(userId, {
        emotionalScore: routeDecision.langchainDecision.confidence > 0.8 
          ? (userProfile.emotionalScore || 0) + 0.5 
          : userProfile.emotionalScore || 0,
        archetype: routeDecision.archetype,
        currentAgent: routeDecision.langchainDecision.nextAgent,
      });
    }
    const agent = ALL_AGENTS.find((a) => a.id === selectedAgent);

    if (routeDecision) {
      // routeDecision logged
    }

    if (!agent) {
      return NextResponse.json({ error: "Agente não encontrado" }, { status: 404 });
    }

    const systemPrompt = [
      `Você é ${agent.name} — ${agent.dimension}.`,
      `Facção: ${agent.faction}. Tom: ${agent.personality.tone}.`,
      agent.personality.approach,
      "Responda em português, mantendo a personalidade do agente.",
    ].join("\n");

    const messages = [
      ...(history?.slice(-10) || []),
      { role: "user" as const, content: message },
    ];

    const provider = (process.env.LLM_PROVIDER || "").toLowerCase();
    let responseText: string;

    // Prioriza o provider configurado. Só usa Anthropic se for EXPLICITAMENTE o provider.
    if (provider === "openai" && process.env.OPENAI_API_KEY) {
      responseText = await callOpenAI(systemPrompt, messages);
    } else if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
      responseText = await anthropicCompletionText({ system: systemPrompt, mensagens: messages });
    } else if (process.env.OPENAI_API_KEY) {
      responseText = await callOpenAI(systemPrompt, messages);
    } else if (process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_API_KEY.includes("...")) {
      responseText = await anthropicCompletionText({ system: systemPrompt, mensagens: messages });
    } else {
      return NextResponse.json({ error: "Nenhum provedor LLM configurado" }, { status: 503 });
    }

    return NextResponse.json({
      message: responseText,
      agent: selectedAgent,
      archetype: routeDecision?.archetype || 'creative',
      routeReason: routeDecision?.langchainDecision?.reason,
    });

  } catch (error) {
    console.error("[universo/chat] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao processar mensagem" },
      { status: 500 }
    );
  }
}

async function callOpenAI(system: string, messages: Array<{ role: string; content: string }>): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
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
    throw new Error(`OpenAI HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "Silêncio também é resposta.";
}