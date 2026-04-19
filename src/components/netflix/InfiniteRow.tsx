"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Types ──────────────────────────────────────────────

interface RowItem {
  id: number | string;
  title: string;
  imageUrl: string;
  matchScore?: number;
  tags?: string[];
  progress?: number; // 0-1, for "continue watching"
  maturityRating?: string;
}

interface InfiniteRowProps {
  title: string;
  items: RowItem[];
  itemWidth?: number;
  onPlay?: (item: RowItem) => void;
}

// ─── Component ──────────────────────────────────────────

export default function InfiniteRow({
  title,
  items,
  itemWidth = 240,
  onPlay,
}: InfiniteRowProps) {
  const [scrollPos, setScrollPos] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  const gap = 8;
  const step = itemWidth * 3;

  const canScrollLeft = scrollPos > 0;
  const canScrollRight = scrollPos < items.length * (itemWidth + gap) - (containerRef.current?.clientWidth ?? 0);

  const scroll = useCallback((direction: "left" | "right") => {
    const delta = direction === "left" ? -step : step;
    const newPos = Math.max(0, scrollPos + delta);
    setScrollPos(newPos);
    containerRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }, [scrollPos, step]);

  if (!isClient) {
    // Trigger client check
    if (typeof window !== "undefined") setIsClient(true);
  }

  if (items.length === 0) return null;

  return (
    <section className="relative mb-10 md:mb-14 group/row" style={{ paddingLeft: "4%" }}>
      {/* Row title */}
      <h2 className="text-lg md:text-xl font-bold text-white mb-3 tracking-tight">
        {title}
      </h2>

      {/* Scroll container */}
      <div className="relative">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/70 text-white transition-opacity ${
            canScrollLeft ? "opacity-0 group-hover/row:opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ marginLeft: "-16px" }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Cards row */}
        <div
          ref={containerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-8"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((item) => {
            const isHovered = hoveredItem === item.id;
            return (
              <motion.div
                key={item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                onClick={() => onPlay?.(item)}
                className="relative flex-shrink-0 cursor-pointer group/card"
                style={{ width: itemWidth }}
                animate={isHovered ? { scale: 1.08, zIndex: 10 } : { scale: 1, zIndex: 1 }}
                transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              >
                {/* Card */}
                <div
                  className="relative rounded-md overflow-hidden bg-cyber-surface border border-white/5 transition-shadow"
                  style={{
                    aspectRatio: "16/9",
                    ...(isHovered && {
                      boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 12px rgba(0,240,255,0.15)",
                      border: "1px solid rgba(0,240,255,0.2)",
                    }),
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.imageUrl})` }}
                  />

                  {/* Progress bar (continue watching) */}
                  {item.progress !== undefined && item.progress > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
                      <div
                        className="h-full bg-neon-cyan"
                        style={{ width: `${item.progress * 100}%` }}
                      />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-200"
                    style={{ opacity: isHovered ? 1 : 0 }}
                  >
                    {/* Bottom info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      {/* Title */}
                      <p className="text-sm font-bold text-white truncate mb-1">
                        {item.title}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-2 mb-1">
                        {item.matchScore && (
                          <span
                            className="text-[10px] font-bold"
                            style={{
                              color: item.matchScore >= 80 ? "#10b981" : item.matchScore >= 60 ? "#f59e0b" : "#ef4444",
                            }}
                          >
                            {item.matchScore}% Match
                          </span>
                        )}
                        {item.maturityRating && (
                          <span className="text-[9px] px-1 border border-zinc-500 text-zinc-400 rounded">
                            {item.maturityRating}
                          </span>
                        )}
                      </div>

                      {/* Tags */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[9px] text-zinc-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-30 p-1.5 rounded-full bg-black/70 text-white transition-opacity ${
            canScrollRight ? "opacity-0 group-hover/row:opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ marginRight: "-16px" }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
