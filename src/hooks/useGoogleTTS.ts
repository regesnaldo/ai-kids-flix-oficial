"use client";

import { useState, useCallback, useRef, useEffect } from "react";

type TTSState = "idle" | "loading" | "playing" | "error";

interface UseTTSReturn {
  state: TTSState;
  play: (text: string, agentId: string) => Promise<void>;
  stop: () => void;
}

export function useGoogleTTS(): UseTTSReturn {
  const [state, setState] = useState<TTSState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const generationRef = useRef(0);

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

    try {
      setState("loading");

      const res = await fetch("/api/tts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, agentId }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(`Google TTS ${res.status}: ${errText.slice(0, 200)}`);
      }

      const data = await res.json();
      if (!data.success || !data.audioContent) {
        throw new Error("Resposta sem áudio");
      }

      if (gen !== generationRef.current) return;

      const audio = new Audio(data.audioContent);
      audioRef.current = audio;

      audio.onended = () => {
        if (audioRef.current === audio) audioRef.current = null;
        setState("idle");
      };

      audio.onerror = () => {
        if (audioRef.current === audio) audioRef.current = null;
        setState("error");
      };

      await audio.play();
      setState("playing");
    } catch (err) {
      if (gen !== generationRef.current) return;
      console.error("[GoogleTTS] Falha:", err instanceof Error ? err.message : err);
      setState("error");
    }
  }, [stop]);

  return { state, play, stop };
}
