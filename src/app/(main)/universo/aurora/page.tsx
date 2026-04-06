"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { motion } from "framer-motion";
import { Minimize2, Volume2, VolumeX } from "lucide-react";
import NexusCinematicIntro from "@/components/universo/NexusCinematicIntro";
import NexusDialogLive from "@/components/universo/NexusDialogLive";
import { AuroraScene } from "@/components/universo/AuroraScene";

const AURORA_VOICE_ID = process.env.NEXT_PUBLIC_AURORA_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

function detectMood(text: string): "curioso" | "neutro" | "reflexivo" {
  const normalized = text.toLowerCase();
  if (normalized.includes("por que") || normalized.includes("curioso") || normalized.includes("descobrir")) return "curioso";
  if (normalized.includes("duvida") || normalized.includes("consequencia") || normalized.includes("responsabilidade")) return "reflexivo";
  return "neutro";
}

export default function AuroraUniversePage() {
  const [introConcluida, setIntroConcluida] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mood, setMood] = useState<"curioso" | "neutro" | "reflexivo">("neutro");
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
            voice_id: AURORA_VOICE_ID,
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
    <main className="relative h-screen w-full overflow-hidden bg-[#0f172a]">
      {!introConcluida && (
        <NexusCinematicIntro
          onComplete={() => setIntroConcluida(true)}
          onSkip={() => setIntroConcluida(true)}
          voiceId={AURORA_VOICE_ID}
          audioEnabled={audioEnabled}
        />
      )}

      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1, 12], fov: 60 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <AuroraScene mood={mood} />
          </Suspense>
        </Canvas>
        <Loader containerStyles={{ background: "#0f172a" }} innerStyles={{ background: "#22d3ee" }} />
      </div>

      {introConcluida && (
        <>
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-0 right-0 top-4 z-20 flex items-center justify-between px-6"
          >
            <div>
              <p className="font-mono text-sm font-black tracking-widest text-cyan-300">AURORA</p>
              <p className="text-xs text-cyan-100/70">Horizonte dinâmico sensível ao humor</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAudioEnabled((p) => !p)}
                className="rounded-lg border border-cyan-300/40 bg-black/40 p-2 text-cyan-200"
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
              endpoint="/api/universo/aurora"
              agentLabel="AURORA"
              initialAssistantMessage="AURORA: Qual visão de futuro você quer tornar inevitável a partir de hoje?"
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
              audioEnabled={audioEnabled}
              onUserMessage={(text) => setMood(detectMood(text))}
            />
          </div>
        </>
      )}
    </main>
  );
}

