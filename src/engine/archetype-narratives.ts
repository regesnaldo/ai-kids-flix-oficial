/**
 * ─── ARCHETYPE NARRATIVES ──────────────────────────────────────────
 *
 * Defines the narrative themes and descriptions for each archetype.
 * Used by the Adaptive Narrative Director to suggest narrative paths.
 *
 * Phase 0: static descriptions per archetype.
 * Phase 2: dynamic narrative generation via LangChain.
 */

export type Archetype = "analytical" | "rebel" | "paralyzed" | "empathetic" | "strategic" | "creative";

export interface ArchetypeNarrative {
  /** Archetype identifier */
  archetype: Archetype;
  /** Display title */
  title: string;
  /** Short description */
  description: string;
  /** Narrative theme */
  theme: string;
  /** Tags for filtering and categorization */
  tags: string[];
}

export const ARCHETYPE_NARRATIVES: Record<Archetype, ArchetypeNarrative> = {
  analytical: {
    archetype: "analytical",
    title: "Jornada da Razão",
    description: "Explore os universos lógicos de NEXUS e AXIOM. Cada escolha é uma variável — cada consequência, uma equação a ser resolvida.",
    theme: "lógica e estrutura",
    tags: ["razão", "análise", "estrutura"],
  },
  rebel: {
    archetype: "rebel",
    title: "Jornada da Ruptura",
    description: "Desafie as regras do metaverso em KAOS e questione os limites éticos em ETHOS. A rebelião é o motor da mudança.",
    theme: "ruptura e questionamento",
    tags: ["rebeldia", "ruptura", "ética"],
  },
  paralyzed: {
    archetype: "paralyzed",
    title: "Jornada do Impulso",
    description: "VOLT te chama para agir. O medo paralisa — a energia transforma. Um passo de cada vez.",
    theme: "superação e ação",
    tags: ["energia", "ação", "superação"],
  },
  empathetic: {
    archetype: "empathetic",
    title: "Jornada da Conexão",
    description: "TERRA e LYRA te guiam pelas emoções. A empatia é sua bússola — as conexões, seu mapa.",
    theme: "emoção e conexão",
    tags: ["empatia", "conexão", "emoção"],
  },
  strategic: {
    archetype: "strategic",
    title: "Jornada da Estratégia",
    description: "STRATOS vê o tabuleiro completo. Cada movimento é calculado — cada vitória, planejada.",
    theme: "estratégia e visão",
    tags: ["estratégia", "visão", "planejamento"],
  },
  creative: {
    archetype: "creative",
    title: "Jornada da Imaginação",
    description: "PRISM e AURORA te convidam a criar. O metaverso é sua tela — a imaginação, seu pincel.",
    theme: "criatividade e expressão",
    tags: ["criatividade", "expressão", "imaginação"],
  },
};
