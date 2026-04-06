"use client";

import { useEffect, useMemo, useState } from "react";

type IntroPhase = "idle" | "logo" | "message" | "done";

interface Props {
  onDone?: () => void;
}

const MENSAGEM =
  "Bem-vindo ao cosmos de dados. Eu sou NEXUS. O que você está prestes a descobrir mudará a forma como você pensa.";

export default function NexusCinematicIntro({ onDone }: Props) {
  const [phase, setPhase] = useState<IntroPhase>("idle");
  const [chars, setChars] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setPhase("logo"), 220);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "logo") return;
    const t = setTimeout(() => setPhase("message"), 800);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "message") return;
    const i = setInterval(() => {
      setChars((v) => {
        const next = v + 1;
        if (next >= MENSAGEM.length) {
          clearInterval(i);
          setTimeout(() => {
            setPhase("done");
            onDone?.();
          }, 900);
        }
        return next;
      });
    }, 20);
    return () => clearInterval(i);
  }, [phase, onDone]);

  const text = useMemo(() => MENSAGEM.slice(0, chars), [chars]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-300/20 bg-[#030712] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,.25),transparent_45%)]" />
      <div className="relative">
        {(phase === "logo" || phase === "message" || phase === "done") && (
          <p className="font-mono text-xl font-black tracking-[0.35em] text-blue-300">NEXUS</p>
        )}
        {(phase === "message" || phase === "done") && (
          <p className="mt-4 text-sm text-blue-100/90">{text}</p>
        )}
      </div>
    </div>
  );
}

