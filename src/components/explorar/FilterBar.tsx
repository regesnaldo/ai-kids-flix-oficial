// ─── src/components/explorar/FilterBar.tsx ─────────────────────────────────

"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import type { FilterConfig, ThemeCategory } from "@/services/explorar.service";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface FilterBarProps {
  config: FilterConfig;
  activeTheme: string | null;
  activeLevel: string | null;
  activeSpecial: string | null;
  onThemeChange: (slug: string | null) => void;
  onLevelChange: (slug: string | null) => void;
  onSpecialChange: (slug: string | null) => void;
  resultCount: number;
}

/* ─── Theme Tabs ─────────────────────────────────────────────────────────── */

function ThemeTabs({
  themes,
  activeTheme,
  onThemeChange,
}: {
  themes: ThemeCategory[];
  activeTheme: string | null;
  onThemeChange: (slug: string | null) => void;
}) {
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
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-slate-950/90 rounded-full border border-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Rolar para esquerda"
        >
          <ChevronLeft size={16} />
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide py-1 px-1 flex-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* "Todos" tab */}
        <button
          onClick={() => onThemeChange(null)}
          className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-all duration-200 ${
            !activeTheme
              ? "bg-violet-600/20 text-violet-400 border-b-2 border-violet-500"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          Todos
        </button>

        {themes.map((t) => {
          const isActive = activeTheme === t.slug;
          return (
            <button
              key={t.slug}
              onClick={() => onThemeChange(t.slug)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-slate-800 text-white border-b-2 border-violet-500"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {t.shortLabel}
            </button>
          );
        })}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-slate-950/90 rounded-full border border-slate-800 text-slate-400 hover:text-white transition"
          aria-label="Rolar para direita"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}

/* ─── Dropdown ───────────────────────────────────────────────────────────── */

function FilterDropdown({
  label,
  options,
  activeValue,
  onChange,
}: {
  label: string;
  options: { slug: string; label: string }[];
  activeValue: string | null;
  onChange: (slug: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeLabel = activeValue
    ? options.find((o) => o.slug === activeValue)?.label ?? label
    : label;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
          activeValue
            ? "border-violet-500/30 bg-violet-600/10 text-violet-300"
            : "border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200"
        }`}
      >
        {activeLabel}
        <ChevronDown size={14} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 right-0 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-20 overflow-hidden">
          <button
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 transition"
          >
            {label}
          </button>
          {options.map((o) => (
            <button
              key={o.slug}
              onClick={() => {
                onChange(o.slug);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition ${
                activeValue === o.slug
                  ? "text-violet-300 bg-violet-600/10"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function FilterBar({
  config,
  activeTheme,
  activeLevel,
  activeSpecial,
  onThemeChange,
  onLevelChange,
  onSpecialChange,
  resultCount,
}: FilterBarProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Theme Tabs — single scrollable row */}
      <ThemeTabs
        themes={config.themes}
        activeTheme={activeTheme}
        onThemeChange={onThemeChange}
      />

      {/* Dropdown row */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterDropdown
          label="Nível: Todos"
          options={config.levels.map((l) => ({ slug: l.slug, label: l.label }))}
          activeValue={activeLevel}
          onChange={onLevelChange}
        />
        <FilterDropdown
          label="Especiais"
          options={config.specials.map((s) => ({ slug: s.slug, label: s.label }))}
          activeValue={activeSpecial}
          onChange={onSpecialChange}
        />

        <span className="text-xs text-slate-500 ml-auto">
          {resultCount} resultado{resultCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
