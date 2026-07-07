import { NextRequest, NextResponse } from "next/server";
import { getAuthCookieFromRequest, verifyToken } from "@/lib/auth";

const VOICE_MAP: Record<string, { name: string; ssmlGender: "MALE" | "FEMALE" }> = {
  nexus: { name: "pt-BR-Neural2-B", ssmlGender: "MALE" },
  volt: { name: "pt-BR-Neural2-B", ssmlGender: "MALE" },
  cipher: { name: "pt-BR-Neural2-B", ssmlGender: "MALE" },
  kaos: { name: "pt-BR-Neural2-B", ssmlGender: "MALE" },
  axiom: { name: "pt-BR-Neural2-B", ssmlGender: "MALE" },
  stratos: { name: "pt-BR-Neural2-B", ssmlGender: "MALE" },
  ethos: { name: "pt-BR-Neural2-B", ssmlGender: "MALE" },
  janus: { name: "pt-BR-Neural2-B", ssmlGender: "MALE" },
  aurora: { name: "pt-BR-Neural2-A", ssmlGender: "FEMALE" },
  lyra: { name: "pt-BR-Neural2-A", ssmlGender: "FEMALE" },
  terra: { name: "pt-BR-Neural2-A", ssmlGender: "FEMALE" },
  prism: { name: "pt-BR-Neural2-A", ssmlGender: "FEMALE" },
};

export async function POST(request: NextRequest) {
  // ── Auth: JWT obrigatório (cookie mente_ai_token) ─────────────────────
  const token = getAuthCookieFromRequest(request);
  if (!token) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const authPayload = await verifyToken(token);
  if (!authPayload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  const userId = Number(authPayload.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json({ error: "Usuário inválido" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { text, agentId } = body as { text?: string; agentId?: string };

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text é obrigatório" }, { status: 400 });
    }

    const voiceConfig = VOICE_MAP[agentId || ""] || VOICE_MAP["nexus"];

    // Decodifica credenciais do Google Cloud TTS a partir da env var base64
    let client: any;
    try {
      const credsBase64 = process.env.GOOGLE_TTS_BASE64 || "";
      if (credsBase64) {
        const credsJson = Buffer.from(credsBase64, "base64").toString("utf-8");
        const credentials = JSON.parse(credsJson);
        const { TextToSpeechClient } = await import("@google-cloud/text-to-speech");
        client = new TextToSpeechClient({ credentials });
      } else {
        const { TextToSpeechClient } = await import("@google-cloud/text-to-speech");
        client = new TextToSpeechClient();
      }
    } catch {
      return NextResponse.json({ error: "Credenciais Google TTS inválidas" }, { status: 503 });
    }

    const [response] = await client.synthesizeSpeech({
      input: { text: text.slice(0, 5000) },
      voice: {
        languageCode: "pt-BR",
        name: voiceConfig.name,
        ssmlGender: voiceConfig.ssmlGender,
      },
      audioConfig: {
        audioEncoding: "MP3",
        speakingRate: 1.0,
        pitch: 0,
      },
    } as any);

    const audioContent = response.audioContent;
    if (!audioContent) {
      return NextResponse.json({ error: "Falha ao gerar áudio" }, { status: 500 });
    }

    const base64 = Buffer.from(audioContent as Uint8Array).toString("base64");
    return NextResponse.json({
      success: true,
      audioContent: `data:audio/mp3;base64,${base64}`,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("[TTS/Google] Erro:", err.message);
    return NextResponse.json(
      { error: "Erro ao sintetizar voz", details: err.message },
      { status: 500 }
    );
  }
}
