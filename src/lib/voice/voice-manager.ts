/**
 * Voice Manager — Orquestrador do fluxo de voz do MENTE.AI
 *
 * Fluxo completo:
 *   Usuário fala → Whisper transcreve → Hume detecta emoção
 *   → LangChain gera resposta → ElevenLabs sintetiza voz
 */

import { transcribeAudio, type TranscriptionResult } from './whisper';
import { detectEmotion, getEmotionPromptHint, type EmotionResult } from './hume';

export interface VoiceInteractionInput {
  audioBlob: Blob;
  agentId: string;
  agentName: string;
  agentVoiceId: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface VoiceInteractionResult {
  transcription: TranscriptionResult;
  emotion: EmotionResult | null;
  agentResponseText: string;
  agentAudioUrl: string | null;
  latencyMs: number;
  error?: string;
}

/**
 * Processa uma interação completa de voz:
 * áudio → texto → emoção → resposta → áudio de resposta
 */
export async function processVoiceInteraction(
  input: VoiceInteractionInput
): Promise<VoiceInteractionResult> {
  const startTime = Date.now();

  // 1. Transcrição e detecção emocional em paralelo (economiza ~1-2s)
  const [transcriptionResult, emotionResult] = await Promise.allSettled([
    transcribeAudio(input.audioBlob),
    detectEmotion(input.audioBlob),
  ]);

  if (transcriptionResult.status === 'rejected') {
    throw new Error(`Falha na transcrição: ${transcriptionResult.reason}`);
  }

  const transcription = transcriptionResult.value;
  const emotion = emotionResult.status === 'fulfilled' ? emotionResult.value : null;
  const emotionHint = getEmotionPromptHint(emotion);

  // 2. Chamar API de chat com contexto emocional
  const chatResponse = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId: input.agentId,
      message: transcription.text,
      emotionHint,
      emotionCategory: emotion?.category ?? 'neutral',
      history: input.conversationHistory ?? [],
    }),
  });

  if (!chatResponse.ok) {
    throw new Error(`Falha no chat: ${chatResponse.status}`);
  }

  const chatData = await chatResponse.json() as { response: string };
  const agentResponseText = chatData.response;

  // 3. Sintetizar voz da resposta com ElevenLabs
  let agentAudioUrl: string | null = null;
  try {
    const ttsResponse = await fetch(
      `/api/tts?text=${encodeURIComponent(agentResponseText)}&voiceId=${input.agentVoiceId}`
    );
    if (ttsResponse.ok) {
      const audioBlob = await ttsResponse.blob();
      agentAudioUrl = URL.createObjectURL(audioBlob);
    }
  } catch (ttsErr) {
    console.warn('[VoiceManager] TTS falhou, retornando só texto:', ttsErr);
  }

  return {
    transcription,
    emotion,
    agentResponseText,
    agentAudioUrl,
    latencyMs: Date.now() - startTime,
  };
}

/**
 * Helper: Captura áudio do microfone por N segundos
 * Retorna o Blob de áudio para passar ao processVoiceInteraction
 */
export async function captureAudioFromMicrophone(
  maxDurationMs = 30_000
): Promise<{ blob: Blob; stop: () => void }> {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
  const chunks: BlobPart[] = [];

  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise((resolve) => {
    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunks, { type: 'audio/webm' });
      resolve({ blob, stop: () => {} });
    };

    // Auto-stop após maxDurationMs
    const timeout = setTimeout(() => recorder.stop(), maxDurationMs);

    const stopFn = () => {
      clearTimeout(timeout);
      recorder.stop();
    };

    recorder.start(250); // chunks a cada 250ms
    resolve({ blob: new Blob(), stop: stopFn });
  });
}
