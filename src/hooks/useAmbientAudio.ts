"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AmbientAudioController = {
  play: () => void;
  pause: () => void;
  isPlaying: boolean;
};

type AudioWindow = Window & typeof globalThis & {
  webkitAudioContext?: typeof AudioContext;
};

export function useAmbientAudio(): AmbientAudioController {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const stopNodes = useCallback(() => {
    oscillatorRef.current?.stop();
    oscillatorRef.current?.disconnect();
    gainRef.current?.disconnect();
    oscillatorRef.current = null;
    gainRef.current = null;
  }, []);

  const play = useCallback(() => {
    const audioWindow = window as AudioWindow;
    const AudioContextClass = audioWindow.AudioContext || audioWindow.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = audioContextRef.current ?? new AudioContextClass();
    audioContextRef.current = audioContext;

    if (audioContext.state === "suspended") {
      void audioContext.resume();
    }

    stopNodes();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 40;
    gain.gain.value = 0.02;

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();

    oscillatorRef.current = oscillator;
    gainRef.current = gain;
    setIsPlaying(true);
  }, [stopNodes]);

  const pause = useCallback(() => {
    stopNodes();
    setIsPlaying(false);
  }, [stopNodes]);

  useEffect(() => {
    return () => {
      stopNodes();
      void audioContextRef.current?.close();
      audioContextRef.current = null;
    };
  }, [stopNodes]);

  return { play, pause, isPlaying };
}
