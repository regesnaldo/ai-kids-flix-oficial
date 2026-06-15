// ─── src/components/lab/TopicCarousel.tsx ───────────────────────────────────

"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Topic } from "@/types/topic";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface TopicCarouselProps {
  topics: Topic[];
  onSelect: (question: string) => void;
  agentColor: string;
  compact?: boolean;
}

/* ─── Topic icons by category (SVG components) ──────────────────────────── */

const TOPIC_ICONS: Record<string, React.ReactNode> = {
  "como-ia-aprende": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="20" r="5" fill="currentColor" opacity="0.6"/><line x1="20" y1="8" x2="20" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="13" cy="10" r="1.5" fill="currentColor"/><circle cx="27" cy="14" r="1" fill="currentColor"/></svg>
  ),
  "deep-learning": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="8" y="16" width="6" height="16" rx="2" fill="currentColor" opacity="0.4"/><rect x="17" y="10" width="6" height="22" rx="2" fill="currentColor" opacity="0.7"/><rect x="26" y="6" width="6" height="26" rx="2" fill="currentColor"/></svg>
  ),
  "etica-ia": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 6L20 34" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="20" cy="6" r="3" fill="currentColor" opacity="0.5"/><path d="M12 20L28 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="12" cy="20" r="3" fill="currentColor" opacity="0.5"/><circle cx="28" cy="20" r="3" fill="currentColor" opacity="0.5"/></svg>
  ),
  "futuro-ia": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3"/><circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="20" r="3" fill="currentColor"/></svg>
  ),
  llms: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="6" y="10" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2"/><line x1="10" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.5" opacity="0.5"/><line x1="10" y1="21" x2="22" y2="21" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/><line x1="10" y1="26" x2="18" y2="26" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/></svg>
  ),
  "ia-criativa": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2"/><circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2"/><circle cx="20" cy="14" r="4" fill="currentColor" opacity="0.4"/></svg>
  ),
  "ia-meio-ambiente": (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 34V18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="20" cy="12" r="8" stroke="currentColor" strokeWidth="2"/><path d="M8 34Q20 24 32 34" stroke="currentColor" strokeWidth="2"/></svg>
  ),
};

function TopicIcon({ topicId }: { topicId: string }) {
  return (
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-800/80 border border-slate-700/50 mb-4" style={{ color: "var(--topic-color, #94A3B8)" }}>
      {TOPIC_ICONS[topicId] || (
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" />
          <circle cx="20" cy="20" r="4" fill="currentColor" opacity="0.5" />
        </svg>
      )}
    </div>
  );
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
    return () => { if (el) el.removeEventListener("scroll", updateScroll); };
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {topics.map((t) => (
          <button key={t.id} onClick={() => onSelect(t.question)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-lg border border-slate-700/50 bg-slate-800/40 text-slate-400 hover:text-white hover:border-slate-500 transition-colors">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
            {t.question.slice(0, 50)}...
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-4">
        Tópicos para explorar
      </p>

      {canScrollLeft && (
        <button onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-900/90 backdrop-blur border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition shadow-lg">
          <ChevronLeft size={18} />
        </button>
      )}

      <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {topics.map((topic, i) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic.question)}
            className="group flex-shrink-0 w-[250px] text-left rounded-2xl p-5
                       bg-slate-800/50 backdrop-blur-md border border-slate-700/50
                       hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
                       transition-all duration-500 focus:outline-none"
            style={{
              animationDelay: `${i * 80}ms`,
            }}
          >
            {/* Topic SVG icon */}
            <div style={{ "--topic-color": topic.color } as React.CSSProperties}>
              <TopicIcon topicId={topic.id} />
            </div>

            {/* Agent badge */}
            <div className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-slate-800 flex items-center justify-center"
              style={{ backgroundColor: agentColor }}>
              <div className="w-2 h-2 rounded-full bg-white/80" />
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-white mb-2 line-clamp-2 leading-snug">
              {topic.label}
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
              {topic.question}
            </p>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-12 rounded-b-2xl bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-900/90 backdrop-blur border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white transition shadow-lg">
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}
