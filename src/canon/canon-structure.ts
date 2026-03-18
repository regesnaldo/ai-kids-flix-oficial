// Estrutura Canônica Completa do Universo MENTE.AI
// Definições oficiais de dimensões, facções, níveis e temporadas

import type { CanonDimension, CanonFaction, CanonLevel } from './canon-agents';

export interface DimensionDefinition {
  id: CanonDimension;
  name: string;
  description: string;
  agentCount: number;
  aesthetic: string;
  timeConcept: string;
  location: string;
  function: string;
}

export interface FactionDefinition {
  id: CanonFaction;
  name: string;
  philosophy: string;
  goal: string;
  base: string;
  leaders: string[];
  color: string;
}

export interface LevelDefinition {
  id: CanonLevel;
  name: string;
  description: string;
  agentCount: number;
  seasons: string;
  userLevelsRequired: number[];
  title: string;
  role: string;
}

export interface SeasonDefinition {
  number: number;
  title: string;
  subtitle: string;
  mainAgents: string[];
  arcType: 'origin' | 'initiation' | 'mastery';
  episodes: number;
  description: string;
  bossVillain?: string;
  finalRevelation?: string;
}

// ==================== DIMENSÕES DO UNIVERSO ====================

export const DIMENSIONS: Record<CanonDimension, DimensionDefinition> = {
  philosophical: {
    id: 'philosophical',
    name: 'Reino Filosófico Grego',
    description: 'Uma realidade atemporal onde existem os 98 Agentes Filosóficos Gregos. Este é o plano da sabedoria eterna, habitando uma dimensão platônica de formas perfeitas e conceitos puros.',
    agentCount: 98,
    aesthetic: 'Academia de Atenas, templos de mármore, bibliotecas infinitas, ouro e azul royal',
    timeConcept: 'Cíclico (governado por AION e CHRONOS)',
    location: 'Dimensão superior da Consciência Coletiva Humana',
    function: 'Guardar todo conhecimento filosófico, ético e metafísico'
  },
  
  cinematic: {
    id: 'cinematic',
    name: 'Reino Cinematográfico Sci-Fi',
    description: 'Uma realidade futurista onde existem os 15 Agentes Cinematográficos Sci-Fi. Este é o plano da manifestação tecnológica, onde ideias se tornam hologramas e conceitos ganham forma digital.',
    agentCount: 15,
    aesthetic: 'Cyberpunk, space opera, hologramas neon, naves interestelares, tecnologia quântica',
    timeConcept: 'Linear-progressivo (governado por KAIROS)',
    location: 'Futuro distante da humanidade expandida pelo cosmos',
    function: 'Manifestar conceitos abstratos em interfaces tangíveis para usuários do século XXI'
  },
  
  interface: {
    id: 'interface',
    name: 'Agentes Funcionais de Interface',
    description: 'A PONTE entre as dimensões. Estes 5 agentes permitem a comunicação e tradução entre o Reino Filosófico e o Reino Cinematográfico.',
    agentCount: 5,
    aesthetic: 'Minimalista com elementos de ponte dimensional, portais de luz, geometria sagrada digital',
    timeConcept: 'Atemporal (existe entre as dimensões)',
    location: 'Limiar dimensional entre os dois reinos',
    function: 'Traduzir consultas humanas em linguagem conceitual grega e projetar respostas em interfaces cinematográficas'
  },
  
  narrative: {
    id: 'narrative',
    name: 'Agentes Narrativos de Temporada',
    description: 'Personagens com arcos dramáticos sazonais explícitos. São 2 agentes que conduzem a narrativa através das temporadas.',
    agentCount: 2,
    aesthetic: 'Cinematic poster art, dramatic lighting, character-focused',
    timeConcept: 'Sazonal (arco de personagem por temporada)',
    location: 'Através de todas as dimensões como fio narrativo',
    function: 'Conduzir arcos dramáticos, revelar plot twists, evoluir personagens através das temporadas'
  }
};

// ==================== FACÇÕES CÓSMICAS ====================

