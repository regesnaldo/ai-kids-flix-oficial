'use client';

/**
 * VoiceInputButton — Botão de microfone com animação de onda sonora
 * Captura áudio do usuário e envia para o endpoint /api/voice/converse
 */

import { useState, useRef, useCallback } from 'react';

export type VoiceState = 'idle' | 'requesting' | 'recording' | 'processing' | 'error';

interface VoiceInputButtonProps {
  agentId: string;
  agentVoiceId?: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  onTranscription?: (text: string) => void;
  onResponse?: (result: VoiceConverseResult) => void;
  onError?: (msg: string) => void;
  disabled?: boolean;
  className?: string;
}

export interface VoiceConverseResult {
  userText: string;
  agentText: string;
  agentAudioBase64: string | null;
  emotion: {
    dominant: { name: string; score: number };
    category: 'positive' | 'negative' | 'neutral' | 'curious' | 'anxious';
  } | null;
  latencyMs: number;
}

const MAX_RECORDING_MS = 30_000;

export default function VoiceInputButton({
  agentId,
  agentVoiceId = '',
  conversationHistory = [],
  onTranscription,
  onResponse,
  onError,
  disabled = false,
  className = '',
}: VoiceInputButtonProps) {
  const [state, setState] = useState<VoiceState>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopRecording = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const startRecording = useCallback(async () => {
    if (state !== 'idle') return;

    setState('requesting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : 'audio/webm',
      });

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        setState('processing');

        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'audio.webm');
          formData.append('agentId', agentId);
          formData.append('agentVoiceId', agentVoiceId);
          formData.append('history', JSON.stringify(conversationHistory));

          const res = await fetch('/api/voice/converse', {
            method: 'POST',
            body: formData,
          });

          if (!res.ok) throw new Error(`Erro ${res.status}`);

          const result = await res.json() as VoiceConverseResult;

          onTranscription?.(result.userText);
          onResponse?.(result);

          // Tocar áudio de resposta
          if (result.agentAudioBase64) {
            const binary = atob(result.agentAudioBase64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const blob = new Blob([bytes], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play().catch(console.warn);
            audio.onended = () => URL.revokeObjectURL(url);
          }

          setState('idle');
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Erro no processamento';
          onError?.(msg);
          setState('error');
          setTimeout(() => setState('idle'), 3000);
        }
      };

      recorder.start(250);
      setState('recording');

      // Auto-stop após MAX_RECORDING_MS
      timeoutRef.current = setTimeout(stopRecording, MAX_RECORDING_MS);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao acessar microfone';
      onError?.(msg);
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }, [state, agentId, agentVoiceId, conversationHistory, onTranscription, onResponse, onError, stopRecording]);

  const handleClick = () => {
    if (state === 'idle') startRecording();
    else if (state === 'recording') stopRecording();
  };

  const stateConfig: Record<VoiceState, { label: string; color: string; pulse: boolean }> = {
    idle:       { label: 'Falar', color: 'bg-violet-600 hover:bg-violet-500', pulse: false },
    requesting: { label: 'Aguarde...', color: 'bg-gray-500', pulse: false },
    recording:  { label: 'Parar', color: 'bg-red-600 hover:bg-red-500', pulse: true },
    processing: { label: 'Processando...', color: 'bg-amber-600', pulse: true },
    error:      { label: 'Erro', color: 'bg-red-800', pulse: false },
  };

  const cfg = stateConfig[state];

  return (
    <button
      onClick={handleClick}
      disabled={disabled || state === 'requesting' || state === 'processing'}
      className={[
        'relative flex items-center gap-2 px-4 py-2 rounded-full',
        'text-white text-sm font-medium transition-all duration-200',
        cfg.color,
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
      aria-label={cfg.label}
    >
      {/* Anel pulsante durante gravação */}
      {cfg.pulse && (
        <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-current" />
      )}

      {/* Ícone de microfone */}
      <MicIcon state={state} />
      <span>{cfg.label}</span>

      {/* Indicador de onda durante gravação */}
      {state === 'recording' && <SoundWave />}
    </button>
  );
}

function MicIcon({ state }: { state: VoiceState }) {
  if (state === 'processing') {
    return (
      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    );
  }
  if (state === 'recording') {
    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="2" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
      <path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.08A7 7 0 0 0 19 10z" />
    </svg>
  );
}

function SoundWave() {
  return (
    <span className="flex items-end gap-0.5 h-4">
      {[1, 2, 3, 2, 1].map((h, i) => (
        <span
          key={i}
          className="w-0.5 bg-white rounded-full animate-pulse"
          style={{
            height: `${h * 4}px`,
            animationDelay: `${i * 100}ms`,
            animationDuration: '600ms',
          }}
        />
      ))}
    </span>
  );
}
