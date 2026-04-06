"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { motion } from "framer-motion";
import { Minimize2, Volume2, VolumeX } from "lucide-react";
import NexusCinematicIntro from "@/components/universo/NexusCinematicIntro";
import NexusDialogLive from "@/components/universo/NexusDialogLive";
import { VoltScene } from "@/components/universo/VoltScene";

const VOLT_VOICE_ID = process.env.NEXT_PUBLIC_VOLT_VOICE_ID || "VR6AewLTigWG4xSOukaG";

export default function VoltUniversePage() {
  const [introConcluida, setIntroConcluida] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSpeak = useCallback(
    async (text: string) => {
      if (isSpeaking || !audioEnabled) return;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(true);
      try {
        const res = await fetch("/api/elevenlabs/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            voice_id: VOLT_VOICE_ID,
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
        await audio.play();
        audio.onended = () => {
          URL.revokeObjectURL(url);
          audioRef.current = null;
          setIsSpeaking(false);
        };
      } catch {
        setIsSpeaking(false);
      }
    },
    [audioEnabled, isSpeaking],
  );

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black">
      {!introConcluida && (
        <NexusCinematicIntro
          onComplete={() => setIntroConcluida(true)}
          onSkip={() => setIntroConcluida(true)}
          voiceId={VOLT_VOICE_ID}
          audioEnabled={audioEnabled}
        />
      )}

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 62 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <VoltScene />
          </Suspense>
        </Canvas>
        <Loader containerStyles={{ background: "#030303" }} innerStyles={{ background: "#facc15" }} />
      </div>

      {introConcluida && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 top-4 z-20 flex items-center justify-between px-6"
          >
            <div>
              <p className="font-mono text-sm font-black tracking-widest text-yellow-300">VOLT</p>
              <p className="text-xs text-yellow-200/70">Saia da zona de conforto agora</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAudioEnabled((p) => !p)}
                className="rounded-lg border border-yellow-300/40 bg-black/40 p-2 text-yellow-200"
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
              endpoint="/api/universo/volt"
              agentLabel="VOLT"
              initialAssistantMessage="VOLT: Chega de adiar. Qual decisão você vai executar nas próximas 24 horas?"
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

