/**
 * Hume AI Client — Detecção Emocional por Voz
 * Analisa o áudio do usuário e retorna o estado emocional detectado
 * Docs: https://dev.hume.ai/docs
 */

export type EmotionName =
  | 'Admiration' | 'Adoration' | 'Aesthetic Appreciation' | 'Amusement'
  | 'Anger' | 'Anxiety' | 'Awe' | 'Awkwardness' | 'Boredom'
  | 'Calmness' | 'Concentration' | 'Confusion' | 'Contemplation'
  | 'Contempt' | 'Contentment' | 'Craving' | 'Curiosity'
  | 'Desire' | 'Determination' | 'Disappointment' | 'Disgust'
  | 'Distress' | 'Doubt' | 'Ecstasy' | 'Embarrassment'
  | 'Empathic Pain' | 'Enthusiasm' | 'Entrancement' | 'Envy'
  | 'Excitement' | 'Fear' | 'Gratitude' | 'Guilt' | 'Horror'
  | 'Interest' | 'Joy' | 'Love' | 'Nostalgia' | 'Pain'
  | 'Pride' | 'Realization' | 'Relief' | 'Romance' | 'Sadness'
  | 'Satisfaction' | 'Shame' | 'Surprise (negative)' | 'Surprise (positive)'
  | 'Sympathy' | 'Tiredness' | 'Triumph';

export interface EmotionScore {
  name: EmotionName;
  score: number; // 0.0 a 1.0
}

export interface EmotionResult {
  dominant: EmotionScore;
  top3: EmotionScore[];
  raw: EmotionScore[];
  // Mapeamento simplificado para o agente
  category: 'positive' | 'negative' | 'neutral' | 'curious' | 'anxious';
}

// Mapeamento de emoções para categorias que o agente pode usar
const EMOTION_CATEGORY_MAP: Partial<Record<EmotionName, EmotionResult['category']>> = {
  Curiosity: 'curious',
  Interest: 'curious',
  Enthusiasm: 'positive',
  Excitement: 'positive',
  Joy: 'positive',
  Contentment: 'positive',
  Satisfaction: 'positive',
  Anxiety: 'anxious',
  Fear: 'anxious',
  Doubt: 'anxious',
  Sadness: 'negative',
  Distress: 'negative',
  Anger: 'negative',
  Disgust: 'negative',
  Boredom: 'negative',
};

function categorizeEmotion(name: EmotionName): EmotionResult['category'] {
  return EMOTION_CATEGORY_MAP[name] ?? 'neutral';
}

/**
 * Detecta emoção em um blob de áudio usando Hume AI
 * Retorna as emoções dominantes e a categoria simplificada
 */
export async function detectEmotion(audioBlob: Blob): Promise<EmotionResult | null> {
  const apiKey = process.env.HUME_API_KEY;
  if (!apiKey) {
    console.warn('[Hume] HUME_API_KEY não configurada — emoção não detectada');
    return null;
  }

  try {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append(
      'models',
      JSON.stringify({ prosody: { identify_speakers: false } })
    );

    const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
      method: 'POST',
      headers: { 'X-Hume-Api-Key': apiKey },
      body: formData,
    });

    if (!response.ok) {
      console.error('[Hume] Erro na API:', response.status, await response.text());
      return null;
    }

    const job = await response.json() as { job_id: string };
    const predictions = await pollJobResult(job.job_id, apiKey);

    if (!predictions) return null;

    // Extrair emoções do prosody model
    const humeData = predictions as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const emotions: EmotionScore[] = humeData?.results?.predictions?.[0]
      ?.models?.prosody?.grouped_predictions?.[0]
      ?.predictions?.[0]?.emotions ?? [];

    if (!emotions.length) return null;

    const sorted = [...emotions].sort((a, b) => b.score - a.score);
    const top3 = sorted.slice(0, 3) as EmotionScore[];
    const dominant = top3[0];

    return {
      dominant,
      top3,
      raw: emotions as EmotionScore[],
      category: categorizeEmotion(dominant.name),
    };
  } catch (err) {
    console.error('[Hume] Erro inesperado:', err);
    return null;
  }
}

/** Polling para aguardar resultado do job Hume (processamento assíncrono) */
async function pollJobResult(
  jobId: string,
  apiKey: string,
  maxAttempts = 10,
  intervalMs = 800
): Promise<Record<string, unknown> | null> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, intervalMs));

    const res = await fetch(`https://api.hume.ai/v0/batch/jobs/${jobId}/predictions`, {
      headers: { 'X-Hume-Api-Key': apiKey },
    });

    if (res.ok) {
      return await res.json() as Record<string, unknown>;
    }

    if (res.status !== 400) break; // 400 = ainda processando
  }
  return null;
}

/**
 * Versão rápida via EVI (Hume Empathic Voice Interface) para streaming em tempo real
 * Use quando quiser latência < 1s (requer WebSocket)
 * Esta versão usa o endpoint de batch (mais simples, latência ~2-3s)
 */
export function getEmotionPromptHint(emotion: EmotionResult | null): string {
  if (!emotion) return '';

  const hints: Record<EmotionResult['category'], string> = {
    curious:  'O usuário está curioso e engajado. Seja detalhado e instigue ainda mais a curiosidade.',
    positive: 'O usuário está entusiasmado. Mantenha a energia alta e celebre o progresso.',
    anxious:  'O usuário parece ansioso ou inseguro. Seja gentil, encorajador e simplifique.',
    negative: 'O usuário parece frustrado ou entediado. Mude a abordagem — seja mais direto e prático.',
    neutral:  'O usuário está calmo. Mantenha o ritmo natural da conversa.',
  };

  return hints[emotion.category];
}
