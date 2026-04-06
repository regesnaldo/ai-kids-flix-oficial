"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TransitionGatewayProps {
  active: boolean;
  fromAgent: string;
  toAgent: string;
  seedLine: string;
}

export default function TransitionGateway({
  active,
  fromAgent,
  toAgent,
  seedLine,
}: TransitionGatewayProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="mx-4 w-full max-w-2xl rounded-2xl border border-blue-300/30 bg-gradient-to-b from-[#0a1230] to-[#03050d] p-6 text-center"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-blue-300/70">Transição de Universo</p>
            <h3 className="mt-2 text-2xl font-black text-white">
              {fromAgent.toUpperCase()} → {toAgent.toUpperCase()}
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-blue-100/85">{seedLine}</p>

            <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-blue-950/60">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400"
              />
            </div>
            <p className="mt-3 text-xs text-white/60">Sincronizando trilha narrativa...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

