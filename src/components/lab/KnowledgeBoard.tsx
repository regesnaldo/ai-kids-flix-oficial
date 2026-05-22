"use client";

import { motion, AnimatePresence } from "framer-motion";

interface KnowledgeBoardProps {
  facts: string[];
}

export function KnowledgeBoard({ facts }: KnowledgeBoardProps) {
  return (
    <div
      className="rounded-xl p-4 min-h-[80px]"
      style={{
        background: "rgba(14, 20, 32, 0.8)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p
          className="text-[9px] font-mono uppercase tracking-[0.25em]"
          style={{ color: "var(--accent-cyan)" }}
        >
          📋 QUADRO DE CONHECIMENTO
        </p>
        <span className="text-[9px] text-white/15">{facts.length} tags</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence mode="popLayout">
          {facts.length === 0 && (
            <span className="text-[10px] text-white/15 italic">
              Aguardando descobertas dos agentes...
            </span>
          )}
          {facts.map((fact, i) => (
            <motion.span
              key={`${fact.slice(0, 20)}-${i}`}
              initial={{ opacity: 0, scale: 0.8, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="px-2.5 py-1 rounded-full text-[10px] font-medium transition-all duration-200 hover:brightness-125"
              style={{
                background: "#0e1420",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {fact}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
