/**
 * POST /api/voice/converse
 * Endpoint unificado: áudio → transcrição + emoção → resposta do agente → TTS
 *
 * Este é o endpoint principal — o frontend envia o áudio uma vez e recebe
 * a resposta completa (texto + URL de áudio).
 *
 * Body: FormData
 *   - audio: File (blob do microfone)
 *   - agentId: string
 *   - agentVoiceId: string
 *   - history: string (JSON com array de mensagens)
 *
 * Response: {
 *   userText: string,
 *   agentText: string,
 *   agentAudioBase64: string | null,
 *   emotion: EmotionResult | null,
 *   latencyMs: number
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/voice/whisper';
import { detectEmotion, getEmotionPromptHint } from '@/lib/voice/hume';
import { ALL_AGENTS } from '@/canon/agents/all-agents';

export const runtime = 'nodejs';
export const maxDuration = 45;

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File | null;
    const agentId = formData.get('agentId') as string;
    const agentVoiceId = formData.get('agentVoiceId') as string;
    const historyRaw = formData.get('history') as string | null;

    if (!audioFile || !agentId) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: audio, agentId' },
        { status: 400 }
      );
    }

    const audioBlob = new Blob([await audioFile.arrayBuffer()], { type: audioFile.type });
    const history = historyRaw ? JSON.parse(historyRaw) as Array<{ role: string; content: string }> : [];

    // 1. Transcrição + emoção em paralelo
    const [transcriptionResult, emotionResult] = await Promise.allSettled([
      transcribeAudio(audioBlob),
      detectEmotion(audioBlob),
    ]);

    if (transcriptionResult.status === 'rejected') {
      return NextResponse.json(
        { error: `Falha na transcrição: ${transcriptionResult.reason}` },
        { status: 502 }
      );
    }

    const transcription = transcriptionResult.value;
    const emotion = emotionResult.status === 'fulfilled' ? emotionResult.value : null;
    const emotionHint = getEmotionPromptHint(emotion);

    // 2. Buscar agente
    const agent = ALL_AGENTS.find((a) => a.id === agentId);
    const agentSystemPrompt = agent
      ? `Você é ${agent.name}, agente ${agent.dimension} nível ${agent.level} (${agent.faction}) do metaverso MENTE.AI. ${agent.personality.approach}`
      : `Você é ${agentId}, um agente do metaverso MENTE.AI.`;

    // 3. Chamar Claude (Haiku) com contexto emocional
    const { Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const systemWithEmotion = emotionHint
      ? `${agentSystemPrompt}\n\n[CONTEXTO EMOCIONAL]: ${emotionHint}`
      : agentSystemPrompt;

    const messages = [
      ...history.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: transcription.text },
    ];

    const completion = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 300,
      system: systemWithEmotion,
      messages,
    });

    const agentText =
      completion.content[0].type === 'text' ? completion.content[0].text : '';

    // 4. TTS com ElevenLabs (opcional — não bloqueia se falhar)
    let agentAudioBase64: string | null = null;
    const voiceId = agentVoiceId || process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID_DEFAULT;

    if (voiceId && process.env.ELEVENLABS_API_KEY) {
      try {
        const ttsRes = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': process.env.ELEVENLABS_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: agentText,
              model_id: 'eleven_multilingual_v2',
              voice_settings: { stability: 0.5, similarity_boost: 0.75 },
            }),
          }
        );

        if (ttsRes.ok) {
          const buffer = Buffer.from(await ttsRes.arrayBuffer());
          agentAudioBase64 = buffer.toString('base64');
        }
      } catch (ttsErr) {
        console.warn('[/api/voice/converse] TTS falhou (não crítico):', ttsErr);
      }
    }

    return NextResponse.json({
      userText: transcription.text,
      agentText,
      agentAudioBase64,
      emotion,
      latencyMs: Date.now() - startTime,
    });
  } catch (err) {
    console.error('[/api/voice/converse]', err);
    const message = err instanceof Error ? err.message : 'Erro interno';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
