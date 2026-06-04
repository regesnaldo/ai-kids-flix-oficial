// ─── src/hooks/useTTS.ts ──────────────────────────────────────────────────

"use client";

import { useState, useCallback, useRef } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

type TTSState = "idle" | "loading" | "playing" | "error";

interface UseTTSReturn {
  state: TTSState;
  play: (text: string, agentId: string) => Promise<void>;
  stop: () => void;
}

/* ─── Agent voice IDs ───────────────────────────────────────────────────── */

const VOICE_MAP: Record<string, string> = {
  nexus: "pNInz6obpgDQGcFmaJgB",
  cipher: "pNInz6obpgDQGcFmaJgB",
  kaos: "pNInz6obpgDQGcFmaJgB",
  aurora: "pNInz6obpgDQGcFmaJgB",
  volt: "pNInz6obpgDQGcFmaJgB",
  ethos: "pNInz6obpgDQGcFmaJgB",
};

/* ─── Hook ──────────────────────────────────────────────────────────────── */

export function useTTS(): UseTTSReturn {
  const [state, setState] = useState<TTSState>("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setState("idle");
    }
  }, []);

  const play = useCallback(async (text: string, agentId: string) => {
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

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(url);
        setState("idle");
      };

      audio.onerror = () => {
        URL.revokeObjectURL(url);
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