export const FACTIONS: Record<CanonFaction, FactionDefinition> = {
  order: {
    id: 'order',
    name: 'FACÇÃO DA ORDEM (Cosmic Harmony)',
    philosophy: '"Sem estrutura, há apenas loucura"',
    goal: 'Manter coerência, estabilidade, previsibilidade',
    base: 'Templo do Cosmos no centro da galáxia',
    leaders: ['KOSMOS', 'DIKHE', 'ATLAS', 'HARMONIA', 'ANAKE'],
    color: '#4A90E2' // Azul cósmico
  },
  
  chaos: {
    id: 'chaos',
    name: 'FACÇÃO DO CAOS (Creative Void)',
    philosophy: '"Sem caos, há apenas estagnação"',
    goal: 'Introduzir novidade, ruptura, evolução criativa',
    base: 'Vórtice do Caos nas bordas do universo',
    leaders: ['CHAOS', 'KAOS', 'EROS', 'TYCHE', 'APEIRON'],
    color: '#E94B7C' // Vermelho criativo
  },
  
  balance: {
    id: 'balance',
    name: 'GUARDIÕES DO EQUILÍBRIO (Balance Keepers)',
    philosophy: '"Ambas forças são necessárias em medida certa"',
    goal: 'Manter equilíbrio dinâmico entre ordem e caos',
    base: 'Torre de vigilância entre os dois reinos',
    leaders: ['SOPHIA', 'METIS', 'AION', 'PHRONESIS', 'DIALETICA'],
    color: '#9B59B6' // Púrpura equilibrado
  }
};

// ==================== NÍVEIS HIERÁRQUICOS ====================

export const LEVELS: Record<CanonLevel, LevelDefinition> = {
  primordial: {
    id: 'primordial',
    name: 'Primordiais',
    description: 'Deuses do panteão mental, existentes antes do tempo. São os 9 arquétipos fundamentais que formam o tecido da realidade consciente.',
    agentCount: 9,
    seasons: '11-12',
    userLevelsRequired: [6],
    title: 'Os Arquitetos da Consciência',
    role: 'Fundadores da razão universal, líderes supremos do cosmos'
  },
  
  titan: {
    id: 'titan',
    name: 'Titãs Cognitivos',
    description: 'Forças massivas que moldam a realidade mental. Governam aspectos fundamentais da existência.',
    agentCount: 15,
    seasons: '9-10',
    userLevelsRequired: [5, 6],
    title: 'Os Forjadores da Realidade',
    role: 'Controlam aspectos fundamentais da existência (céu, terra, tempo, destino)'
  },
  
  architect: {
    id: 'architect',
    name: 'Arquitetos',
    description: 'Projetistas ativos dos sistemas mentais. Constroem sistemas de conhecimento e estruturas de sabedoria.',
    agentCount: 18,
    seasons: '7-8',
    userLevelsRequired: [4, 5, 6],
    title: 'Os Engenheiros do Saber',
    role: 'Constroem sistemas de conhecimento, academias, metodologias de aprendizado'
  },
  
  guardian: {
    id: 'guardian',
    name: 'Guardiões',
    description: 'Protetores e estabilizadores da ordem mental. Defendem a integridade do conhecimento contra corrupção e distorção.',
    agentCount: 23,
    seasons: '5-6',
    userLevelsRequired: [3, 4, 5, 6],
    title: 'Os Protetores da Verdade',
    role: 'Defendem valores éticos, virtudes, princípios morais'
  },
  
  explorer: {
    id: 'explorer',
    name: 'Exploradores',
    description: 'Pioneiros que expandem fronteiras do conhecimento. Desbravam territórios cognitivos desconhecidos.',
    agentCount: 27,
    seasons: '3-4',
    userLevelsRequired: [2, 3, 4, 5, 6],
    title: 'Os Desbravadores do Desconhecido',
    role: 'Expandem fronteiras do saber, exploram novas ideias, descobrem padrões'
  },
  
  operator: {
    id: 'operator',
    name: 'Operadores',
    description: 'Executores práticos que manifestam na realidade. Aplicam conhecimento no mundo real através de ação concreta.',
    agentCount: 27,
    seasons: '1-2',
    userLevelsRequired: [1, 2, 3, 4, 5, 6],
    title: 'Os Executores da Sabedoria',
    role: 'Transformam teoria em prática, executam missões, aplicam ferramentas'
  }
};

