/**
 * LabAudioButton.tsx - Botão de áudio do Laboratório MENTE.AI
 * 
 * Usa AudioContext isolado para TTS ElevenLabs para evitar conflitos
 * com o ambientEngine (Tone.js) e outros sistemas de áudio.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface LabAudioButtonProps {
  text: string;
  voiceId?: string;
  agentName?: string;
  className?: string;
}

/**
 * Hook personalizado para TTS com AudioContext isolado
 */
function useIsolatedTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    // Para áudio ElevenLabs
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    
    // Para TTS do navegador
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    setIsPlaying(false);
    setError(null);
  }, []);

  const play = useCallback(async (
    text: string,
    options?: { 
      voiceId?: string;
      useElevenLabs?: boolean;
      onProgress?: (playing: boolean) => void;
    }
  ) => {
    stop();

    const { voiceId, useElevenLabs = false, onProgress } = options || {};

    try {
      // Tenta ElevenLabs primeiro se voiceId estiver disponível
      if (useElevenLabs && voiceId && process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY) {
        // Cria AudioContext isolado para ElevenLabs
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: encodeURIComponent(text),
            voiceId: voiceId,
          }),
        });

        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.status}`);
        }

        const audioBuffer = await response.arrayBuffer();
        const decodedBuffer = await audioContext.decodeAudioData(audioBuffer);
        
        const source = audioContext.createBufferSource();
        source.buffer = decodedBuffer;
        source.connect(audioContext.destination);
        
        await new Promise<void>((resolve, reject) => {
          source.onended = () => {
            setIsPlaying(false);
            onProgress?.(false);
            resolve();
          };
          // AudioBufferSourceNode não tem onerror, usamos try/catch no play
          source.start(0);
          setIsPlaying(true);
          onProgress?.(true);
        });

        await audioContext.close();
        return;
      }

      // Fallback para TTS do navegador
      if ('speechSynthesis' in window) {
        // Aguarda vozes estarem disponíveis
        const voices = window.speechSynthesis.getVoices();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.volume = 1;

        // Seleciona voz em português
        const ptVoice = 
          voices.find(v => v.lang === 'pt-BR') ||
          voices.find(v => v.lang.includes('pt')) ||
          voices.find(v => v.name.toLowerCase().includes('portuguese'));
        
        if (ptVoice) {
          utterance.voice = ptVoice;
        }

        utterance.onstart = () => {
          setIsPlaying(true);
          setError(null);
          onProgress?.(true);
        };
        
        utterance.onend = () => {
          setIsPlaying(false);
          onProgress?.(false);
        };
        
        utterance.onerror = (event) => {
          console.error('Erro TTS:', event);
          setError(event.error);
          setIsPlaying(false);
          onProgress?.(false);
        };

        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        return;
      }

      // Sem suporte a TTS
      throw new Error('Speech synthesis não suportado neste navegador');

    } catch (err) {
      console.error('Erro ao tocar áudio:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setIsPlaying(false);
      onProgress?.(false);
    }
  }, [stop]);

  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { isPlaying, error, play, stop };
}

/**
 * Botão de áudio para o Laboratório
 * 
 * Recursos:
 * - AudioContext isolado para ElevenLabs
 * - Fallback para SpeechSynthesis API
 * - Tratamento robusto de erros
 * - Indicador visual de estado
 */
export default function LabAudioButton({ 
  text, 
  voiceId, 
  agentName = 'NEXUS',
  className = ''
}: LabAudioButtonProps) {
  const { isPlaying, error, play, stop } = useIsolatedTTS();
  const [showFallback, setShowFallback] = useState(false);

  const handleToggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      // Tenta ElevenLabs primeiro, fallback para TTS
      play(text, { 
        voiceId, 
        useElevenLabs: !!voiceId,
        onProgress: (playing) => {
          if (!playing && error) {
            setShowFallback(true);
          }
        }
      });
    }
  }, [isPlaying, text, voiceId, play, stop, error]);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <button
        onClick={handleToggle}
        disabled={isPlaying && !error}
        className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all
          ${isPlaying 
            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        aria-label={isPlaying ? 'Parar áudio' : 'Ouvir introdução'}
        title={isPlaying ? 'Parar áudio' : 'Ouvir introdução'}
      >
        {isPlaying ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Tocando...</span>
          </>
        ) : error ? (
          <>
            <VolumeX className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300">Erro no áudio</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span className="text-sm">Ouvir {agentName}</span>
          </>
        )}
      </button>

      {error && (
        <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded px-2 py-1">
          {error}. Verifique as permissões de áudio do navegador.
        </div>
      )}
    </div>
  );
}
