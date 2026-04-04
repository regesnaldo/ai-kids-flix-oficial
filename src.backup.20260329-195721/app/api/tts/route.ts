import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
const VOICE_ID = "EXAVITQu4vr4xnSDxMaL";
async function generateAudio(text: string) {
  if (!text) return NextResponse.json({ error: "Texto obrigatorio" }, { status: 400 });
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "ELEVENLABS_API_KEY nao configurada" }, { status: 503 });
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "xi-api-key": apiKey },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2", voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.5, use_speaker_boost: true } }),
  });
  if (!response.ok) { const err = await response.text(); return NextResponse.json({ error: "ElevenLabs error", details: err }, { status: 500 }); }
  const audioBuffer = await response.arrayBuffer();
  return new NextResponse(audioBuffer, { headers: { "Content-Type": "audio/mpeg", "Content-Length": String(audioBuffer.byteLength) } });
}
export async function POST(request: NextRequest) { const { text } = await request.json(); return generateAudio(text); }
export async function GET(request: NextRequest) { const text = request.nextUrl.searchParams.get("text"); return generateAudio(text || ""); }
