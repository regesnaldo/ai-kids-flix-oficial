/**
 * POST /api/voice/transcribe
 * Proxy seguro para o Whisper (OpenAI) — mantém a API key no servidor
 *
 * Body: FormData com campo 'audio' (Blob)
 * Response: { text: string, language: string, duration?: number }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookieFromRequest, verifyToken } from '@/lib/auth';
import { transcribeAudio } from '@/lib/voice/whisper';

export const runtime = 'nodejs';
export const maxDuration = 30; // 30s timeout (limite Vercel Hobby)

export async function POST(req: NextRequest) {
  // ── Auth: JWT obrigatório (cookie mente_ai_token) ─────────────────────
  const token = getAuthCookieFromRequest(req);
  if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  const authPayload = await verifyToken(token);
  if (!authPayload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  const userId = Number(authPayload.userId);
  if (!Number.isInteger(userId) || userId <= 0) {
    return NextResponse.json({ error: 'Usuário inválido' }, { status: 401 });
  }
  void userId; // auth gate

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;

    if (!audioFile) {
      return NextResponse.json({ error: 'Campo "audio" obrigatório' }, { status: 400 });
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return NextResponse.json({ error: 'Áudio excede 25MB' }, { status: 413 });
    }

    const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });
    const result = await transcribeAudio(audioBlob);

    return NextResponse.json(result);
  } catch (err) {
    console.error('[/api/voice/transcribe]', err);
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
