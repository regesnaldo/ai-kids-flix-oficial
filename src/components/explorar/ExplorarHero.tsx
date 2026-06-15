// ─── src/components/explorar/ExplorarHero.tsx ──────────────────────────────

"use client";

import { Search, X } from "lucide-react";
import type { FeaturedAgent } from "@/services/explorar.service";
import Link from "next/link";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface ExplorarHeroProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  featured: FeaturedAgent[];
}

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function ExplorarHero({
  searchValue,
  onSearchChange,
  featured,
}: ExplorarHeroProps) {
  return (
    <section className="mb-10">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
          Explore o universo da IA
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
          Descubra agentes, trilhas e conteúdos feitos para o seu nível
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar agentes, aulas, temas..."
          className="w-full pl-12 pr-12 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-slate-600 focus:bg-slate-800/80 transition"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition"
            aria-label="Limpar busca"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Featured Agents */}
      {featured.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {featured.map(({ agent, reason }) => (
            <Link
              key={agent.id}
              href={`/agentes/${agent.id}`}
              className="group flex items-center gap-4 p-4 bg-slate-800/80 border border-slate-700 rounded-2xl hover:border-slate-500 hover:bg-slate-800 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-bold text-white"
                style={{ backgroundColor: agent.color }}
              >
                {agent.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {agent.name}
                </p>
                <p className="text-xs text-slate-400 truncate">{reason}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
