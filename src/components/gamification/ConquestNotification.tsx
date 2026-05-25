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

interface ConquestNotificationProps {
  /** When true, conquest is suppressed (panel open, episode playing, etc.) */
  suppressed?: boolean;
}

export function ConquestNotification({ suppressed = false }: ConquestNotificationProps) {
  const [active, setActive] = useState<Conquest | null>(null);

  const processQueue = useCallback(() => {
    if (suppressed) return;
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
  }, [suppressed]);

  useEffect(() => {
    processQueue();
    window.addEventListener("mente_ai_conquest", processQueue);
    return () => window.removeEventListener("mente_ai_conquest", processQueue);
  }, [processQueue]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-xl pointer-events-none"
          style={{
            background: "rgba(22, 29, 46, 0.95)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(0, 245, 255, 0.15)",
            boxShadow: "0 8px 32px rgba(0, 245, 255, 0.08)",
          }}
        >
          <p className="text-white text-sm font-bold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <span className="text-lg">⚡</span>
            +{active.xp} XP — {active.message}
          </p>
          {active.agent && (
            <p className="text-white/25 text-[10px] mt-0.5">
              {active.agent} · T{active.season} · Ep {active.episode}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
