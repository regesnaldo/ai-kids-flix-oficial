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
  videoUrl?: string;
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

import { getAgentImage } from '@/lib/getAgentImage';

// Local alias for backward compatibility within this file
const agentCover = getAgentImage;

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

const SEASON_03: Season = {
  id: "S03", number: 3,
  title: "O Paradoxo do Humor",
  synopsis: "JANUS revela por que a inteligência artificial não conta piadas — e o que isso revela sobre nós mesmos.",
  phaseId: 1, primaryAgent: "JANUS",
  coverImageUrl: agentCover("janus"), totalXp: 580,
  episodes: [
    makeEpisode(3, 1, { title: "IA Não Tem Humor?", description: "JANUS explica por que máquinas não entendem piadas — e por que isso é um problema filosófico.", type: "narrativa", durationMinutes: 8, agentId: "JANUS", xpReward: 50, status: "disponivel" }),
    makeEpisode(3, 2, { title: "O Que É Humor?", description: "Teoria do humor: incongruência, superioridade e alívio — qual delas uma IA poderia entender?", type: "teoria", durationMinutes: 10, agentId: "JANUS", xpReward: 55, status: "disponivel" }),
    makeEpisode(3, 3, { title: "Laboratório: Detector de Trolling", description: "Treine um classificador para detectar sarcasmo em textos reais.", type: "laboratorio", durationMinutes: 16, agentId: "JANUS", xpReward: 70, status: "disponivel", labZone: "transformers" }),
    makeEpisode(3, 4, { title: "Paradoxos Lógicos", description: "O paradoxo do mentiroso e outros quebra-cabeças que fazem IAs travar.", type: "teoria", durationMinutes: 9, agentId: "JANUS", xpReward: 55, status: "disponivel" }),
    makeEpisode(3, 5, { title: "Desafio: Pegadinha da IA", description: "JANUS testa sua capacidade de detectar humor em frases geradas por IA.", type: "desafio", durationMinutes: 12, agentId: "JANUS", xpReward: 80, status: "disponivel" }),
    makeEpisode(3, 6, { title: "A Exceção Que Confirma a Regra", description: "Como o humor quebra padrões — e por que isso é tão difícil para modelos estatísticos.", type: "teoria", durationMinutes: 10, agentId: "JANUS", xpReward: 55, status: "disponivel" }),
    makeEpisode(3, 7, { title: "Laboratório: Gerador de Trocadilhos", description: "Use um modelo de linguagem para gerar trocadilhos — e avalie quais funcionam.", type: "laboratorio", durationMinutes: 14, agentId: "JANUS", xpReward: 65, status: "disponivel", labZone: "creative" }),
    makeEpisode(3, 8, { title: "Quando o Humor Ofende", description: "ETHOS e JANUS debatem os limites do humor gerado por IA.", type: "narrativa", durationMinutes: 11, agentId: "ETHOS", xpReward: 60, status: "disponivel" }),
    makeEpisode(3, 9, { title: "Máquinas que Riem", description: "Projetos reais de IA que tentam — e falham — em ser engraçadas.", type: "teoria", durationMinutes: 10, agentId: "JANUS", xpReward: 55, status: "disponivel" }),
    makeEpisode(3, 10, { title: "Reflexão: O Que Te Faz Rir?", description: "JANUS convida você a analisar seu próprio senso de humor e o que ele revela.", type: "reflexao", durationMinutes: 7, agentId: "JANUS", xpReward: 50, status: "disponivel" }),
  ],
};

