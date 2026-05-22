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
}

export function LabPromptInput({ onSubmit, isLoading }: LabPromptInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    const topic = input.trim();
    if (!topic || isLoading) return;
    onSubmit(topic);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-2xl mx-auto">
      {/* Label */}
      <p
        className="text-[10px] font-mono uppercase tracking-[0.3em]"
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
          className="w-full px-5 py-4 pr-14 rounded-2xl text-sm placeholder:text-white/15 outline-none transition-all duration-300 focus:brightness-110 disabled:opacity-50"
          style={{
            background: "rgba(22, 29, 46, 0.8)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.8)",
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all duration-200 disabled:opacity-30 hover:brightness-125"
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
        {EXAMPLE_CHIPS.map((chip) => (
          <motion.button
            key={chip.label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setInput(chip.label)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] transition-all duration-200 hover:brightness-125 disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.45)",
            }}
          >
            <span>{chip.icon}</span>
            {chip.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
