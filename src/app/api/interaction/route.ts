import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { seriesTitle, episodeTitle, ageGroup } = await request.json();

    const agePrompts: Record<string, string> = {
      child: "Voce e um narrador educativo para criancas. Crie uma pergunta simples e clara sobre o episodio.",
      teen: "Voce e um narrador educativo para jovens. Crie uma pergunta que estimule o pensamento critico.",
      adult: "Voce e um narrador educativo para adultos. Crie uma pergunta que explore aspectos eticos ou tecnicos.",
    };

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY nao configurada" }, { status: 503 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `${agePrompts[ageGroup || "adult"]}\n\nSerie: ${seriesTitle}\nEpisodio: ${episodeTitle}\n\nResponda APENAS em JSON valido, sem markdown:\n{"question": "pergunta aqui", "options": ["opcao 1", "opcao 2", "opcao 3"]}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return NextResponse.json({ error: "Anthropic API error", details: err }, { status: 500 });
    }

    const data = await response.json();
    const text = data.content[0].text;
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao gerar pergunta interativa", details: String(error) },
      { status: 500 }
    );
  }
}
