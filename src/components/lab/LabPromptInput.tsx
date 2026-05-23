"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FlaskConical, ArrowRight } from "lucide-react";

const EXAMPLE_CHIPS = [
  { icon: "🧠", label: "Como a IA aprende?" },
  { icon: "🔤", label: "O que são LLMs?" },
  { icon: "⚖️", label: "Ética na IA" },
  { icon: "🔮", label: "Futuro da IA" },
  { icon: "🎨", label: "IA é criativa?" },
  { icon: "🌍", label: "IA e meio ambiente" },
];

interface LabPromptInputProps {
  onSubmit: (topic: string) => void;
  isLoading: boolean;
  isCached?: (question: string) => boolean;
}

export function LabPromptInput({ onSubmit, isLoading, isCached }: LabPromptInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const topic = input.trim();
    if (!topic || isLoading) return;
    onSubmit(topic);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
      {/* Label */}
      <p
        className="text-xs uppercase tracking-[0.2em] !text-slate-500 [font-family:var(--font-jetbrains-mono)]"
        style={{ color: "var(--accent-cyan)" }}
      >
        DIGITE SUA CURIOSIDADE
      </p>

      {/* Input */}
      <div className="relative w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Ex: Como as redes neurais aprendem?"
          disabled={isLoading}
          className="w-full text-lg px-6 py-4 h-14 pr-16 rounded-xl placeholder:text-base !bg-slate-900/50 backdrop-blur-sm !border !border-cyan-500/30 focus:!border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 !text-cyan-50 placeholder:text-slate-500 shadow-[0_0_15px_rgba(34,211,238,0.1)] focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] outline-none transition-all duration-300 disabled:opacity-50"
          style={{
            background: "rgba(22, 29, 46, 0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.8)",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 !bg-cyan-500 hover:!bg-cyan-400 !text-slate-900 rounded-full min-w-[44px] min-h-[44px] flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)] hover:scale-110 transition-all duration-300 disabled:opacity-30"
          style={{
            background: "var(--accent-cyan)",
            color: "#0e1420",
          }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
              <FlaskConical size={18} />
            </motion.div>
          ) : (
            <ArrowRight size={18} />
          )}
        </button>
      </div>

      {/* Example chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {EXAMPLE_CHIPS.map((chip) => {
          const cached = isCached?.(chip.label);
          return (
          <motion.button
            key={chip.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setInput(chip.label)}
            disabled={isLoading}
            title={cached ? "Resposta instantânea — disponível offline, sem espera, sempre gratuita" : "Requer conexão com IA"}
            className={`flex items-center gap-2 text-base px-5 py-3 rounded-full min-h-[44px] border transition-all duration-300 disabled:opacity-50 ${
              cached ? "!bg-cyan-500/20 !border-cyan-400 !text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]" : "!bg-slate-800/60 !border-slate-700 !text-slate-300 hover:!border-cyan-500/50 hover:!bg-slate-700/80 hover:!text-cyan-300"
            }`}
            style={{
              background: cached ? "rgba(0,245,255,0.04)" : "rgba(255,255,255,0.03)",
              border: cached ? "1px solid rgba(0,245,255,0.12)" : "1px solid rgba(255,255,255,0.05)",
              color: cached ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.45)",
            }}
          >
            <span>{cached ? "⚡" : chip.icon}</span>
            {chip.label}
          </motion.button>
        )})}
      </div>
    </div>
  );
}
