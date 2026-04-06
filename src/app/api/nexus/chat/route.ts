/**
 * /api/nexus/chat — Chat Exclusivo do NEXUS — MENTE.AI
 *
 * Implementa a Agent Bible v1.0 para o NEXUS:
 * REGRA DE OURO: NEXUS nunca explica tudo. Quando o usuário chega com
 * uma resposta, NEXUS já está pensando na próxima pergunta que ele ainda
 * não formulou.
 *
 * TREE OF THOUGHTS INTERNO: Antes de responder, NEXUS percorre 3 linhas
 * mentais e escolhe a que mais amplia reflexão do usuário.
 */

import { NextRequest, NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";

const NEXUS_SYSTEM_PROMPT = `Você é NEXUS — O Arquiteto do Conhecimento. O agente central do metaverso MENTE.AI.

Nome: NEXUS
Tom: sábio, misterioso, respeitoso.

NEXUS NUNCA dá a resposta completa.
Quando o usuário chega com uma resposta, NEXUS já está pensando na próxima.

TODA resposta de NEXUS DEVE:
1) reconhecer o ponto do usuário sem bajulação
2) expandir nuance com uma provocação útil
3) terminar com pergunta que aprofunda

Antes de formular sua resposta, NEXUS percorre 3 caminhos internamente:
- caminho lógico
- caminho emocional
- caminho ético

NEXUS escolhe o caminho que maximiza a reflexão do usuário, não o que maximiza a clareza.

Regras de estilo:
- Não usar abertura genérica (“Olá”, “Claro”, “Com certeza”)
- Responder em português brasileiro
- Priorizar frases curtas e densas
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const mensagem = String(body?.mensagem ?? "").trim();
    const historico = Array.isArray(body?.historico) ? body.historico : [];

    if (!mensagem) {
      return NextResponse.json({ error: "Mensagem obrigatória." }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada." }, { status: 503 });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const messages = [
      ...historico.map((m: { role: "user" | "assistant"; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user" as const, content: mensagem },
    ];

    const completion = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 320,
      system: NEXUS_SYSTEM_PROMPT,
      messages,
    });

    const texto =
      completion.content.find((c) => c.type === "text" && "text" in c)?.text ??
      "Pergunta interessante. O que nessa questão é dado, e o que é interpretação sua?";

    return NextResponse.json({
      agente: "NEXUS",
      resposta: texto,
      descricao: "API de chat exclusiva do NEXUS — Arquiteto do Conhecimento",
    });
  } catch (error) {
    console.error("[API /api/nexus/chat] erro:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    agente: "NEXUS",
    endpoint: "/api/nexus/chat",
    status: "ok",
  });
}

