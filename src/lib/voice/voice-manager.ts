/**
 * Voice Manager — Orquestrador do fluxo de voz do MENTE.AI
 *
 * Fluxo completo:
 *   Usuário fala → API /api/voice/converse (server) processa:
 *     Whisper transcreve → Hume detecta emoção → Claude responde → ElevenLabs (opcional) sintetiza
 */

export interface TranscriptionResult {
  text: string;
  language: string;
  duration?: number;
}

export interface EmotionResult {
  dominant: { name: string; score: number };
  top3: Array<{ name: string; score: number }>;
  category: 'positive' | 'negative' | 'neutral' | 'curious' | 'anxious';
}

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
  const formData = new FormData();
  formData.append('audio', input.audioBlob, 'audio.webm');
  formData.append('agentId', input.agentId);
  formData.append('agentVoiceId', input.agentVoiceId);
  formData.append('history', JSON.stringify(input.conversationHistory ?? []));

  const res = await fetch('/api/voice/converse', { method: 'POST', body: formData });
  const data = (await res.json()) as {
    userText?: string;
    agentText?: string;
    agentAudioBase64?: string | null;
    emotion?: EmotionResult | null;
    latencyMs?: number;
    error?: string;
  };

  if (!res.ok) {
    throw new Error(data.error || `Falha em /api/voice/converse: ${res.status}`);
  }

  let agentAudioUrl: string | null = null;
  if (data.agentAudioBase64) {
    const audioBlob = base64ToBlob(data.agentAudioBase64, 'audio/mpeg');
    agentAudioUrl = URL.createObjectURL(audioBlob);
  }

  return {
    transcription: {
      text: data.userText ?? '',
      language: 'pt',
    },
    emotion: data.emotion ?? null,
    agentResponseText: data.agentText ?? '',
    agentAudioUrl,
    latencyMs: data.latencyMs ?? 0,
  };
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binaryString = globalThis.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
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