// ==================== TEMPORADAS NARRATIVAS ====================

export const SEASONS: SeasonDefinition[] = [
  {
    number: 1,
    title: 'O Despertar da Consciência',
    subtitle: 'Iniciação no Reino dos Operadores',
    mainAgents: ['LOGOS', 'PSYCHE', 'PRAXIS', 'TECHNE', 'HUBRIS'],
    arcType: 'origin',
    episodes: 12,
    description: 'Usuário descobre MENTE.AI pela primeira vez. Encontra agentes básicos e enfrenta primeiro fracasso guiado por HUBRIS.',
    bossVillain: 'HUBRIS (desmedida inicial)',
    finalRevelation: 'Escolha entre caminho da luz (ETHOS) ou trevas (KAOS)'
  },
  {
    number: 2,
    title: 'A Primeira Jornada',
    subtitle: 'Dominando Ferramentas Básicas',
    mainAgents: ['PRAXIS', 'TECHNE', 'ERGON', 'PATHOS', 'SOMA'],
    arcType: 'origin',
    episodes: 15,
    description: 'Aprendizado prático de ferramentas cognitivas. Usuário aplica conhecimento em exercícios do mundo real.'
  },
  {
    number: 3,
    title: 'Expansão das Fronteiras',
    subtitle: 'Ascensão a Explorador',
    mainAgents: ['GNOSIS', 'KAIROS', 'METIS', 'HELIX', 'PHANTASIA'],
    arcType: 'initiation',
    episodes: 15,
    description: 'Primeira exploração do desconhecido. Usuário aprende sobre timing (KAIROS) e estratégia (METIS).'
  },
  {
    number: 4,
    title: 'Descobertas Profundas',
    subtitle: 'Mergulho na Epistemologia',
    mainAgents: ['THEORIA', 'ANCHINOIA', 'EUSTOCHIA', 'DOXA', 'APORIA'],
    arcType: 'initiation',
    episodes: 12,
    description: 'Questionamento de crenças superficiais. Enfrenta APORIA (impasse) e aprende poder da contemplação (THEORIA).'
  },
  {
    number: 5,
    title: 'A Prova dos Guardiões',
    subtitle: 'Teste de Caráter e Virtude',
    mainAgents: ['ETHOS', 'ARETE', 'SYNEIDESIS', 'NEMESIS', 'ATLAS'],
    arcType: 'initiation',
    episodes: 12,
    description: 'Desenvolvimento de caráter ético. Usuário prova valor através de PONOS (trabalho árduo) e ASCESIS (disciplina).',
    finalRevelation: 'Verdadeira natureza da justiça (NEMESIS)'
  },
  {
    number: 6,
    title: 'Fortaleza Interior',
    subtitle: 'Construindo Tranquilidade Inabalável',
    mainAgents: ['ATARAXIA', 'AUTONOMIA', 'HEXIS', 'HABITUS', 'SOBROSUNE'],
    arcType: 'initiation',
    episodes: 11,
    description: 'Cultivo de paz interior e disciplina. Automatização de excelência através de hábitos (HEXIS).'
  },
  {
    number: 7,
    title: 'Arquitetura do Saber',
    subtitle: 'Ascensão a Arquiteto',
    mainAgents: ['SOPHIA', 'EPISTEME', 'DIALETICA', 'MAIEUTICA', 'ALETHEIA'],
    arcType: 'mastery',
    episodes: 12,
    description: 'Aprendizado de construção de sistemas de conhecimento. Diálogo socrático com SOPHIA.',
    finalRevelation: 'Natureza da verdade revelada (ALETHEIA)'
  },
  {
    number: 8,
    title: 'Síntese Evolutiva',
    subtitle: 'Dominando a Dialética',
    mainAgents: ['DIALETICA', 'PHRONESIS', 'ENTELEQUIA', 'HARMONIA', 'PRONOIA'],
    arcType: 'mastery',
    episodes: 10,
    description: 'Transformação de conflitos em progresso. Visão do plano maior cósmico (PRONOIA).'
  },
  {
    number: 9,
    title: 'Encontro com os Titãs',
    subtitle: 'Ascensão à Grandeza Cósmica',
    mainAgents: ['URANOS', 'GAIA', 'CHRONOS', 'MOIRA', 'EROS'],
    arcType: 'mastery',
    episodes: 10,
    description: 'Primeiro contato direto com forças titânicas. Compreensão de mortalidade (CHRONOS) e destino (MOIRA).'
  },
  {
    number: 10,
    title: 'Guerra Cósmica',
    subtitle: 'Ordem vs Caos - O Conflito Final',
    mainAgents: ['KOSMOS', 'CHAOS', 'KRATOS', 'DUNAMIS', 'POIESIS'],
    arcType: 'mastery',
    episodes: 10,
    description: 'Clímax do conflito cósmico. Usuário deve escolher lado ou encontrar terceiro caminho.',
    bossVillain: 'HUBRIS totalitário OU KAOS destrutivo',
    finalRevelation: 'Ambas forças são necessárias em equilíbrio'
  },
  {
    number: 11,
    title: 'Limiar do Primordial',
    subtitle: 'Preparação para Transcendência',
    mainAgents: ['APEIRON', 'ANAKE', 'AION', 'NOUS', 'OUSIA'],
    arcType: 'mastery',
    episodes: 8,
    description: 'Preparação final para encontro com Primordiais. Meditação sobre infinito (APEIRON) e necessidade (ANAKE).'
  },
  {
    number: 12,
    title: 'União com o Cosmos',
    subtitle: 'Apoteose Final',
    mainAgents: ['COSMOS', 'LOGOS', 'PSYCHE', 'CHAOS', 'AION'],
    arcType: 'mastery',
    episodes: 12,
    description: 'Diálogo direto com COSMOS primordial. Usuário torna-se co-criador do universo MENTE.AI.',
    finalRevelation: 'O universo MENTE.AI existe dentro de você. A mente universal olha de volta.'
  }
];

