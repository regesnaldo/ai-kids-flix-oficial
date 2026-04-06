import type { UniversoId } from "@/data/universos";

export type FaseTematicaId = 1 | 2 | 3 | 4 | 5;

type AgentRef = UniversoId | "todos";

export interface MasterPhase {
  id: FaseTematicaId;
  nome: string;
  temporadas: [number, number];
  temaCentral: string;
  agentesDominantes: AgentRef[];
  objetivoPedagogico: string;
}

export interface MasterSeason {
  temporada: number;
  fase: FaseTematicaId;
  tema: string;
  agenteDominante: AgentRef;
  agentesSuporte: AgentRef[];
}

export interface MasterConflict {
  fase: FaseTematicaId;
  conflitosCentrais: string;
  funcaoNarrativa: string;
}

export const MASTER_PHASES: MasterPhase[] = [
  {
    id: 1,
    nome: "Fundamentos da IA",
    temporadas: [1, 10],
    temaCentral: "Desmistificação, curiosidade e primeiras escolhas",
    agentesDominantes: ["nexus", "axim", "cipher"],
    objetivoPedagogico: "Criar base conceitual e visão prática inicial",
  },
  {
    id: 2,
    nome: "IA criativa e emocional",
    temporadas: [11, 20],
    temaCentral: "Co-criação entre usuário e IA",
    agentesDominantes: ["lyra", "aurora", "kaos"],
    objetivoPedagogico: "Experimentar criatividade assistida e direção estética",
  },
  {
    id: 3,
    nome: "IA e ética",
    temporadas: [21, 30],
    temaCentral: "Viés, privacidade, poder e responsabilidade",
    agentesDominantes: ["ethos", "terra", "cipher", "stratos"],
    objetivoPedagogico: "Tornar decisão moral concreta e aplicada",
  },
  {
    id: 4,
    nome: "IA e futuro da humanidade",
    temporadas: [31, 40],
    temaCentral: "AGI, coexistência e governança coletiva",
    agentesDominantes: ["nexus", "stratos", "ethos", "prism"],
    objetivoPedagogico: "Avaliar cenários sistêmicos e escolhas de longo prazo",
  },
  {
    id: 5,
    nome: "Legado e construção",
    temporadas: [41, 50],
    temaCentral: "Projetos reais com IA e síntese da jornada",
    agentesDominantes: ["volt", "aurora", "nexus"],
    objetivoPedagogico: "Converter aprendizado em projeto e impacto",
  },
];

