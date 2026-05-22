"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LabPromptInput } from "@/components/lab/LabPromptInput";
import { FlaskConical, Clock, ArrowRight } from "lucide-react";

interface PastExperiment {
  id: string;
  topic: string;
  completedAgents: number;
  createdAt: number;
}

export default function LabPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pastExperiments, setPastExperiments] = useState<PastExperiment[]>([]);

  // Load past experiments from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lab_experiments");
      if (stored) setPastExperiments(JSON.parse(stored));
    } catch {}
  }, []);

  const handleStart = useCallback(async (topic: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/lab/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) throw new Error("Falha ao criar experimento");

      const data = await res.json();

      // Save to localStorage
      const entry: PastExperiment = {
        id: data.experimentId,
        topic,
        completedAgents: 0,
        createdAt: Date.now(),
      };
      const updated = [entry, ...pastExperiments].slice(0, 10);
      setPastExperiments(updated);
      localStorage.setItem("lab_experiments", JSON.stringify(updated));

      router.push(`/lab/experiment/${data.experimentId}`);
    } catch {
      setIsLoading(false);
    }
  }, [pastExperiments, router]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "#0e1420" }}
    >
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[150px] opacity-[0.03]"
          style={{ background: "var(--accent-cyan)" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] opacity-[0.02]"
          style={{ background: "#a78bfa" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-3xl">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl"
            >
              🧪
            </motion.span>
            <h1
              className="text-4xl md:text-5xl font-black tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--accent-cyan)" }}
            >
              MENTE.AI LAB
            </h1>
          </div>
          <p className="text-white/35 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Um prompt. Quatro agentes. Infinitas descobertas.
          </p>
        </motion.div>

        {/* Prompt input */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="w-full"
        >
          <LabPromptInput onSubmit={handleStart} isLoading={isLoading} />
        </motion.div>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 text-sm"
            style={{ color: "var(--accent-cyan)" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
              <FlaskConical size={18} />
            </motion.div>
            <span className="font-mono text-xs tracking-wider">
              Instanciando laboratório...
            </span>
          </motion.div>
        )}

        {/* Past experiments */}
        {pastExperiments.length > 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full mt-8"
          >
            <p
              className="text-[9px] font-mono uppercase tracking-[0.3em] mb-4 text-center"
              style={{ color: "var(--accent-cyan)" }}
            >
              EXPERIMENTOS ANTERIORES
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pastExperiments.map((exp) => (
                <motion.button
                  key={exp.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/lab/experiment/${exp.id}`)}
                  className="flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 hover:brightness-110"
                  style={{
                    background: "rgba(22, 29, 46, 0.6)",
                    border: "1px solid rgba(255,255,255,0.03)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🧪</span>
                    <div>
                      <p className="text-white/70 text-xs font-bold">{exp.topic}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={10} className="text-white/15" />
                        <span className="text-[9px] text-white/20">
                          {new Date(exp.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                        <span className="text-[9px] text-white/10">·</span>
                        <span className="text-[9px] text-white/20">
                          {exp.completedAgents}/4 agentes
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-white/10 flex-shrink-0" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer label */}
        <p className="text-white/10 text-[9px] font-mono uppercase tracking-[0.2em] mt-4">
          NEXUS · CIPHER · KAOS · AURORA
        </p>
      </div>
    </main>
  );
}
