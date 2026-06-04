// ─── src/services/explorar.service.ts ──────────────────────────────────────

import { allAgents, type HomeAgent } from "@/data/agents";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface FilterCategory {
  slug: string;
  label: string;
  shortLabel: string;
  accentColor: string;
}

export interface ThemeCategory extends FilterCategory {}
export interface LevelOption extends FilterCategory {}
export interface SpecialOption extends FilterCategory {}

export interface FilterConfig {
  themes: ThemeCategory[];
  levels: LevelOption[];
  specials: SpecialOption[];
}

export interface FeaturedAgent {
  agent: HomeAgent;
  reason: string;
}

/* ─── Theme → Agent Mapping ──────────────────────────────────────────────── */

export const themeAgentMap: Record<string, string[]> = {
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

/* ─── Filter Config ──────────────────────────────────────────────────────── */

const THEMES: ThemeCategory[] = [
  { slug: "fundamentos", label: "Fundamentos de IA", shortLabel: "Fundamentos", accentColor: "#3B82F6" },
  { slug: "machine-learning", label: "Machine Learning", shortLabel: "ML", accentColor: "#10B981" },
  { slug: "redes-neurais", label: "Redes Neurais", shortLabel: "Redes", accentColor: "#8B5CF6" },
  { slug: "deep-learning", label: "Deep Learning", shortLabel: "DL", accentColor: "#6366F1" },
  { slug: "computer-vision", label: "Computer Vision", shortLabel: "Visão", accentColor: "#EC4899" },
  { slug: "nlp", label: "Proc. de Linguagem", shortLabel: "NLP", accentColor: "#06B6D4" },
  { slug: "ia-generativa", label: "IA Generativa", shortLabel: "Gen AI", accentColor: "#F59E0B" },
  { slug: "etica-ia", label: "Ética em IA", shortLabel: "Ética", accentColor: "#EF4444" },
  { slug: "ia-criatividade", label: "IA e Criatividade", shortLabel: "Criatividade", accentColor: "#A855F7" },
  { slug: "robotica", label: "Robótica", shortLabel: "Robótica", accentColor: "#64748B" },
  { slug: "ia-criancas", label: "IA para Crianças", shortLabel: "Kids", accentColor: "#34D399" },
  { slug: "ia-negocios", label: "IA nos Negócios", shortLabel: "Negócios", accentColor: "#0EA5E9" },
  { slug: "seguranca", label: "Segurança e IA", shortLabel: "Segurança", accentColor: "#E11D48" },
  { slug: "futuro-ia", label: "Futuro da IA", shortLabel: "Futuro", accentColor: "#7C3AED" },
  { slug: "projetos", label: "Projetos Práticos", shortLabel: "Projetos", accentColor: "#22C55E" },
];

const LEVELS: LevelOption[] = [
  { slug: "iniciantes", label: "Para iniciantes", shortLabel: "Iniciante", accentColor: "#3B82F6" },
  { slug: "avancados", label: "Para avançados", shortLabel: "Avançado", accentColor: "#7C3AED" },
  { slug: "criancas", label: "Para crianças", shortLabel: "Crianças", accentColor: "#F59E0B" },
];

const SPECIALS: SpecialOption[] = [
  { slug: "missoes", label: "Missões especiais", shortLabel: "Missões", accentColor: "#EC4899" },
  { slug: "duplas", label: "Agentes em dupla", shortLabel: "Duplas", accentColor: "#10B981" },
  { slug: "desafios", label: "Desafios", shortLabel: "Desafios", accentColor: "#EF4444" },
];

/* ─── Public API ─────────────────────────────────────────────────────────── */

export function getFilterConfig(): FilterConfig {
  return { themes: THEMES, levels: LEVELS, specials: SPECIALS };
}

export function getFeaturedAgents(count = 3): FeaturedAgent[] {
  const pool = allAgents.filter((a) => a.level === "Avançado" || a.level === "Expert");
  // Sort deterministically by name to avoid hydration mismatch
  const selected = [...pool].sort((a, b) => a.name.localeCompare(b.name)).slice(0, count);
  return selected.map((agent) => ({
    agent,
    reason: agent.category === "Fundamentos"
      ? "Essencial para começar"
      : agent.category === "Ética"
      ? "Guia moral da IA"
      : "Destaque da comunidade",
  }));
}

export function filterAgents(
  agents: HomeAgent[],
  filters: {
    themes: Set<string>;
    levels: Set<string>;
    search: string;
  }
): HomeAgent[] {
  let result = agents;

  // Theme filter
  if (filters.themes.size > 0) {
    const allowed = new Set<string>();
    filters.themes.forEach((slug) => {
      (themeAgentMap[slug] || []).forEach((id) => allowed.add(id));
    });
    if (allowed.size > 0) {
      result = result.filter((a) => allowed.has(a.id));
    }
  }

  // Level filter
  if (filters.levels.size > 0) {
    result = result.filter((a) => {
      if (filters.levels.has("iniciantes") && a.level === "Iniciante") return true;
      if (filters.levels.has("avancados") && (a.level === "Avançado" || a.level === "Expert")) return true;
      if (filters.levels.has("criancas") && a.level === "Iniciante") return true;
      return false;
    });
  }

  // Search
  if (filters.search.length > 0) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
    );
  }

  return result;
}
