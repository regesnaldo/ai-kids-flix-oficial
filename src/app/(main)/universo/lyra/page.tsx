"use client";

export const dynamic = 'force-dynamic';

import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { motion } from "framer-motion";
import { Minimize2, Volume2, VolumeX } from "lucide-react";
import NexusCinematicIntro from "@/components/universo/NexusCinematicIntro";
import NexusDialogLive from "@/components/universo/NexusDialogLive";
import { LyraScene } from "@/components/universo/LyraScene";
import NoSSR from "@/components/NoSSR";

const LYRA_VOICE_ID = process.env.NEXT_PUBLIC_LYRA_VOICE_ID || "XB0fDUnXU5powFXDhCwa";

export default function LyraUniversePage() {
  const [introConcluida, setIntroConcluida] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const stopAnalyser = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    setAudioLevel(0);
  }, []);

  const handleSpeak = useCallback(
    async (text: string) => {
      if (isSpeaking || !audioEnabled) return;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopAnalyser();
      setIsSpeaking(true);

      try {
        const res = await fetch("/api/elevenlabs/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voice_id: LYRA_VOICE_ID,
            model_id: "eleven_monolingual_v1",
          }),
        });
        if (!res.ok) {
          setIsSpeaking(false);
          return;
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        const ctx = ctxRef.current ?? new AudioContext();
        ctxRef.current = ctx;
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        const source = ctx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        const data = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((sum, value) => sum + value, 0) / Math.max(1, data.length);
          setAudioLevel(Math.min(1, avg / 255));
          rafRef.current = requestAnimationFrame(tick);
        };
        tick();

        await audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(url);
          audioRef.current = null;
          setIsSpeaking(false);
          stopAnalyser();
          source.disconnect();
          analyser.disconnect();
        };
      } catch {
        setIsSpeaking(false);
        stopAnalyser();
      }
    },
    [audioEnabled, isSpeaking, stopAnalyser],
  );

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#14081f]">
      {!introConcluida && (
        <NexusCinematicIntro
          onComplete={() => setIntroConcluida(true)}
          onSkip={() => setIntroConcluida(true)}
          voiceId={LYRA_VOICE_ID}
          audioEnabled={audioEnabled}
        />
      )}

      <NoSSR>
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 13], fov: 62 }} dpr={[1, 2]}>
            <Suspense fallback={null}>
              <LyraScene audioLevel={audioLevel} />
            </Suspense>
          </Canvas>
          <Loader containerStyles={{ background: "#14081f" }} innerStyles={{ background: "#e879f9" }} />
        </div>
      </NoSSR>

      {introConcluida && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 top-4 z-20 flex items-center justify-between px-6"
          >
            <div>
              <p className="font-mono text-sm font-black tracking-widest text-fuchsia-300">LYRA</p>
              <p className="text-xs text-fuchsia-100/70">Sinestesia: som vira cor</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAudioEnabled((p) => !p)}
                className="rounded-lg border border-fuchsia-300/40 bg-black/40 p-2 text-fuchsia-200"
              >
                {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <a href="/home" className="rounded-lg border border-white/10 bg-black/40 p-2 text-white/70">
                <Minimize2 size={16} />
              </a>
            </div>
          </motion.div>

          <div className="absolute inset-0 z-10 pointer-events-none">
            <NexusDialogLive
              endpoint="/api/universo/lyra"
              agentLabel="LYRA"
              initialAssistantMessage="LYRA: Descreva sua emoção em cor, textura e ritmo. Vamos traduzir isso em linguagem viva."
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
              audioEnabled={audioEnabled}
            />
          </div>
        </>
      )}
    </main>
  );
}