export const MASTER_SEASONS: MasterSeason[] = [
  { temporada: 1, fase: 1, tema: "O que é inteligência?", agenteDominante: "nexus", agentesSuporte: ["janus"] },
  { temporada: 2, fase: 1, tema: "Padrões e reconhecimento", agenteDominante: "nexus", agentesSuporte: ["axim"] },
  { temporada: 3, fase: 1, tema: "Aprendizado de máquina básico", agenteDominante: "axim", agentesSuporte: ["nexus"] },
  { temporada: 4, fase: 1, tema: "Dados: combustível da IA", agenteDominante: "axim", agentesSuporte: ["cipher"] },
  { temporada: 5, fase: 1, tema: "Redes neurais e inspiração biológica", agenteDominante: "nexus", agentesSuporte: ["axim"] },
  { temporada: 6, fase: 1, tema: "IA em imagem", agenteDominante: "cipher", agentesSuporte: ["axim"] },
  { temporada: 7, fase: 1, tema: "IA em fala", agenteDominante: "nexus", agentesSuporte: ["lyra"] },
  { temporada: 8, fase: 1, tema: "IA em texto", agenteDominante: "nexus", agentesSuporte: ["kaos"] },
  { temporada: 9, fase: 1, tema: "Recomendação e personalização", agenteDominante: "stratos", agentesSuporte: ["cipher"] },
  { temporada: 10, fase: 1, tema: "Projeto guiado de fundamentos", agenteDominante: "nexus", agentesSuporte: ["volt"] },
  { temporada: 11, fase: 2, tema: "A IA pode criar arte?", agenteDominante: "lyra", agentesSuporte: ["aurora"] },
  { temporada: 12, fase: 2, tema: "Geração de texto", agenteDominante: "kaos", agentesSuporte: ["nexus"] },
  { temporada: 13, fase: 2, tema: "Música generativa", agenteDominante: "lyra", agentesSuporte: ["axim"] },
  { temporada: 14, fase: 2, tema: "Deepfakes: poder e perigo", agenteDominante: "cipher", agentesSuporte: ["ethos"] },
  { temporada: 15, fase: 2, tema: "Co-criação visual", agenteDominante: "aurora", agentesSuporte: ["lyra"] },
  { temporada: 16, fase: 2, tema: "Co-criação narrativa", agenteDominante: "kaos", agentesSuporte: ["lyra"] },
  { temporada: 17, fase: 2, tema: "Co-criação de personagens", agenteDominante: "aurora", agentesSuporte: ["janus"] },
  { temporada: 18, fase: 2, tema: "Co-criação com restrições", agenteDominante: "stratos", agentesSuporte: ["kaos"] },
  { temporada: 19, fase: 2, tema: "Curadoria criativa com IA", agenteDominante: "cipher", agentesSuporte: ["lyra"] },
  { temporada: 20, fase: 2, tema: "Showcase criativo do usuário", agenteDominante: "lyra", agentesSuporte: ["aurora"] },
  { temporada: 21, fase: 3, tema: "Viés algorítmico", agenteDominante: "ethos", agentesSuporte: ["cipher"] },
  { temporada: 22, fase: 3, tema: "Privacidade e vigilância", agenteDominante: "cipher", agentesSuporte: ["ethos"] },
  { temporada: 23, fase: 3, tema: "Automação e empregos", agenteDominante: "stratos", agentesSuporte: ["ethos"] },
  { temporada: 24, fase: 3, tema: "IA em saúde: risco e responsabilidade", agenteDominante: "terra", agentesSuporte: ["ethos"] },
  { temporada: 25, fase: 3, tema: "Transparência e explicabilidade", agenteDominante: "axim", agentesSuporte: ["ethos"] },
  { temporada: 26, fase: 3, tema: "Responsabilidade legal em IA", agenteDominante: "ethos", agentesSuporte: ["stratos"] },
  { temporada: 27, fase: 3, tema: "IA e desinformação", agenteDominante: "cipher", agentesSuporte: ["terra"] },
  { temporada: 28, fase: 3, tema: "IA e educação: inclusão vs viés", agenteDominante: "terra", agentesSuporte: ["nexus"] },
  { temporada: 29, fase: 3, tema: "Regulação global", agenteDominante: "stratos", agentesSuporte: ["ethos"] },
  { temporada: 30, fase: 3, tema: "Carta ética do usuário", agenteDominante: "ethos", agentesSuporte: ["terra"] },
  { temporada: 31, fase: 4, tema: "O que é AGI?", agenteDominante: "nexus", agentesSuporte: ["axim"] },
  { temporada: 32, fase: 4, tema: "Utopia vs distopia", agenteDominante: "stratos", agentesSuporte: ["ethos"] },
  { temporada: 33, fase: 4, tema: "IA e consciência", agenteDominante: "prism", agentesSuporte: ["nexus"] },
  { temporada: 34, fase: 4, tema: "Quem decide o futuro?", agenteDominante: "nexus", agentesSuporte: ["todos"] },
  { temporada: 35, fase: 4, tema: "Simulação de governança IA", agenteDominante: "stratos", agentesSuporte: ["cipher"] },
  { temporada: 36, fase: 4, tema: "Risco sistêmico e mitigação", agenteDominante: "ethos", agentesSuporte: ["stratos"] },
  { temporada: 37, fase: 4, tema: "Futuro do trabalho cognitivo", agenteDominante: "stratos", agentesSuporte: ["volt"] },
  { temporada: 38, fase: 4, tema: "Cultura humana em era de IA", agenteDominante: "janus", agentesSuporte: ["lyra"] },
  { temporada: 39, fase: 4, tema: "Escolhas coletivas do metaverso", agenteDominante: "nexus", agentesSuporte: ["terra"] },
  { temporada: 40, fase: 4, tema: "Plebiscito final da fase", agenteDominante: "nexus", agentesSuporte: ["prism"] },
  { temporada: 41, fase: 5, tema: "Sua primeira IA", agenteDominante: "volt", agentesSuporte: ["aurora"] },
  { temporada: 42, fase: 5, tema: "Projeto 1: IA para estudo", agenteDominante: "axim", agentesSuporte: ["volt"] },
  { temporada: 43, fase: 5, tema: "Projeto 2: IA para criatividade", agenteDominante: "lyra", agentesSuporte: ["aurora"] },
  { temporada: 44, fase: 5, tema: "Projeto 3: IA para impacto social", agenteDominante: "terra", agentesSuporte: ["ethos"] },
  { temporada: 45, fase: 5, tema: "Projeto 4: IA para negócios", agenteDominante: "stratos", agentesSuporte: ["cipher"] },
  { temporada: 46, fase: 5, tema: "Projeto 5: IA multimodal", agenteDominante: "nexus", agentesSuporte: ["axim"] },
  { temporada: 47, fase: 5, tema: "Projeto 6: IA responsável", agenteDominante: "ethos", agentesSuporte: ["terra"] },
  { temporada: 48, fase: 5, tema: "Projeto 7: produto final do usuário", agenteDominante: "volt", agentesSuporte: ["stratos"] },
  { temporada: 49, fase: 5, tema: "Última conversa com NEXUS", agenteDominante: "nexus", agentesSuporte: ["janus"] },
  { temporada: 50, fase: 5, tema: "Cerimônia de conclusão", agenteDominante: "nexus", agentesSuporte: ["todos"] },
];

export const MASTER_CONFLICTS: MasterConflict[] = [
  { fase: 1, conflitosCentrais: "NEXUS vs simplificação rasa; AXIM vs achismo", funcaoNarrativa: "Criar rigor sem matar curiosidade" },
  { fase: 2, conflitosCentrais: "KAOS vs STRATOS; LYRA vs CIPHER", funcaoNarrativa: "Equilibrar liberdade criativa e verificação" },
  { fase: 3, conflitosCentrais: "ETHOS vs VOLT; TERRA vs ganho individual", funcaoNarrativa: "Tornar impacto moral concreto" },
  { fase: 4, conflitosCentrais: "Utopia (AURORA) vs risco sistêmico (ETHOS/CIPHER)", funcaoNarrativa: "Simular governança e escolhas coletivas" },
  { fase: 5, conflitosCentrais: "Velocidade de entrega (VOLT) vs responsabilidade (ETHOS/TERRA)", funcaoNarrativa: "Converter aprendizado em legado sustentável" },
];

export function getMasterSeason(temporada: number): MasterSeason | null {
  return MASTER_SEASONS.find((item) => item.temporada === temporada) ?? null;
}

export function getMasterPhase(fase: FaseTematicaId): MasterPhase | null {
  return MASTER_PHASES.find((item) => item.id === fase) ?? null;
}
