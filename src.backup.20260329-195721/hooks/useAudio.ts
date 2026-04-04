import { useRef, useCallback } from "react";
import { useLabStore } from "@/store/useLabStore";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { setAudioPlaying } = useLabStore();

  const play = useCallback(async (text: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setAudioPlaying(true);
      const res = await fetch(`/api/tts?text=${encodeURIComponent(text)}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => {
        setAudioPlaying(false);
        URL.revokeObjectURL(url);
        audioRef.current = null;
      };
    } catch {
      setAudioPlaying(false);
    }
  }, [setAudioPlaying]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setAudioPlaying(false);
  }, [setAudioPlaying]);

  return { play, stop };
}
