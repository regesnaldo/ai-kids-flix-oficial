import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const LOGOS_PHRASES: Record<string, string> = {
  apresentacao:
    "Eu sou LOGOS, o Guardião do Conhecimento. Antes de avançar, sua mente será testada. Prove que absorveu o que foi revelado neste episódio.",
  aprovado:
    "Acesso concedido. Sua mente demonstrou compreensão. O portal se abre para o próximo nível.",
  reprovado:
    "O conhecimento ainda não foi integrado. Reflita sobre o que foi ensinado e tente novamente.",
};

const LOGOS_VOICE_ID = "IKne3AIqSdRkR1w3O6dJ";

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json();

    if (!type || !LOGOS_PHRASES[type]) {
      return NextResponse.json(
        { error: "Tipo inválido. Use: apresentacao, aprovado ou reprovado" },
        { status: 400 },
      );
    }

    const text = LOGOS_PHRASES[type];

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${LOGOS_VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.7,
            style: 0.3,
          },
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const headers = new Headers();
    headers.set("Content-Type", "audio/mpeg");

    return new Response(response.body, { status: 200, headers });
  } catch (error) {
    console.error("[LOGOS/TTS]", error);
    return NextResponse.json({ error: "Erro ao gerar áudio" }, { status: 500 });
  }
}
