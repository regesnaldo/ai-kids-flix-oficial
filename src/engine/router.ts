export type ArchetypeId =
  | "analitico"
  | "rebelde"
  | "paralisado"
  | "empatico"
  | "estrategico"
  | "criativo";

export interface DimensionSnapshot {
  emocional: number;
  intelectual: number;
  moral: number;
}

export interface RouterInput {
  dimensoes: DimensionSnapshot;
  escolhasRecentes?: string[];
  perfilHint?: ArchetypeId | null;
  lastAgentId?: string | null;
}

export interface RouterResult {
  archetype: ArchetypeId;
  agentId: string;
  secondaryAgentIds: string[];
  scores: Record<ArchetypeId, number>;
}

const KEYWORDS: Record<ArchetypeId, string[]> = {
  analitico: ["dados", "logica", "analise", "metodo", "evidencia", "prova"],
  rebelde: ["quebrar", "desafiar", "regras", "oposto", "provocar", "risco"],
  paralisado: ["nao sei", "talvez", "depois", "travado", "medo", "evitar"],
  empatico: ["pessoas", "impacto", "cuidar", "empatia", "coletivo", "comunidade"],
  estrategico: ["plano", "estrategia", "longo prazo", "roadmap", "execucao", "prioridade"],
  criativo: ["ideia", "imaginar", "criar", "inventar", "novo", "experimentar"],
};

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function normalize(value: string): string {
  return value.toLowerCase().trim();
}

function scoreByChoices(escolhasRecentes: string[]): Record<ArchetypeId, number> {
  const output: Record<ArchetypeId, number> = {
    analitico: 0,
    rebelde: 0,
    paralisado: 0,
    empatico: 0,
    estrategico: 0,
    criativo: 0,
  };

  if (escolhasRecentes.length === 0) return output;

  const normalized = escolhasRecentes.map(normalize);
  const total = normalized.length;

  normalized.forEach((choice, index) => {
    const recencyWeight = (index + 1) / total;

    (Object.keys(KEYWORDS) as ArchetypeId[]).forEach((archetype) => {
      const matches = KEYWORDS[archetype].filter((keyword) => choice.includes(keyword)).length;
      if (matches > 0) {
        output[archetype] += matches * 6 * recencyWeight;
      }
    });
  });

  return output;
}

function scoreByDimensions(dimensoes: DimensionSnapshot): Record<ArchetypeId, number> {
  const emocional = clampScore(dimensoes.emocional);
  const intelectual = clampScore(dimensoes.intelectual);
  const moral = clampScore(dimensoes.moral);

  const paralisiaBruta = 100 - (emocional * 0.55 + intelectual * 0.25 + moral * 0.2);

  return {
    analitico: intelectual * 0.9 + moral * 0.5 + (100 - emocional) * 0.1,
    rebelde: emocional * 1.05 + moral * 0.25 + intelectual * 0.05,
    paralisado: paralisiaBruta,
    empatico: emocional * 0.72 + moral * 0.82,
    estrategico: intelectual * 0.85 + moral * 0.7,
    criativo: emocional * 0.7 + intelectual * 0.55,
  };
}

function selectArchetype(scores: Record<ArchetypeId, number>, hint?: ArchetypeId | null): ArchetypeId {
  if (hint) {
    scores[hint] += 8;
  }

  return (Object.entries(scores) as [ArchetypeId, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
}

function routeByArchetype(archetype: ArchetypeId, dims: DimensionSnapshot): { agentId: string; secondary: string[] } {
  switch (archetype) {
    case "analitico":
      return dims.intelectual >= dims.moral
        ? { agentId: "axiom", secondary: ["nexus"] }
        : { agentId: "nexus", secondary: ["axiom"] };
    case "rebelde":
      return dims.emocional >= dims.moral
        ? { agentId: "kaos", secondary: ["ethos"] }
        : { agentId: "ethos", secondary: ["kaos"] };
    case "paralisado":
      return { agentId: "volt", secondary: [] };
    case "empatico":
      return dims.moral >= dims.emocional
        ? { agentId: "terra", secondary: ["lyra"] }
        : { agentId: "lyra", secondary: ["terra"] };
    case "estrategico":
      return { agentId: "stratos", secondary: [] };
    case "criativo":
      return dims.intelectual >= dims.emocional
        ? { agentId: "prism", secondary: ["aurora"] }
        : { agentId: "aurora", secondary: ["prism"] };
    default:
      return { agentId: "nexus", secondary: [] };
  }
}

function avoidConflictingSequence(
  candidateAgentId: string,
  lastAgentId?: string | null,
): { agentId: string; secondaryAgentIds: string[] } {
  const prev = (lastAgentId ?? "").toLowerCase();
  const next = candidateAgentId.toLowerCase();

  // Regra Sprint B: KAOS vs STRATOS nunca em sequência direta.
  if (prev === "stratos" && next === "kaos") {
    return { agentId: "ethos", secondaryAgentIds: ["kaos"] };
  }
  if (prev === "kaos" && next === "stratos") {
    return { agentId: "nexus", secondaryAgentIds: ["stratos"] };
  }

  return { agentId: candidateAgentId, secondaryAgentIds: [] };
}

export function routeAgent(input: RouterInput): RouterResult {
  const byDimensions = scoreByDimensions(input.dimensoes);
  const byChoices = scoreByChoices(input.escolhasRecentes ?? []);

  const scores: Record<ArchetypeId, number> = {
    analitico: byDimensions.analitico + byChoices.analitico,
    rebelde: byDimensions.rebelde + byChoices.rebelde,
    paralisado: byDimensions.paralisado + byChoices.paralisado,
    empatico: byDimensions.empatico + byChoices.empatico,
    estrategico: byDimensions.estrategico + byChoices.estrategico,
    criativo: byDimensions.criativo + byChoices.criativo,
  };

  const archetype = selectArchetype(scores, input.perfilHint);
  const route = routeByArchetype(archetype, input.dimensoes);
  const conflictResolved = avoidConflictingSequence(route.agentId, input.lastAgentId);
  const secondaryFromRoute = route.secondary.filter((id) => id !== conflictResolved.agentId);

  return {
    archetype,
    agentId: conflictResolved.agentId,
    secondaryAgentIds: [...secondaryFromRoute, ...conflictResolved.secondaryAgentIds],
    scores,
  };
}
