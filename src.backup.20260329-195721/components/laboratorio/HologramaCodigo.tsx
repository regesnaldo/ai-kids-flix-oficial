"use client";

import { motion } from "framer-motion";

const CODE_LINES = [
  "if (signal.confidence > 0.82) {",
  "  nexus.sync(agent.id, memory.layer);",
  "} else {",
  "  fallback.predict(context.window);",
  "}",
];

export default function HologramaCodigo() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-cyan-400/30 bg-[#041322]/70 p-3">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,182,212,0.15)_0%,transparent_50%,rgba(147,51,234,0.12)_100%)]" />
      <div className="relative font-mono text-[11px] text-cyan-200/90">
        {CODE_LINES.map((line, index) => (
          <motion.p
            key={`${line}-${index}`}
            initial={{ opacity: 0.2, x: -6 }}
            animate={{ opacity: [0.25, 1, 0.25], x: [-6, 0, -6] }}
            transition={{
              duration: 2 + index * 0.2,
              repeat: Infinity,
              delay: index * 0.12,
              ease: "easeInOut",
            }}
            className="truncate"
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
