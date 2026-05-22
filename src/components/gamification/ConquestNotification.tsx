"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface Conquest {
  id: string;
  xp: number;
  message: string;
  agent?: string;
  season?: number;
  episode?: number;
}

const CONQUESTS_KEY = "mente_ai_conquest_queue";

/** Queue a conquest to be shown. Call from anywhere. */
export function queueConquest(conquest: Conquest) {
  try {
    const queue: Conquest[] = JSON.parse(localStorage.getItem(CONQUESTS_KEY) || "[]");
    queue.push(conquest);
    localStorage.setItem(CONQUESTS_KEY, JSON.stringify(queue));
    window.dispatchEvent(new Event("mente_ai_conquest"));
  } catch {}
}

export function ConquestNotification() {
  const [active, setActive] = useState<Conquest | null>(null);

  const processQueue = useCallback(() => {
    try {
      const raw = localStorage.getItem(CONQUESTS_KEY);
      if (!raw) return;
      const queue: Conquest[] = JSON.parse(raw);
      if (queue.length === 0) return;
      const next = queue.shift()!;
      localStorage.setItem(CONQUESTS_KEY, JSON.stringify(queue));
      setActive(next);
      setTimeout(() => setActive(null), 4000);
    } catch {}
  }, []);

  useEffect(() => {
    processQueue();
    window.addEventListener("mente_ai_conquest", processQueue);
    return () => window.removeEventListener("mente_ai_conquest", processQueue);
  }, [processQueue]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] px-5 py-3 rounded-xl pointer-events-none"
          style={{
            background: "rgba(10,10,26,0.95)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(0,240,255,0.2)",
            boxShadow: "0 8px 32px rgba(0,240,255,0.1)",
          }}
        >
          <p className="text-white text-sm font-bold flex items-center gap-2">
            <span className="text-lg">⚡</span>
            +{active.xp} XP — {active.message}
          </p>
          {active.agent && (
            <p className="text-gray-500 text-[10px] mt-0.5">
              {active.agent} · Temporada {active.season} · Ep {active.episode}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
