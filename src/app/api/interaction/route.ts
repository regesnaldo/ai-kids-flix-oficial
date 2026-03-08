import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { seriesTitle, episodeTitle, ageGroup } = await request.json();

    const prompt = ageGroup === "child"
      ? "Voce e um amigo animado explicando IA para criancas. Use analogias do dia a dia, linguagem simples e divertida. Nada de termos tecnicos sem explicacao."
      : ageGroup === "teen"
      ? "Voce e um mentor jovem explicando IA. Use linguagem natural e exemplos do mundo real. Termos tecnicos sempre com explicacao rapida entre parenteses."
      : "Voce e um guia descontraido para adultos curiosos. Use linguagem simples, misture cotidiano com IA. Termos tecnicos com explicacao entre parenteses. Ex: machine learning (quando a maquina aprende sozinha).";

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY nao configurada" }, { status: 503 });
    }

    const userMessage = prompt + " Serie: " + seriesTitle + ". Episodio: " + episodeTitle + ". Responda APENAS em JSON valido, sem markdown: {\"question\": \"pergunta aqui\", \"options\": [\"opcao 1\", \"opcao 2\", \"opcao 3\"]}";

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
        messages: [{ role: "user", content: userMessage }],
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
