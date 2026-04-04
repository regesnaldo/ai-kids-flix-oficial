"use client";

import { useState, useRef, useCallback } from "react";

export function useTTS() {
  const [state, setState] = useState<"idle" | "loading" | "playing">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(async (text: string) => {
    if (!text || state === "playing" || state === "loading") return;

    try {
      setState("loading");

      // Criar elemento de áudio nativo (isolado do Tone.js)
      const audio = new Audio();
      
      // Usar API TTS com encoding correto
      const url = `/api/tts?text=${encodeURIComponent(text)}`;
      audio.src = url;

      // Event listeners
      audio.addEventListener("canplaythrough", () => {
        setState("playing");
        audio.play().catch(console.error);
      }, { once: true });

      audio.addEventListener("ended", () => {
        setState("idle");
        audioRef.current = null;
      });

      audio.addEventListener("error", (e) => {
        console.error("TTS Audio error:", e);
        setState("idle");
        audioRef.current = null;
      });

      audioRef.current = audio;
      audio.load();
    } catch (error) {
      console.error("TTS play failed:", error);
      setState("idle");
    }
  }, [state]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setState("idle");
  }, []);

  return { play, stop, state };
}
