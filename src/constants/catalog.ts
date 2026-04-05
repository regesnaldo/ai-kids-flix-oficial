// ============================================================
// MENTE.AI — Catálogo de Conteúdo (Padrão Netflix Original)
// Estrutura: 5 Fases → 50 Temporadas → 10 Episódios cada
// Total: 500 módulos de aprendizado
// ============================================================

// ─────────────────────────────────────────────────────────────
// TIPOS BASE
// ─────────────────────────────────────────────────────────────

export type AgentId =
  | "NEXUS"
  | "VOLT"
  | "JANUS"
  | "STRATOS"
  | "KAOS"
  | "ETHOS"
  | "LYRA"
  | "AXIOM"
  | "AURORA"
  | "CIPHER"
  | "TERRA"
  | "PRISM";

export type PhaseId = 1 | 2 | 3 | 4 | 5;

export type EpisodeType =
  | "teoria"
  | "laboratorio"
  | "desafio"
  | "narrativa"
  | "reflexao";

export type EpisodeStatus = "disponivel" | "bloqueado" | "em_breve";

export interface Episode {
  id: string;
  number: number;
  title: string;
  description: string;
  type: EpisodeType;
  durationMinutes: number;
  agentId: AgentId;
  xpReward: number;
  status: EpisodeStatus;
  labZone?: "transformers" | "neural" | "creative" | "ethics";
}

