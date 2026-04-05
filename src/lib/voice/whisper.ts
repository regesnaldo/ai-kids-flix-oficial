/**
 * Whisper Client — OpenAI Speech-to-Text
 * Transcreve áudio do usuário para texto em PT-BR
 */

import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY não configurada no .env.local');
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export interface TranscriptionResult {
  text: string;
  language: string;
  duration?: number;
}

/**
 * Transcreve um blob de áudio para texto usando Whisper
 * @param audioBlob - Áudio capturado do microfone (webm/mp4/ogg)
 * @param language - Código do idioma (padrão: 'pt' para português)
 */
export async function transcribeAudio(
  audioBlob: Blob,
  language = 'pt'
): Promise<TranscriptionResult> {
  const openai = getOpenAIClient();

  // Limitar tamanho: máx 25MB (limite Whisper) ou 30s de áudio
  if (audioBlob.size > 25 * 1024 * 1024) {
    throw new Error('Áudio muito longo. Máximo: 30 segundos.');
  }

  const file = new File([audioBlob], 'audio.webm', { type: audioBlob.type || 'audio/webm' });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language,
    response_format: 'verbose_json',
  });

  return {
    text: transcription.text,
    language: transcription.language ?? language,
    duration: transcription.duration ?? undefined,
  };
}
