"use client";

import { useState, useCallback, useRef, useEffect } from "react";

type TTSState = "idle" | "loading" | "playing" | "error";

interface UseTTSReturn {
  state: TTSState;
  play: (text: string, agentId: string) => Promise<void>;
  stop: () => void;
}

const VOICE_MAP: Record<string, string> = {
  nexus: "pNInz6obpgDQGcFmaJgB",
  cipher: "pNInz6obpgDQGcFmaJgB",
  kaos: "pNInz6obpgDQGcFmaJgB",
  aurora: "pNInz6obpgDQGcFmaJgB",
  volt: "pNInz6obpgDQGcFmaJgB",
  ethos: "pNInz6obpgDQGcFmaJgB",
};

export function useTTS(): UseTTSReturn {
  const [state, setState] = useState<TTSState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generationRef = useRef(0);

  // Cleanup crítico: para o áudio quando o componente desmonta
  useEffect(() => {
    return () => {
      generationRef.current++;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      setState("idle");
    };
  }, []);

  const stop = useCallback(() => {
    generationRef.current++;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
      setState("idle");
    }
  }, []);

  const play = useCallback(async (text: string, agentId: string) => {
    const gen = ++generationRef.current;
    stop();

    const voiceId = VOICE_MAP[agentId] || VOICE_MAP["nexus"];

    try {
      setState("loading");

      const res = await fetch("/api/elevenlabs/speak", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice_id: voiceId }),
      });

      if (!res.ok) throw new Error(`TTS ${res.status}`);

      // Se stop() foi chamado durante o fetch, aborta — evita race condition
      if (gen !== generationRef.current) return;

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      if (gen !== generationRef.current) {
        URL.revokeObjectURL(url);
        return;
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
        setState("idle");
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
        if (audioRef.current === audio) {
          audioRef.current = null;
        }
        setState("error");
      };

      await audio.play();
      setState("playing");
    } catch {
      setState("error");
    }
  }, [stop]);

  return { state, play, stop };
}
