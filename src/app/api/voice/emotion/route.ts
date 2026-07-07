/**
 * POST /api/voice/emotion
 * Proxy seguro para Hume AI — detecta emoção no áudio do usuário
 *
 * Body: FormData com campo 'audio' (Blob)
 * Response: EmotionResult | { emotion: null }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookieFromRequest, verifyToken } from '@/lib/auth';
import { detectEmotion } from '@/lib/voice/hume';

export const runtime = 'nodejs';
export const maxDuration = 30;

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

    const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });
    const emotion = await detectEmotion(audioBlob);

    if (!emotion) {
      // Retorna null sem erro — emoção não detectada é um estado válido
      return NextResponse.json({ emotion: null });
    }

    return NextResponse.json({ emotion });
  } catch (err) {
    console.error('[/api/voice/emotion]', err);
    // Não retorna 500 — falha na emoção não deve quebrar a experiência
    return NextResponse.json({ emotion: null });
  }
}
