/**
 * Whisper Client — OpenAI Speech-to-Text
 * Transcreve áudio do usuário para texto em PT-BR
 */

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
  // Limitar tamanho: máx 25MB (limite Whisper) ou 30s de áudio
  if (audioBlob.size > 25 * 1024 * 1024) {
    throw new Error('Áudio muito longo. Máximo: 30 segundos.');
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada no .env.local');
  }

  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', language);
  formData.append('response_format', 'verbose_json');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Whisper falhou (${res.status}): ${body || res.statusText}`);
  }

  const transcription = (await res.json()) as {
    text: string;
    language?: string;
    duration?: number;
  };

  return {
    text: transcription.text,
    language: transcription.language ?? language,
    duration: transcription.duration ?? undefined,
  };
}