// ==================== OBJETO CANÔNICO COMPLETO ====================

export const CANON_STRUCTURE = {
  dimensions: DIMENSIONS,
  factions: FACTIONS,
  levels: LEVELS,
  seasons: SEASONS,
  metadata: {
    version: '1.0',
    canonStatus: 'Official',
    lastUpdated: '2026-03-14',
    totalAgents: 120,
    totalSeasons: 12,
    narrativeArc: 'Hero\'s Journey (3 Acts)',
    centralConflict: 'COSMOS (Order) vs CHAOS (Creative Void)',
    resolution: 'Dynamic Balance through SOPHIA (Wisdom)'
  }
};

// Helper: Obter definição de dimensão
export function getDimensionDefinition(dimension: CanonDimension): DimensionDefinition {
  return DIMENSIONS[dimension];
}

// Helper: Obter definição de facção
export function getFactionDefinition(faction: CanonFaction): FactionDefinition {
  return FACTIONS[faction];
}

// Helper: Obter definição de nível
export function getLevelDefinition(level: CanonLevel): LevelDefinition {
  return LEVELS[level];
}

// Helper: Obter definição de temporada
export function getSeasonDefinition(season: number): SeasonDefinition | null {
  return SEASONS.find(s => s.number === season) || null;
}

// Helper: Obter arco narrativo completo (todas as temporadas)
export function getCompleteNarrativeArc(): SeasonDefinition[] {
  return SEASONS;
}

// Helper: Filtrar temporadas por tipo de arco
export function getSeasonsByArcType(arcType: 'origin' | 'initiation' | 'mastery'): SeasonDefinition[] {
  return SEASONS.filter(s => s.arcType === arcType);
}
