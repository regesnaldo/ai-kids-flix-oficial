"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { allAgents } from "@/data/all-agents";

/* ─── Filter Data ────────────────────────────────────────────────────── */

const THEMES = [
  { label: "Fundamentos de IA", slug: "fundamentos" },
  { label: "Machine Learning", slug: "machine-learning" },
  { label: "Redes Neurais", slug: "redes-neurais" },
  { label: "Deep Learning", slug: "deep-learning" },
  { label: "Computer Vision", slug: "computer-vision" },
  { label: "Proc. de Linguagem", slug: "nlp" },
  { label: "IA Generativa", slug: "ia-generativa" },
  { label: "Ética em IA", slug: "etica-ia" },
  { label: "IA e Criatividade", slug: "ia-criatividade" },
  { label: "Robótica", slug: "robotica" },
  { label: "IA para Crianças", slug: "ia-criancas" },
  { label: "IA nos Negócios", slug: "ia-negocios" },
  { label: "Segurança e IA", slug: "seguranca" },
  { label: "Futuro da IA", slug: "futuro-ia" },
  { label: "Projetos Práticos", slug: "projetos" },
];

const LEVELS = [
  { label: "Para iniciantes", slug: "iniciantes" },
  { label: "Para avançados", slug: "avancados" },
  { label: "Para crianças", slug: "criancas" },
];

const SPECIALS = [
  { label: "Como me sinto hoje?", slug: "emocional" },
  { label: "Missões especiais", slug: "missoes" },
  { label: "Agentes em dupla", slug: "duplas" },
  { label: "Desafios", slug: "desafios" },
];

// Map slugs to agent IDs for filtering
const themeAgentMap: Record<string, string[]> = {
  fundamentos: ["nexus", "terra", "axiom"],
  "machine-learning": ["cipher", "axiom", "nexus"],
  "redes-neurais": ["volt", "nexus", "lyra"],
  "deep-learning": ["axiom", "cipher", "prism"],
  "computer-vision": ["cipher", "prism", "lyra"],
  nlp: ["lyra", "prism", "nexus"],
  "ia-generativa": ["aurora", "kaos", "lyra"],
  "etica-ia": ["ethos", "janus", "terra"],
  "ia-criatividade": ["kaos", "aurora", "lyra"],
  robotica: ["volt", "terra", "stratos"],
  "ia-criancas": ["lyra", "aurora", "nexus"],
  "ia-negocios": ["stratos", "axiom", "nexus"],
  seguranca: ["cipher", "ethos", "prism"],
  "futuro-ia": ["kaos", "aurora", "stratos"],
  projetos: ["terra", "stratos", "volt"],
};

/* ─── Filter Tag Component ────────────────────────────────────────────── */

function FilterTag({
  label,
  active,
  onClick,
  accentColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accentColor?: string;
}) {
  const color = accentColor || "var(--neon-cyan)";
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-200"
      style={{
        borderRadius: "4px",
        background: active ? `${color}18` : "#1E1E2F",
        color: active ? color : "#FFFFFF",
        border: active
          ? `1px solid ${color}40`
          : "1px solid #2A2A3F",
        boxShadow: active ? `0 0 12px ${color}15` : "none",
        cursor: "pointer",
        fontSize: "0.9rem",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "#2A2A3F";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#00E5FF";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "#1E1E2F";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "#2A2A3F";
        }
      }}
    >
      {label}
    </motion.button>
  );
}

/* ─── Section Title ───────────────────────────────────────────────────── */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3" style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#A0A0B0" }}>
      {children}
    </h3>
  );
}

/* ─── Main Content ────────────────────────────────────────────────────── */

function ExplorarContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.trim() ?? "";

  const [activeThemes, setActiveThemes] = useState<Set<string>>(new Set());
  const [activeLevels, setActiveLevels] = useState<Set<string>>(new Set());
  const [activeSpecials, setActiveSpecials] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Count active filters
  const activeFilterCount =
    activeThemes.size + activeLevels.size + activeSpecials.size;

  const clearAllFilters = () => {
    setActiveThemes(new Set());
    setActiveLevels(new Set());
    setActiveSpecials(new Set());
  };

  const toggleFilter = (
    slug: string,
    setter: React.Dispatch<React.SetStateAction<Set<string>>>
  ) => {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const filteredAgents = useMemo(() => {
    let agents = allAgents;

    // Apply theme filters
    if (activeThemes.size > 0) {
      const allowed = new Set<string>();
      activeThemes.forEach((slug) => {
        (themeAgentMap[slug] || []).forEach((id) => allowed.add(id));
      });
      if (allowed.size > 0) {
        agents = agents.filter((a) => allowed.has(a.id));
      }
    }

    // Apply level filters
    if (activeLevels.size > 0) {
      agents = agents.filter((a) => {
        if (activeLevels.has("iniciantes") && a.level === "Iniciante")
          return true;
        if (activeLevels.has("avancados") && a.level === "Avançado")
          return true;
        if (activeLevels.has("criancas") && a.level === "Iniciante")
          return true;
        if (
          activeLevels.has("avancados") &&
          (a.level === "Avançado" || a.level === "Expert")
        )
          return true;
        return false;
      });
    }

    // Apply special filters (soft — any agent can match)
    // These are primarily UI filtering, not strict agent mapping
    if (activeSpecials.size > 0) {
      // For now, specials are treated as "show all" since they're
      // experience-based filters, not agent-category filters
      // Keep all agents that passed previous filters
    }

    // Apply search query
    if (searchQuery.length > 0) {
      const q = searchQuery.toLowerCase();
      agents = agents.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }

    return agents;
  }, [activeThemes, activeLevels, activeSpecials, searchQuery]);

  return (
    <div className="min-h-screen" style={{ background: "var(--cyber-black)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 px-6 py-4 border-b border-white/5"
        style={{
          background: "rgba(10,10,26,0.92)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            <span style={{ fontFamily: "var(--font-display)" }}>
              Explorar
            </span>
          </h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Search bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = (e.currentTarget.elements.namedItem("q") as HTMLInputElement);
            const q = input?.value?.trim();
            if (q) {
              window.location.href = `/explorar?q=${encodeURIComponent(q)}`;
            }
          }}
          className="mb-8"
        >
          <div className="relative max-w-xl">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              name="q"
              type="text"
              defaultValue={searchQuery}
              placeholder="Buscar agentes, aulas, temas..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-white/20 focus:bg-white/8 transition"
            />
            {searchQuery && (
              <Link
                href="/explorar"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                <X size={16} />
              </Link>
            )}
          </div>
        </form>

        {/* ─── Filter Sections ─────────────────────────────────────────── */}

        {/* Section 1: Por Tema */}
        <section className="mb-8">
          <SectionTitle>Por Tema</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <FilterTag
                key={t.slug}
                label={t.label}
                active={activeThemes.has(t.slug)}
                onClick={() => toggleFilter(t.slug, setActiveThemes)}
              />
            ))}
          </div>
        </section>

        {/* Section 2: Por Nível */}
        <section className="mb-8">
          <SectionTitle>Por Nível</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <FilterTag
                key={l.slug}
                label={l.label}
                active={activeLevels.has(l.slug)}
                onClick={() => toggleFilter(l.slug, setActiveLevels)}
                accentColor="var(--neon-purple)"
              />
            ))}
          </div>
        </section>

        {/* Section 3: Especiais */}
        <section className="mb-8">
          <SectionTitle>Especiais</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {SPECIALS.map((s) => (
              <FilterTag
                key={s.slug}
                label={s.label}
                active={activeSpecials.has(s.slug)}
                onClick={() => toggleFilter(s.slug, setActiveSpecials)}
                accentColor="var(--neon-pink)"
              />
            ))}
          </div>
        </section>

        {/* Active filter bar */}
        <AnimatePresence>
          {activeFilterCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 mb-6 py-3"
            >
              <span className="text-sm text-gray-400">
                <span className="text-white font-semibold">
                  {activeFilterCount}
                </span>{" "}
                filtro{activeFilterCount !== 1 ? "s" : ""} ativo
                {activeFilterCount !== 1 ? "s" : ""}
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-white transition underline underline-offset-2"
              >
                Limpar filtros
              </button>
              <span className="text-gray-600 text-sm">
                • {filteredAgents.length} resultado
                {filteredAgents.length !== 1 ? "s" : ""}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results heading */}
        <div className="mb-6">
          {searchQuery ? (
            <h2 className="text-xl font-bold text-white" style={{ fontSize: "1.5rem" }}>
              Resultados para &quot;{searchQuery}&quot;
            </h2>
          ) : activeFilterCount > 0 ? (
            <h2 className="text-xl font-bold text-white" style={{ fontSize: "1.5rem" }}>
              Agentes filtrados
            </h2>
          ) : (
            <h2 className="text-xl font-bold text-white" style={{ fontSize: "1.5rem" }}>
              Todos os agentes
            </h2>
          )}
          <p className="mt-1 text-sm text-gray-400">
            {filteredAgents.length} agente
            {filteredAgents.length !== 1 ? "s" : ""} disponívei
            {filteredAgents.length === 1 ? "s" : "l"}
          </p>
        </div>

        {/* Results grid */}
        {filteredAgents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">
              Nenhum agente encontrado
            </p>
            <p className="text-gray-600 text-sm">
              Tente ajustar os filtros ou a busca.
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-5 py-2 rounded-lg text-sm font-medium transition"
                style={{
                  background: "rgba(0,240,255,0.1)",
                  color: "var(--neon-cyan)",
                  border: "1px solid rgba(0,240,255,0.2)",
                }}
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredAgents.map((agent) => (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/agentes/${agent.id}`}
                    className="group block"
                    onMouseEnter={() => setHoveredId(agent.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div
                      className="relative aspect-[2/3] rounded-md overflow-hidden border border-white/5 group-hover:border-white/20 transition-all duration-300"
                      style={{
                        background: `linear-gradient(145deg, ${agent.color}33 0%, #0f0f0f 100%)`,
                        boxShadow:
                          hoveredId === agent.id
                            ? `0 8px 32px ${agent.color}22`
                            : undefined,
                      }}
                    >
                      <img
                        src={agent.image}
                        alt={agent.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        draggable={false}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "/images/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span
                          className="inline-block px-2 py-0.5 text-white font-bold rounded mb-1"
                          style={{ background: agent.color, fontSize: "0.75rem" }}
                        >
                          {agent.category}
                        </span>
                        <p className="font-bold text-white leading-tight" style={{ fontSize: "1rem" }}>
                          {agent.name}
                        </p>
                        <p className="text-gray-400 mt-0.5 line-clamp-2" style={{ fontSize: "0.85rem" }}>
                          {agent.description}
                        </p>
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs font-bold text-gray-300 truncate">
                      {agent.name}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {agent.role}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "var(--cyber-black)" }}
        >
          <div className="text-gray-500 text-sm">Carregando...</div>
        </div>
      }
    >
      <ExplorarContent />
    </Suspense>
  );
}
