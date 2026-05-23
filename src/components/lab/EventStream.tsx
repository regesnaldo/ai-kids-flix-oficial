"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LabEvent } from "@/hooks/useExperimentEngine";

const AGENT_COLORS: Record<string, string> = {
  nexus: "#00f5ff",
  cipher: "#00ff88",
  kaos: "#ff6b35",
  aurora: "#a78bfa",
};

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

interface EventStreamProps {
  events: LabEvent[];
}

export function EventStream({ events }: EventStreamProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [events]);

  return (
    <div
      className="rounded-xl p-3 overflow-y-auto max-h-[300px]"
      style={{
        background: "rgba(14, 20, 32, 0.8)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <p
        className="text-[9px] font-mono uppercase tracking-[0.25em] mb-3 sticky top-0 pb-2"
        style={{
          color: "var(--accent-cyan)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(14, 20, 32, 0.95)",
        }}
      >
        📡 STREAM DE EVENTOS
      </p>
      <div className="space-y-1.5">
        <AnimatePresence>
          {events.length === 0 && (
            <p className="text-[10px] text-white/15 font-mono italic">
              Nenhum evento ainda...
            </p>
          )}
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2 text-[10px] font-mono"
            >
              <span className="text-white/10 flex-shrink-0 w-14">
                {formatTime(event.timestamp)}
              </span>
              <span
                className="text-white/15 flex-shrink-0 w-10 text-right"
                style={{
                  color: event.agent ? AGENT_COLORS[event.agent] || "#ffffff40" : "#ffffff20",
                }}
              >
                [{event.agent ? event.agent.toUpperCase().slice(0, 4) : "····"}]
              </span>
              <span className="text-white/50 leading-relaxed">{event.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