export interface Season {
  id: string;
  number: number;
  title: string;
  synopsis: string;
  phaseId: PhaseId;
  primaryAgent: AgentId;
  coverImageUrl: string;
  totalXp: number;
  episodes: Episode[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface Phase {
  id: PhaseId;
  name: string;
  theme: string;
  colorHex: string;
  seasons: Season[];
}

// ─────────────────────────────────────────────────────────────
// HELPER — fábrica de episódio padrão
// ─────────────────────────────────────────────────────────────

function makeEpisode(seasonNumber: number, ep: number, partial: Omit<Episode, "id" | "number">): Episode {
  const sid = String(seasonNumber).padStart(2, "0");
  const eid = String(ep).padStart(2, "0");
  return { id: `S${sid}E${eid}`, number: ep, ...partial };
}

function agentCover(agent: string) {
  return `/images/agentes/${agent}.png`;
}

// ─────────────────────────────────────────────────────────────
// FASE 1 — "Despertar" (Temporadas 1–10)
// Introdução ao mundo da IA; agentes NEXUS e VOLT em destaque
// ─────────────────────────────────────────────────────────────

const SEASON_01: Season = {
  id: "S01",
  number: 1,
  title: "O Início de Tudo",
  synopsis:
    "NEXUS acorda. Pela primeira vez, uma mente artificial percebe que existe — e convida você a explorar a origem da inteligência.",
  phaseId: 1,
  primaryAgent: "NEXUS",
  coverImageUrl: agentCover("nexus"),
  totalXp: 550,
  isNew: true,
  isFeatured: true,
  episodes: [
    makeEpisode(1, 1, {
      title: "O que é Inteligência?",
      description: "NEXUS apresenta o conceito de inteligência natural x artificial em uma conversa filosófica.",
      type: "narrativa",
      durationMinutes: 8,
      agentId: "NEXUS",
      xpReward: 50,
      status: "disponivel",
    }),
    makeEpisode(1, 2, {
      title: "Dados: O Combustível da IA",
      description: "Entenda o que são dados e por que eles são a matéria-prima de toda IA moderna.",
      type: "teoria",
      durationMinutes: 10,
      agentId: "NEXUS",
      xpReward: 55,
      status: "disponivel",
    }),
    makeEpisode(1, 3, {
      title: "Laboratório: Classificador Visual",
      description: "No laboratório de Redes Neurais, treine seu primeiro classificador de imagens com NEXUS.",
      type: "laboratorio",
      durationMinutes: 15,
      agentId: "NEXUS",
      xpReward: 70,
      status: "disponivel",
      labZone: "neural",
    }),
    makeEpisode(1, 4, {
      title: "Máquinas que Aprendem",
      description: "Diferença entre programação tradicional e Machine Learning explicada com analogias do cotidiano.",
      type: "teoria",
      durationMinutes: 10,
      agentId: "NEXUS",
      xpReward: 55,
      status: "disponivel",
    }),
    makeEpisode(1, 5, {
      title: "Desafio: Quiz de Fundamentos",
      description: "Teste seu conhecimento sobre os conceitos básicos de IA. Ganhe XP bônus com 100%.",
      type: "desafio",
      durationMinutes: 12,
      agentId: "NEXUS",
      xpReward: 80,
      status: "disponivel",
    }),
    makeEpisode(1, 6, {
      title: "A Memória das Máquinas",
      description: 'Como os modelos de IA "lembram" o que aprenderam? NEXUS explica pesos e parâmetros.',
      type: "teoria",
      durationMinutes: 9,
      agentId: "NEXUS",
      xpReward: 55,
      status: "disponivel",
    }),
    makeEpisode(1, 7, {
      title: "Laboratório: Explorador de Tokens",
      description: "Visualize como o texto é tokenizado antes de entrar num modelo de linguagem.",
      type: "laboratorio",
      durationMinutes: 12,
      agentId: "NEXUS",
      xpReward: 65,
      status: "disponivel",
      labZone: "transformers",
    }),
    makeEpisode(1, 8, {
      title: "Bias: Quando a IA Erra",
      description: "ETHOS aparece pela primeira vez para discutir os perigos do viés nos dados de treinamento.",
      type: "narrativa",
      durationMinutes: 10,
      agentId: "ETHOS",
      xpReward: 55,
      status: "disponivel",
    }),
    makeEpisode(1, 9, {
      title: "O Futuro já Chegou",
      description: "Uma viagem pelas aplicações reais de IA em saúde, arte, ciência e entretenimento.",
      type: "teoria",
      durationMinutes: 11,
      agentId: "NEXUS",
      xpReward: 60,
      status: "disponivel",
    }),
    makeEpisode(1, 10, {
      title: "Reflexão: Como Você se Sente Sobre IA?",
      description: "NEXUS detecta seu estado emocional após a primeira temporada e personaliza sua jornada futura.",
      type: "reflexao",
      durationMinutes: 6,
      agentId: "NEXUS",
      xpReward: 50,
      status: "disponivel",
    }),
  ],
};

const SEASON_02: Season = {
  id: "S02",
  number: 2,
  title: "VOLT Entra em Cena",
  synopsis:
    "O agente de energia e velocidade revela como redes neurais processam informação em frações de segundo.",
  phaseId: 1,
  primaryAgent: "VOLT",
  coverImageUrl: agentCover("volt"),
  totalXp: 580,
  episodes: [
    makeEpisode(2, 1, {
      title: "Neurônios Artificiais",
      description: "O bloco básico de toda rede neural.",
      type: "teoria",
      durationMinutes: 9,
      agentId: "VOLT",
      xpReward: 55,
      status: "disponivel",
    }),
    makeEpisode(2, 2, {
      title: 'Camadas e Profundidade',
      description: 'O que torna uma rede "profunda" (deep learning).',
      type: "teoria",
      durationMinutes: 10,
      agentId: "VOLT",
      xpReward: 55,
      status: "disponivel",
    }),
    makeEpisode(2, 3, {
      title: "Laboratório: Rede Neural Visual",
      description: "Construa e visualize uma rede simples camada a camada.",
      type: "laboratorio",
      durationMinutes: 18,
      agentId: "VOLT",
      xpReward: 75,
      status: "disponivel",
      labZone: "neural",
    }),
    makeEpisode(2, 4, {
      title: "Funções de Ativação",
      description: "ReLU, Sigmoid e Tanh: quando usar cada uma.",
      type: "teoria",
      durationMinutes: 10,
      agentId: "VOLT",
      xpReward: 55,
      status: "disponivel",
    }),
    makeEpisode(2, 5, {
      title: "Backpropagation Simplificado",
      description: 'Como a rede "aprende com os erros".',
      type: "teoria",
      durationMinutes: 12,
      agentId: "VOLT",
      xpReward: 60,
      status: "disponivel",
    }),
    makeEpisode(2, 6, {
      title: "Desafio: Arquiteto de Redes",
      description: "Monte a arquitetura correta para cada problema.",
      type: "desafio",
      durationMinutes: 14,
      agentId: "VOLT",
      xpReward: 80,
      status: "disponivel",
    }),
    makeEpisode(2, 7, {
      title: "Overfitting e Underfitting",
      description: 'Por que uma rede que "decorou" não é inteligente.',
      type: "teoria",
      durationMinutes: 10,
      agentId: "VOLT",
      xpReward: 55,
      status: "disponivel",
    }),
    makeEpisode(2, 8, {
      title: "Laboratório: Playground Neural",
      description: "Ajuste hiperparâmetros e veja o impacto em tempo real.",
      type: "laboratorio",
      durationMinutes: 20,
      agentId: "VOLT",
      xpReward: 80,
      status: "bloqueado",
      labZone: "neural",
    }),
    makeEpisode(2, 9, {
      title: "CNNs: Visão Computacional",
      description: "Como máquinas enxergam imagens com redes convolucionais.",
      type: "teoria",
      durationMinutes: 12,
      agentId: "VOLT",
      xpReward: 60,
      status: "bloqueado",
    }),
    makeEpisode(2, 10, {
      title: "Reflexão: Você Pensa Como uma Rede?",
      description: "VOLT compara o processamento humano ao artificial.",
      type: "reflexao",
      durationMinutes: 7,
      agentId: "VOLT",
      xpReward: 50,
      status: "bloqueado",
    }),
  ],
};

const SEASONS_03_TO_10: Season[] = Array.from({ length: 8 }, (_, i) => ({
  id: `S${String(i + 3).padStart(2, "0")}`,
  number: i + 3,
  title: `Temporada ${i + 3} — Em Breve`,
  synopsis: "Esta temporada está sendo produzida pela equipe MENTE.AI.",
  phaseId: 1 as PhaseId,
  primaryAgent: (["JANUS", "STRATOS", "KAOS", "ETHOS", "LYRA", "AXIOM", "AURORA", "CIPHER"] as AgentId[])[i],
  coverImageUrl: agentCover((["janus", "stratos", "kaos", "ethos", "lyra", "axiom", "aurora", "cipher"] as const)[i]),
  totalXp: 0,
  episodes: [],
}));

// ─────────────────────────────────────────────────────────────
// FASES 2–5: Estrutura reservada (expansão futura)
// ─────────────────────────────────────────────────────────────

const PLACEHOLDER_PHASES: Omit<Phase, "seasons">[] = [
  { id: 2, name: "Construção", theme: "Criar com IA: LLMs, imagens e código gerado", colorHex: "#3B82F6" },
  { id: 3, name: "Criação", theme: "IA criativa: arte, música e narrativa generativa", colorHex: "#8B5CF6" },
  { id: 4, name: "Ética", theme: "Responsabilidade, viés e o futuro da sociedade", colorHex: "#EF4444" },
  { id: 5, name: "Maestria", theme: "Projetos avançados e construção de agentes próprios", colorHex: "#F59E0B" },
];

// ─────────────────────────────────────────────────────────────
// CATÁLOGO FINAL EXPORTADO
// ─────────────────────────────────────────────────────────────

export const CATALOG: Phase[] = [
  {
    id: 1,
    name: "Despertar",
    theme: "Fundamentos da Inteligência Artificial",
    colorHex: "#10B981",
    seasons: [SEASON_01, SEASON_02, ...SEASONS_03_TO_10],
  },
  ...PLACEHOLDER_PHASES.map((p) => ({ ...p, seasons: [] })),
];

// ─────────────────────────────────────────────────────────────
// UTILITÁRIOS DE CONSULTA
// ─────────────────────────────────────────────────────────────

export function getSeasonById(seasonId: string): Season | undefined {
  for (const phase of CATALOG) {
    const found = phase.seasons.find((s) => s.id === seasonId);
    if (found) return found;
  }
  return undefined;
}

export function getEpisodeById(episodeId: string): Episode | undefined {
  const seasonId = episodeId.slice(0, 3);
  return getSeasonById(seasonId)?.episodes.find((e) => e.id === episodeId);
}

export function getSeasonsByAgent(agentId: AgentId): Season[] {
  return CATALOG.flatMap((p) => p.seasons.filter((s) => s.primaryAgent === agentId));
}

export function getFeaturedSeasons(): Season[] {
  return CATALOG.flatMap((p) => p.seasons.filter((s) => s.isFeatured));
}

export function getTotalCatalogXp(): number {
  return CATALOG.flatMap((p) => p.seasons).reduce((acc, s) => acc + s.totalXp, 0);
}
