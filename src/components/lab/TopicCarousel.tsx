// ─── src/components/lab/TopicCarousel.tsx ───────────────────────────────────

"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react";
import type { Topic } from "@/types/topic";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface TopicCarouselProps {
  topics: Topic[];
  onSelect: (question: string) => void;
  agentColor: string;
  compact?: boolean;
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export function TopicCarousel({ topics, onSelect, agentColor, compact }: TopicCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    updateScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", updateScroll, { passive: true });
    return () => {
      if (el) el.removeEventListener("scroll", updateScroll);
    };
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {topics.map((t) => (
          <button
            key={t.id}
            onClick={() => onSelect(t.question)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
            {t.question}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Label */}
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
        Tópicos para explorar
      </p>

      {/* Nav arrows */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.question)}
            className="group flex-shrink-0 w-[220px] text-left bg-slate-900 border border-slate-800 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg focus:outline-none"
            style={{
              boxShadow: `0 0 0 0 ${topic.color}00`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = topic.color;
              e.currentTarget.style.boxShadow = `0 4px 24px ${topic.color}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgb(30,41,59)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${topic.color}20` }}
            >
              <Lightbulb size={20} style={{ color: topic.color }} />
            </div>
            <p className="text-sm font-semibold text-white mb-1.5 line-clamp-2">
              {topic.label}
            </p>
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {topic.question}
            </p>
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