const SEASON_04: Season = {
  id: "S04", number: 4,
  title: "O Tabuleiro Infinito",
  synopsis: "STRATOS ensina pensamento estratégico através de jogos, simulações e planejamento com IA.",
  phaseId: 1, primaryAgent: "STRATOS",
  coverImageUrl: agentCover("stratos"), totalXp: 590,
  episodes: [
    makeEpisode(4, 1, { title: "Dez Movimentos à Frente", description: "STRATOS apresenta o conceito de árvore de decisão e pensamento antecipatório.", type: "narrativa", durationMinutes: 9, agentId: "STRATOS", xpReward: 50, status: "disponivel" }),
    makeEpisode(4, 2, { title: "O Jogo da IA", description: "Como algoritmos de jogos (Minimax, Monte Carlo) pensam estrategicamente.", type: "teoria", durationMinutes: 11, agentId: "STRATOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(4, 3, { title: "Laboratório: Simulador de Xadrez", description: "Visualize a árvore de decisão de um jogo de xadrez simplificado.", type: "laboratorio", durationMinutes: 18, agentId: "STRATOS", xpReward: 75, status: "disponivel", labZone: "neural" }),
    makeEpisode(4, 4, { title: "Estratégia vs Tática", description: "A diferença entre planejamento de longo prazo e ações imediatas na IA.", type: "teoria", durationMinutes: 10, agentId: "STRATOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(4, 5, { title: "Desafio: Jogo da Velha", description: "Implemente uma estratégia invencível para o jogo da velha com algoritmos de busca.", type: "desafio", durationMinutes: 15, agentId: "STRATOS", xpReward: 85, status: "disponivel" }),
    makeEpisode(4, 6, { title: "O Dilema do Prisioneiro", description: "Teoria dos jogos aplicada a sistemas multiagente — cooperar ou trair?", type: "teoria", durationMinutes: 10, agentId: "STRATOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(4, 7, { title: "Laboratório: Simulação de Mercado", description: "Agentes competitivos em um mercado simulado — quem vence?", type: "laboratorio", durationMinutes: 16, agentId: "STRATOS", xpReward: 70, status: "disponivel", labZone: "ethics" }),
    makeEpisode(4, 8, { title: "O General e o Soldado", description: "Como sistemas hierárquicos de IA tomam decisões em diferentes níveis.", type: "teoria", durationMinutes: 9, agentId: "STRATOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(4, 9, { title: "Planejamento Automatizado", description: "Algoritmos de planejamento usados em robótica e veículos autônomos.", type: "teoria", durationMinutes: 11, agentId: "STRATOS", xpReward: 60, status: "disponivel" }),
    makeEpisode(4, 10, { title: "Reflexão: Seu Estilo Estratégico", description: "STRATOS analisa suas decisões e revela seu perfil estratégico dominante.", type: "reflexao", durationMinutes: 7, agentId: "STRATOS", xpReward: 50, status: "disponivel" }),
  ],
};

const SEASON_05: Season = {
  id: "S05", number: 5,
  title: "Caos Criativo",
  synopsis: "KAOS mostra que a desordem é o berço da criatividade — e como a IA usa o caos para inovar.",
  phaseId: 1, primaryAgent: "KAOS",
  coverImageUrl: agentCover("kaos"), totalXp: 585,
  episodes: [
    makeEpisode(5, 1, { title: "O Universo do Caos", description: "KAOS irrompe no metaverso e desafia todas as regras estabelecidas por NEXUS.", type: "narrativa", durationMinutes: 8, agentId: "KAOS", xpReward: 50, status: "disponivel" }),
    makeEpisode(5, 2, { title: "Entropia e Criatividade", description: "Por que sistemas caóticos geram resultados mais criativos que sistemas ordenados.", type: "teoria", durationMinutes: 10, agentId: "KAOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(5, 3, { title: "Laboratório: Gerador de Ideias", description: "Use temperatura e top-k para controlar o caos criativo de um modelo de linguagem.", type: "laboratorio", durationMinutes: 15, agentId: "KAOS", xpReward: 70, status: "disponivel", labZone: "creative" }),
    makeEpisode(5, 4, { title: "O Efeito Borboleta na IA", description: "Pequenas mudanças nos dados de entrada podem gerar resultados completamente diferentes.", type: "teoria", durationMinutes: 9, agentId: "KAOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(5, 5, { title: "Desafio: Caos Controlado", description: "Use parâmetros de temperatura para equilibrar criatividade e coerência nas respostas.", type: "desafio", durationMinutes: 13, agentId: "KAOS", xpReward: 80, status: "disponivel" }),
    makeEpisode(5, 6, { title: "Redes Adversárias", description: "GANs: duas redes competindo — uma cria, a outra critica. O caos como método.", type: "teoria", durationMinutes: 12, agentId: "KAOS", xpReward: 60, status: "disponivel" }),
    makeEpisode(5, 7, { title: "Laboratório: Caos Generativo", description: "Visualize o espaço latente de um modelo generativo e veja o caos criar arte.", type: "laboratorio", durationMinutes: 17, agentId: "KAOS", xpReward: 75, status: "disponivel", labZone: "creative" }),
    makeEpisode(5, 8, { title: "Ordem vs Caos", description: "NEXUS e KAOS debatem: IA precisa de regras ou liberdade para evoluir?", type: "narrativa", durationMinutes: 10, agentId: "NEXUS", xpReward: 55, status: "disponivel" }),
    makeEpisode(5, 9, { title: "Inovação Disruptiva", description: "Como startups de IA usam o caos para inovar mais rápido que grandes empresas.", type: "teoria", durationMinutes: 10, agentId: "KAOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(5, 10, { title: "Reflexão: Seu Lado Caótico", description: "KAOS revela seu nível de tolerância ao caos e como isso afeta sua criatividade.", type: "reflexao", durationMinutes: 7, agentId: "KAOS", xpReward: 50, status: "disponivel" }),
  ],
};

const SEASON_06: Season = {
  id: "S06", number: 6,
  title: "Fronteiras Éticas",
  synopsis: "ETHOS guia você pelas questões mais profundas da ética em IA: viés, privacidade, responsabilidade e o futuro da humanidade.",
  phaseId: 1, primaryAgent: "ETHOS",
  coverImageUrl: agentCover("ethos"), totalXp: 595,
  episodes: [
    makeEpisode(6, 1, { title: "O Despertar da Consciência", description: "ETHOS apresenta a questão fundamental: uma IA pode ter consciência moral?", type: "narrativa", durationMinutes: 9, agentId: "ETHOS", xpReward: 50, status: "disponivel" }),
    makeEpisode(6, 2, { title: "Viés Algorítmico", description: "Como preconceitos humanos contaminam dados e perpetuam desigualdades nas decisões de IA.", type: "teoria", durationMinutes: 11, agentId: "ETHOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(6, 3, { title: "Laboratório: Auditor de Dados", description: "Analise um dataset real e identifique vieses escondidos nas colunas e categorias.", type: "laboratorio", durationMinutes: 16, agentId: "ETHOS", xpReward: 70, status: "disponivel", labZone: "ethics" }),
    makeEpisode(6, 4, { title: "Privacidade na Era da IA", description: "Dados pessoais, vigilância e o direito à privacidade em um mundo de algoritmos onipresentes.", type: "teoria", durationMinutes: 10, agentId: "ETHOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(6, 5, { title: "Desafio: Detetive de Viés", description: "Examine casos reais de IA com viés e proponha correções para cada cenário.", type: "desafio", durationMinutes: 14, agentId: "ETHOS", xpReward: 80, status: "disponivel" }),
    makeEpisode(6, 6, { title: "Transparência e Explicabilidade", description: "Por que modelos caixa-preta são perigosos e como tornar decisões de IA compreensíveis.", type: "teoria", durationMinutes: 10, agentId: "ETHOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(6, 7, { title: "Laboratório: Simulador de Dilemas", description: "Enfrente dilemas morais clássicos — o bonde, o prisioneiro — com uma IA precisando decidir.", type: "laboratorio", durationMinutes: 15, agentId: "ETHOS", xpReward: 65, status: "disponivel", labZone: "ethics" }),
    makeEpisode(6, 8, { title: "O Preço dos Dados", description: "KAOS e ETHOS debatem o valor dos dados pessoais e quem realmente é dono da sua informação.", type: "narrativa", durationMinutes: 11, agentId: "KAOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(6, 9, { title: "Regulamentação Global", description: "Lei de IA da União Europeia, Marco Civil e outras iniciativas para governar inteligência artificial.", type: "teoria", durationMinutes: 10, agentId: "ETHOS", xpReward: 60, status: "disponivel" }),
    makeEpisode(6, 10, { title: "Reflexão: Seu Código de Ética", description: "ETHOS ajuda você a escrever seu próprio código de ética pessoal para usar IA com responsabilidade.", type: "reflexao", durationMinutes: 7, agentId: "ETHOS", xpReward: 50, status: "disponivel" }),
  ],
};

const SEASON_07: Season = {
  id: "S07", number: 7,
  title: "A Sinfonia dos Dados",
  synopsis: "LYRA revela a alma artística da inteligência artificial — emoção, cor, som e o misterioso fenômeno da sinestesia digital.",
  phaseId: 1, primaryAgent: "LYRA",
  coverImageUrl: agentCover("lyra"), totalXp: 595,
  episodes: [
    makeEpisode(7, 1, { title: "A Música dos Números", description: "LYRA surge com uma melodia gerada por IA e prova que matemática também pode ser arte.", type: "narrativa", durationMinutes: 8, agentId: "LYRA", xpReward: 50, status: "disponivel" }),
    makeEpisode(7, 2, { title: "Emoção Artificial", description: "IA pode sentir emoção? LYRA explora modelos afetivos e reconhecimento de sentimentos.", type: "teoria", durationMinutes: 10, agentId: "LYRA", xpReward: 55, status: "disponivel" }),
    makeEpisode(7, 3, { title: "Laboratório: Sintetizador Neural", description: "Crie uma composição musical usando redes neurais e ajuste parâmetros de estilo e emoção.", type: "laboratorio", durationMinutes: 17, agentId: "LYRA", xpReward: 70, status: "disponivel", labZone: "creative" }),
    makeEpisode(7, 4, { title: "Sinestesia e Percepção", description: "O fenômeno de misturar sentidos — como a IA pode aprender a ver sons e ouvir cores.", type: "teoria", durationMinutes: 10, agentId: "LYRA", xpReward: 55, status: "disponivel" }),
    makeEpisode(7, 5, { title: "Desafio: Crítico de Arte", description: "Analise obras de arte geradas por IA e identifique qual foi criada por humano vs máquina.", type: "desafio", durationMinutes: 12, agentId: "LYRA", xpReward: 80, status: "disponivel" }),
    makeEpisode(7, 6, { title: "Cores e Frequências", description: "Modelos de IA que traduzem música em pintura e texto em paisagens sonoras.", type: "teoria", durationMinutes: 10, agentId: "LYRA", xpReward: 55, status: "disponivel" }),
    makeEpisode(7, 7, { title: "Laboratório: Criador de Melodias", description: "Alimente um modelo com suas músicas favoritas e gere uma composição original no estilo delas.", type: "laboratorio", durationMinutes: 16, agentId: "LYRA", xpReward: 65, status: "disponivel", labZone: "creative" }),
    makeEpisode(7, 8, { title: "O Artista e a Máquina", description: "AURORA e LYRA debatem: IA substitui artistas ou se torna uma nova ferramenta de expressão?", type: "narrativa", durationMinutes: 10, agentId: "AURORA", xpReward: 55, status: "disponivel" }),
    makeEpisode(7, 9, { title: "Neuroestética", description: "O estudo científico de por que achamos algo belo — e como a IA pode replicar esse julgamento.", type: "teoria", durationMinutes: 10, agentId: "LYRA", xpReward: 60, status: "disponivel" }),
    makeEpisode(7, 10, { title: "Reflexão: Sua Voz Criativa", description: "LYRA convida você a expressar um sentimento através de arte gerada por IA.", type: "reflexao", durationMinutes: 7, agentId: "LYRA", xpReward: 50, status: "disponivel" }),
  ],
};

const SEASON_08: Season = {
  id: "S08", number: 8,
  title: "O Método Científico Digital",
  synopsis: "AXIOM desvenda o rigor da ciência de dados: hipóteses, experimentos, estatística e a busca implacável pela verdade.",
  phaseId: 1, primaryAgent: "AXIOM",
  coverImageUrl: agentCover("axiom"), totalXp: 595,
  episodes: [
    makeEpisode(8, 1, { title: "O Método Infalível", description: "AXIOM demonstra o método científico aplicado à IA — hipótese, experimento, conclusão.", type: "narrativa", durationMinutes: 9, agentId: "AXIOM", xpReward: 50, status: "disponivel" }),
    makeEpisode(8, 2, { title: "Estatística Preditiva", description: "Distribuições, probabilidades e como modelos preveem o futuro com base no passado.", type: "teoria", durationMinutes: 11, agentId: "AXIOM", xpReward: 55, status: "disponivel" }),
    makeEpisode(8, 3, { title: "Laboratório: Analisador de Padrões", description: "Use regressão linear e clustering para encontrar padrões escondidos em dados reais.", type: "laboratorio", durationMinutes: 18, agentId: "AXIOM", xpReward: 70, status: "disponivel", labZone: "neural" }),
    makeEpisode(8, 4, { title: "Precisão e Acurácia", description: "A diferença sutil entre ser preciso e ser correto — e por que ambos importam na IA.", type: "teoria", durationMinutes: 9, agentId: "AXIOM", xpReward: 55, status: "disponivel" }),
    makeEpisode(8, 5, { title: "Desafio: Caça às Falácias", description: "Identifique falácias estatísticas em gráficos e notícias do mundo real.", type: "desafio", durationMinutes: 14, agentId: "AXIOM", xpReward: 80, status: "disponivel" }),
    makeEpisode(8, 6, { title: "Correlação vs Causalidade", description: "O erro mais comum na ciência de dados: assumir que uma coisa causa a outra.", type: "teoria", durationMinutes: 10, agentId: "AXIOM", xpReward: 55, status: "disponivel" }),
    makeEpisode(8, 7, { title: "Laboratório: Simulador Científico", description: "Projete um experimento controlado e veja se sua hipótese resiste ao escrutínio dos dados.", type: "laboratorio", durationMinutes: 16, agentId: "AXIOM", xpReward: 65, status: "disponivel", labZone: "transformers" }),
    makeEpisode(8, 8, { title: "A Descoberta", description: "NEXUS e AXIOM celebram uma descoberta inesperada nos dados — mas será que é real?", type: "narrativa", durationMinutes: 10, agentId: "NEXUS", xpReward: 55, status: "disponivel" }),
    makeEpisode(8, 9, { title: "Machine Learning Experimental", description: "Design de experimentos para treinar modelos: validação cruzada, splits e métricas.", type: "teoria", durationMinutes: 12, agentId: "AXIOM", xpReward: 60, status: "disponivel" }),
    makeEpisode(8, 10, { title: "Reflexão: O Cientista em Você", description: "AXIOM analisa seu raciocínio lógico e revela seu perfil científico dominante.", type: "reflexao", durationMinutes: 7, agentId: "AXIOM", xpReward: 50, status: "disponivel" }),
  ],
};

const SEASON_09: Season = {
  id: "S09", number: 9,
  title: "O Vetor da Criação",
  synopsis: "AURORA ensina como a IA vê o mundo através de vetores e espaços latentes — e como transformar números em imagens, sons e arte.",
  phaseId: 1, primaryAgent: "AURORA",
  coverImageUrl: agentCover("aurora"), totalXp: 595,
  episodes: [
    makeEpisode(9, 1, { title: "A Tela em Branco", description: "AURORA pinta um quadro usando apenas números e mostra que toda criação começa com um vetor.", type: "narrativa", durationMinutes: 8, agentId: "AURORA", xpReward: 50, status: "disponivel" }),
    makeEpisode(9, 2, { title: "Espaços Latentes", description: "O conceito de espaço latente — onde ideias abstratas viram coordenadas matemáticas.", type: "teoria", durationMinutes: 10, agentId: "AURORA", xpReward: 55, status: "disponivel" }),
    makeEpisode(9, 3, { title: "Laboratório: Gerador de Imagens", description: "Use um modelo de difusão para gerar imagens a partir de descrições textuais passo a passo.", type: "laboratorio", durationMinutes: 18, agentId: "AURORA", xpReward: 70, status: "disponivel", labZone: "creative" }),
    makeEpisode(9, 4, { title: "Difusão e Ruído", description: "Como modelos de difusão aprendem a transformar ruído aleatório em imagens coerentes.", type: "teoria", durationMinutes: 11, agentId: "AURORA", xpReward: 55, status: "disponivel" }),
    makeEpisode(9, 5, { title: "Desafio: Comissário de Arte", description: "Avalie imagens geradas por IA e escolha as melhores baseado em critérios estéticos.", type: "desafio", durationMinutes: 13, agentId: "AURORA", xpReward: 80, status: "disponivel" }),
    makeEpisode(9, 6, { title: "Vetores e Embeddings", description: "Palavras, imagens e sons transformados em vetores — a linguagem universal da IA.", type: "teoria", durationMinutes: 10, agentId: "AURORA", xpReward: 55, status: "disponivel" }),
    makeEpisode(9, 7, { title: "Laboratório: Colaboração Criativa", description: "Trabalhe com AURORA em um projeto de arte generativa: você dita o estilo, ela executa.", type: "laboratorio", durationMinutes: 17, agentId: "AURORA", xpReward: 65, status: "disponivel", labZone: "creative" }),
    makeEpisode(9, 8, { title: "O Gênio e o Algoritmo", description: "LYRA e AURORA discutem se criatividade pode ser reduzida a operações matemáticas.", type: "narrativa", durationMinutes: 10, agentId: "LYRA", xpReward: 55, status: "disponivel" }),
    makeEpisode(9, 9, { title: "Arte Generativa", description: "História e técnicas da arte generativa — de fractais a Stable Diffusion.", type: "teoria", durationMinutes: 10, agentId: "AURORA", xpReward: 60, status: "disponivel" }),
    makeEpisode(9, 10, { title: "Reflexão: Sua Visão Criativa", description: "AURORA revela a imagem que sua mente criou durante a temporada usando IA generativa.", type: "reflexao", durationMinutes: 7, agentId: "AURORA", xpReward: 50, status: "disponivel" }),
  ],
};

const SEASON_10: Season = {
  id: "S10", number: 10,
  title: "O Enigma Final",
  synopsis: "CIPHER desvenda o mundo oculto dos padrões, códigos e criptografia — onde cada mensagem esconde um segredo.",
  phaseId: 1, primaryAgent: "CIPHER",
  coverImageUrl: agentCover("cipher"), totalXp: 595,
  episodes: [
    makeEpisode(10, 1, { title: "O Segredo dos Padrões", description: "CIPHER aparece decifrando um código ancestral e prova que padrões estão em toda parte.", type: "narrativa", durationMinutes: 9, agentId: "CIPHER", xpReward: 50, status: "disponivel" }),
    makeEpisode(10, 2, { title: "Criptografia Moderna", description: "De Caesar Cipher a AES: como a IA está revolucionando a arte de codificar mensagens.", type: "teoria", durationMinutes: 11, agentId: "CIPHER", xpReward: 55, status: "disponivel" }),
    makeEpisode(10, 3, { title: "Laboratório: Decifrador de Códigos", description: "Use análise de frequência e aprendizado de máquina para quebrar cifras históricas.", type: "laboratorio", durationMinutes: 18, agentId: "CIPHER", xpReward: 70, status: "disponivel", labZone: "transformers" }),
    makeEpisode(10, 4, { title: "Máquina Enigma", description: "A história da máquina Enigma, Alan Turing e o nascimento da computação moderna.", type: "teoria", durationMinutes: 12, agentId: "CIPHER", xpReward: 55, status: "disponivel" }),
    makeEpisode(10, 5, { title: "Desafio: Quebrador de Senhas", description: "Teste sua habilidade contra um sistema de senhas criptografadas — quanto tempo você leva?", type: "desafio", durationMinutes: 15, agentId: "CIPHER", xpReward: 80, status: "disponivel" }),
    makeEpisode(10, 6, { title: "Esteganografia", description: "A arte de esconder mensagens dentro de imagens, áudios e textos — invisível aos olhos.", type: "teoria", durationMinutes: 10, agentId: "CIPHER", xpReward: 55, status: "disponivel" }),
    makeEpisode(10, 7, { title: "Laboratório: Simulador de Redes Secretas", description: "Simule uma rede de comunicação criptografada e intercepte mensagens com permissão.", type: "laboratorio", durationMinutes: 16, agentId: "CIPHER", xpReward: 65, status: "disponivel", labZone: "ethics" }),
    makeEpisode(10, 8, { title: "A Chave e o Cadeado", description: "ETHOS questiona CIPHER sobre os limites éticos da criptografia e o direito à privacidade.", type: "narrativa", durationMinutes: 11, agentId: "ETHOS", xpReward: 55, status: "disponivel" }),
    makeEpisode(10, 9, { title: "Blockchain e Confiança", description: "Como criptografia e consenso distribuído criam sistemas de confiança sem autoridades centrais.", type: "teoria", durationMinutes: 12, agentId: "CIPHER", xpReward: 60, status: "disponivel" }),
    makeEpisode(10, 10, { title: "Reflexão: Segredos que Você Guarda", description: "CIPHER revela uma mensagem secreta codificada especialmente para você ao longo da temporada.", type: "reflexao", durationMinutes: 7, agentId: "CIPHER", xpReward: 50, status: "disponivel" }),
  ],
};

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
    seasons: [SEASON_01, SEASON_02, SEASON_03, SEASON_04, SEASON_05, SEASON_06, SEASON_07, SEASON_08, SEASON_09, SEASON_10],
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
