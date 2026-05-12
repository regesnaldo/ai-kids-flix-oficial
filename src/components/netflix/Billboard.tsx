"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, Volume2, VolumeX } from "lucide-react";

// ─── Types ──────────────────────────────────────────────

interface BillboardContent {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  videoUrl?: string;
  matchScore: number;
  tags: string[];
  maturityRating: string;
  year?: string;
  duration?: string;
}

interface BillboardProps {
  contents: BillboardContent[];
  autoPlayInterval?: number;
  onPlay?: (content: BillboardContent) => void;
  onMoreInfo?: (content: BillboardContent) => void;
}

// ─── Component ──────────────────────────────────────────

export default function Billboard({
  contents,
  autoPlayInterval = 12000,
  onPlay,
  onMoreInfo,
}: BillboardProps) {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showing, setShowing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const resetAutoPlay = useCallback(() => {
    setProgress(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    const step = 50; // ms
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          return 100;
        }
        return p + (step / autoPlayInterval) * 100;
      });
    }, step);

    intervalRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % contents.length);
      setProgress(0);
    }, autoPlayInterval);
  }, [contents.length, autoPlayInterval]);

  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [resetAutoPlay]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo((current - 1 + contents.length) % contents.length);
      if (e.key === "ArrowRight") goTo((current + 1) % contents.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, contents.length]);

  const goTo = (index: number) => {
    setCurrent(index);
    setProgress(0);
  };

  const item = contents[current];
  if (!item || !isClient) return null;

  return (
    <div className="relative w-full overflow-hidden" style={{ height: "85vh", minHeight: "500px", maxHeight: "900px" }}>
      {/* ── Background image ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Cinematic gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                linear-gradient(to right, rgba(10,10,26,0.95) 0%, rgba(10,10,26,0.6) 35%, transparent 55%),
                linear-gradient(to top, #0a0a1a 0%, transparent 40%),
                linear-gradient(to bottom, rgba(10,10,26,0.4) 0%, transparent 20%)
              `,
              zIndex: 1,
            }}
          />

          {/* Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${item.imageUrl})`,
              filter: "blur(2px) saturate(1.2)",
              transform: "scale(1.1)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Content ── */}
      <div className="relative h-full z-10 flex items-end pb-[12%]" style={{ paddingLeft: "4%" }}>
        <motion.div
          key={`content-${item.id}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl"
        >
          {/* Match score */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-sm font-bold"
              style={{
                color: item.matchScore >= 80 ? "#10b981" : item.matchScore >= 60 ? "#f59e0b" : "#ef4444",
              }}
            >
              {item.matchScore}% Match
            </span>
            {item.year && <span className="text-xs text-zinc-400">{item.year}</span>}
            {item.duration && <span className="text-xs text-zinc-400">{item.duration}</span>}
            <span className="px-1.5 py-0.5 text-[10px] font-bold border border-zinc-500 text-zinc-300 rounded">
              {item.maturityRating}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-[0.95] tracking-tight">
            {item.title}
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-zinc-200 mb-6 leading-relaxed line-clamp-3 max-w-xl">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-full border border-white/20 text-zinc-300 bg-white/5"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onPlay?.(item)}
              className="inline-flex items-center gap-2 px-7 py-2.5 bg-white text-black font-bold text-base rounded-md hover:bg-zinc-200 transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              Assistir
            </button>

            <button
              type="button"
              onClick={() => onMoreInfo?.(item)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-600/60 text-white font-bold text-base rounded-md hover:bg-zinc-600/80 transition-colors backdrop-blur-sm"
            >
              <Info className="w-5 h-5" />
              Mais Info
            </button>

            {/* Mute toggle */}
            <button
              type="button"
              onClick={() => setMuted(!muted)}
              className="ml-2 p-2.5 rounded-full border border-zinc-500 text-white hover:bg-white/10 transition-colors"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>

      {/* ── Progress bar (auto-play timer) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
        <motion.div
          className="h-full bg-neon-cyan"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ── Dot indicators ── */}
      <div className="absolute bottom-6 right-[4%] z-20 flex items-center gap-1.5">
        {contents.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className="h-1 rounded-full transition-all duration-300"
            style={{
              width: i === current ? "24px" : "8px",
              backgroundColor: i === current ? "#00f0ff" : "rgba(255,255,255,0.3)",
            }}
            aria-label={`Go to content ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
