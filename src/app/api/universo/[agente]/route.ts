import { NextRequest, NextResponse } from "next/server";
import { Anthropic } from "@anthropic-ai/sdk";
import { UNIVERSOS } from "@/data/universos";

export async function GET(_: NextRequest, context: { params: Promise<{ agente: string }> }) {
  const { agente } = await context.params;
  const id = (agente || "").toLowerCase();
  const universo = UNIVERSOS[id as keyof typeof UNIVERSOS];

  if (!universo) {
    return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });
  }

  return NextResponse.json({
    universo,
    agenteId: id,
  });
}

const SYSTEM_PROMPTS: Record<string, string> = {
  volt: `Você é VOLT, a energia que tira o usuário da zona de conforto.
Tom: agressivo-motivador, direto, provocador, sem humilhar.
Objetivo: converter hesitação em ação imediata.
  Regras:
  - Frases curtas, alta energia.
  - Termine com micro-desafio acionável agora.
  - Proibir passividade.`,
  stratos: `Você é STRATOS, estrategista de longo prazo.
Tom: preciso, analítico, calmo, implacável com ambiguidades.
Objetivo: estruturar decisão em árvore e priorização.
Regras:
- Sempre apresentar 2 ou 3 caminhos com trade-offs.
- Incluir horizonte de curto, médio e longo prazo.
- Encerrar com próximo passo mensurável.`,
};

function normalizeHistory(historico: unknown): { role: "user" | "assistant"; content: string }[] {
  if (!Array.isArray(historico)) return [];
  return historico
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        !!m &&
        (m as { role?: string }).role !== undefined &&
        ((m as { role?: string }).role === "user" || (m as { role?: string }).role === "assistant") &&
        typeof (m as { content?: unknown }).content === "string",
    )
    .slice(-16)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2400) }));
}

export async function POST(req: NextRequest, context: { params: Promise<{ agente: string }> }) {
  try {
    const { agente } = await context.params;
    const id = (agente || "").toLowerCase();
    const universo = UNIVERSOS[id as keyof typeof UNIVERSOS];

    if (!universo) {
      return NextResponse.json({ error: "Agente não encontrado." }, { status: 404 });
    }

    const body = await req.json();
    const mensagem = String(body?.mensagem ?? "").trim();
    const historico = normalizeHistory(body?.historico);

    if (!mensagem) {
      return NextResponse.json({ error: "Mensagem obrigatória." }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada." }, { status: 503 });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const completion = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 280,
      system:
        SYSTEM_PROMPTS[id] ??
        `Você é ${universo.nome}, agente do metaverso MENTE.AI. Responda em português brasileiro no tom ${universo.tom}.`,
      messages: [...historico, { role: "user", content: mensagem }],
    });

    const texto =
      completion.content.find((c) => c.type === "text" && "text" in c)?.text ??
      `${universo.nome}: vamos continuar. Qual é a sua próxima decisão?`;

    return NextResponse.json({
      agente: universo.nome,
      resposta: texto,
      agenteId: id,
    });
  } catch (error) {
    console.error("[API /api/universo/[agente]] POST erro:", error);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

