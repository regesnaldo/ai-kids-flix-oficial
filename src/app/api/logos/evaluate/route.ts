import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada." }, { status: 500 });
  }

  const { question, answer, episodeContext } = await request.json();

  if (!question || !answer) {
    return NextResponse.json({ error: "question e answer são obrigatórios." }, { status: 400 });
  }

  const systemPrompt = `Você é um avaliador silencioso. Avalie se a resposta demonstra compreensão real do conceito do episódio.
Retorne APENAS: APROVADO ou NOVA_PERGUNTA
Critério: articulação própria + lógica correta.
Não aprove respostas que copiam o texto do episódio.

Contexto do episódio: ${episodeContext || "não informado"}

Pergunta feita: ${question}

Resposta do participante: ${answer}`;

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
        max_tokens: 30,
        system: systemPrompt,
        messages: [{ role: "user", content: "Avalie a resposta." }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Erro desconhecido.");
      return NextResponse.json({ error: `Anthropic API error: ${response.status}`, detail: errorText }, { status: 502 });
    }

    const data = await response.json();
    const verdict = data.content?.[0]?.text?.trim();

    if (verdict !== "APROVADO" && verdict !== "NOVA_PERGUNTA") {
      return NextResponse.json({ verdict: "NOVA_PERGUNTA" });
    }

    return NextResponse.json({ verdict });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
