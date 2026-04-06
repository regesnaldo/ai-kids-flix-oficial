import type { FaseMetaverso, Temporada } from "@/types/temporada";

export const FASES: FaseMetaverso[] = [
  {
    id: 1,
    nome: "Despertar",
    descricao:
      "O usuário descobre que existe um universo de IA. NEXUS é o único guia. As primeiras escolhas moldam o perfil narrativo do usuário para as próximas fases.",
    temporadas: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    agentesAtivos: ["nexus"],
    metaNarrativa: "Estabelecer perfil do usuário (D1/D2/D3) e apresentar NEXUS como guia central",
  },
  {
    id: 2,
    nome: "Tensão",
    descricao:
      "O usuário começa a interagir com agentes além de NEXUS. Conflitos emergem. As decisões do usuário passam a afetar o estado global da narrativa.",
    temporadas: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    agentesAtivos: ["nexus", "volt", "janus", "stratos", "kaos", "ethos", "axim", "cipher"],
    metaNarrativa: "Introduzir conflitos VOLT×ETHOS e KAOS×STRATOS. Usuário navega tensões.",
  },
  {
    id: 3,
    nome: "Coletivo",
    descricao:
      "Múltiplos usuários no mesmo universo. As escolhas coletivas passam a afetar o estado global da narrativa. O conflito CIPHER×AURORA emerge.",
    temporadas: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    agentesAtivos: ["nexus", "volt", "kaos", "ethos", "aurora", "cipher", "axim", "stratos"],
    metaNarrativa: "Conectar decisões individuais ao impacto coletivo.",
  },
  {
    id: 4,
    nome: "Revelação",
    descricao:
      "Os avatares dos usuários se tornam visíveis no metaverso. PRISM entra em cena revelando padrões que atravessam todas as narrativas anteriores.",
    temporadas: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40],
    agentesAtivos: ["nexus", "prism", "cipher", "aurora", "terra", "lyra", "janus"],
    metaNarrativa: "Síntese de padrões e consequências.",
  },
  {
    id: 5,
    nome: "Coautoria",
    descricao:
      "O usuário não é mais um observador — é um agente do metaverso. Pode criar conteúdo, influenciar outros usuários e co-criar com NEXUS.",
    temporadas: [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
    agentesAtivos: ["nexus", "prism", "volt", "kaos", "ethos", "aurora", "cipher", "terra", "axim", "stratos", "lyra", "janus"],
    metaNarrativa: "Usuário como coautor do ecossistema.",
  },
];

export const TEMPORADAS_DESTAQUE: Temporada[] = [
  {
    id: 1,
    titulo: "O Primeiro Contato com NEXUS",
    descricao: "Descoberta inicial da arquitetura do metaverso.",
    agentesAtivos: ["nexus"],
    objetivoNarrativo: "Criar vínculo e curiosidade.",
  },
  {
    id: 14,
    titulo: "A Voz de NEXUS no Caos",
    descricao: "Conflitos entre ação e prudência começam a escalar.",
    agentesAtivos: ["nexus", "volt", "ethos", "kaos", "stratos"],
    objetivoNarrativo: "Treinar decisão sob tensão.",
  },
  {
    id: 44,
    titulo: "Co-Criando com NEXUS",
    descricao: "Usuário atua como agente dentro da narrativa.",
    agentesAtivos: ["nexus", "prism", "terra", "aurora"],
    objetivoNarrativo: "Transição de usuário para coautor.",
  },
];

export const AGENTES_FASE_FINAL = [
  "nexus",
  "prism",
  "volt",
  "kaos",
  "ethos",
  "aurora",
  "cipher",
  "terra",
  "axim",
  "stratos",
  "lyra",
  "janus",
] as const;

