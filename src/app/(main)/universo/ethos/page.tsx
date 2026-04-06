"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { motion } from "framer-motion";
import { Minimize2, Volume2, VolumeX } from "lucide-react";
import NexusCinematicIntro from "@/components/universo/NexusCinematicIntro";
import NexusDialogLive from "@/components/universo/NexusDialogLive";
import { EthosScene } from "@/components/universo/EthosScene";

const ETHOS_VOICE_ID = process.env.NEXT_PUBLIC_ETHOS_VOICE_ID || "TxGEqnHWrfWFTfGW9XjX";

export default function EthosUniversePage() {
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
            voice_id: ETHOS_VOICE_ID,
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
    <main className="relative h-screen w-full overflow-hidden bg-[#120804]">
      {!introConcluida && (
        <NexusCinematicIntro
          onComplete={() => setIntroConcluida(true)}
          onSkip={() => setIntroConcluida(true)}
          voiceId={ETHOS_VOICE_ID}
          audioEnabled={audioEnabled}
        />
      )}

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [8, 2, 10], fov: 60 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <EthosScene />
          </Suspense>
        </Canvas>
        <Loader containerStyles={{ background: "#120804" }} innerStyles={{ background: "#f59e0b" }} />
      </div>

      {introConcluida && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 top-4 z-20 flex items-center justify-between px-6"
          >
            <div>
              <p className="font-mono text-sm font-black tracking-widest text-amber-300">ETHOS</p>
              <p className="text-xs text-amber-100/70">Biblioteca infinita e dilemas morais</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAudioEnabled((p) => !p)}
                className="rounded-lg border border-amber-300/40 bg-black/40 p-2 text-amber-200"
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
              endpoint="/api/universo/ethos"
              agentLabel="ETHOS"
              initialAssistantMessage="ETHOS: Você pode vencer sem ferir seus valores? Responda e sustente as consequências."
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

