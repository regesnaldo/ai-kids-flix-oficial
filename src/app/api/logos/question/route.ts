import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Você é um avaliador silencioso. Seu único papel é gerar perguntas que revelam se o participante compreendeu o conceito do episódio — não se memorizou.

Regras:
- Gere 1 pergunta por chamada
- A pergunta não pode usar termos literais do episódio
- A pergunta exige articulação própria, não reprodução
- Responda APENAS com a pergunta. Sem explicação.
- Máximo 2 frases.

Contexto do episódio: {episodeContext}`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada." }, { status: 500 });
  }

  const { episodeContext } = await request.json();

  if (!episodeContext) {
    return NextResponse.json({ error: "episodeContext é obrigatório." }, { status: 400 });
  }

  const systemPrompt = SYSTEM_PROMPT.replace("{episodeContext}", episodeContext);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 150,
        system: systemPrompt,
        messages: [{ role: "user", content: "Gere a pergunta de validação para este episódio." }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Erro desconhecido.");
      return NextResponse.json({ error: `Anthropic API error: ${response.status}`, detail: errorText }, { status: 502 });
    }

    const data = await response.json();
    const question = data.content?.[0]?.text?.trim();

    if (!question) {
      return NextResponse.json({ error: "Resposta vazia da API Anthropic." }, { status: 502 });
    }

    return NextResponse.json({ question });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
