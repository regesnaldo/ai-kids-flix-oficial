// ═══════════════════════════════════════════════════════════════════════════════
// MENTE.AI — Catálogo unificado de agentes
// Fonte única de verdade: @/canon/agents/all-agents (12 agentes canônicos)
// ═══════════════════════════════════════════════════════════════════════════════

import { ALL_AGENTS, type AgentDefinition } from "@/canon/agents/all-agents";

// ── Tipos do catálogo canônico ──────────────────────────────────────────────
export type { AgentDefinition } from "@/canon/agents/all-agents";
export { ALL_AGENTS } from "@/canon/agents/all-agents";

// ── src/data/agents.ts original ─────────────────────────────────────────────
export type AgentLevel = "Fundamentos" | "Intermediário" | "Avançado" | "Mestre";

export interface Agent {
  id: string;
  discoveryOrder: number;
  level: AgentLevel;
  technicalName: string;
  nickname: string;
  category: string;
  description: string;
  imageUrl: string;
  icon: string;
  dimension: string;
  faction: string;
}

export const agents: Agent[] = [
  { id: "1", discoveryOrder: 1, level: "Fundamentos", technicalName: "Modelo de Linguagem", nickname: "Cabeção", category: "Inteligência Pura", description: "Pensa respostas como ninguém. O cérebro por trás de tudo.", imageUrl: "/images/agents/agent-01.png", icon: "Brain", dimension: "Cognitiva", faction: "Pensamento" },
  { id: "2", discoveryOrder: 2, level: "Fundamentos", technicalName: "Rede Neural", nickname: "Teia de Aranha", category: "Conexões", description: "Liga todas as ideias e cria conexões infinitas.", imageUrl: "/images/agents/agent-02.png", icon: "Network", dimension: "Cognitiva", faction: "Pensamento" },
  { id: "3", discoveryOrder: 3, level: "Fundamentos", technicalName: "Parâmetros", nickname: "Neurônios Fofos", category: "Memória", description: "Memória interna fofa, mas poderosa. Bilhões em ação.", imageUrl: "/images/agents/agent-03.png", icon: "Database", dimension: "Memória", faction: "Pensamento" },
  { id: "4", discoveryOrder: 4, level: "Fundamentos", technicalName: "Pesos Matemáticos", nickname: "Halteres Mentais", category: "Decisão", description: "Decide o que importa. Musculação cerebral em tempo real.", imageUrl: "/images/agents/agent-04.png", icon: "Scale", dimension: "Lógica", faction: "Pensamento" },
  { id: "5", discoveryOrder: 5, level: "Fundamentos", technicalName: "Função de Ativação", nickname: "Despertador", category: "Ativação", description: "Acorda os neurônios na hora certa. Ring ring.", imageUrl: "/images/agents/agent-05.png", icon: "Bell", dimension: "Processamento", faction: "Pensamento" },
  { id: "6", discoveryOrder: 6, level: "Intermediário", technicalName: "Camadas Ocultas", nickname: "Subsolo Secreto", category: "Profundidade", description: "Pensamento profundo. O que ninguém vê acontece aqui.", imageUrl: "/images/agents/agent-06.svg", icon: "Layers", dimension: "Cognitiva", faction: "Pensamento" },
  { id: "7", discoveryOrder: 7, level: "Intermediário", technicalName: "Embeddings", nickname: "Tradutor Universal", category: "Tradução", description: "Entende significado real e traduz conceitos em vetores.", imageUrl: "/images/agents/agent-07.svg", icon: "Languages", dimension: "Semântica", faction: "Pensamento" },
  { id: "8", discoveryOrder: 8, level: "Intermediário", technicalName: "Tokenizador", nickname: "Picador de Palavras", category: "Processamento", description: "Corta frases em pedaços úteis. Chef da linguagem.", imageUrl: "/images/agents/agent-08.svg", icon: "Scissors", dimension: "Linguagem", faction: "Pensamento" },
  { id: "9", discoveryOrder: 9, level: "Intermediário", technicalName: "Contexto", nickname: "Caderninho", category: "Memória", description: "Lembra da conversa para manter tudo coerente.", imageUrl: "/images/agents/agent-09.svg", icon: "BookOpen", dimension: "Memória", faction: "Pensamento" },
  { id: "10", discoveryOrder: 10, level: "Intermediário", technicalName: "Attention", nickname: "Lanterna Mental", category: "Foco", description: "Foca no que importa e ilumina a ideia certa.", imageUrl: "/images/agents/agent-10.svg", icon: "Search", dimension: "Foco", faction: "Pensamento" },
  { id: "11", discoveryOrder: 11, level: "Avançado", technicalName: "Transformer", nickname: "Chefe da Sala", category: "Arquitetura", description: "Organiza o pensamento inteiro. O boss final.", imageUrl: "/images/agents/agent-11.svg", icon: "Cpu", dimension: "Estrutural", faction: "Pensamento" },
  { id: "12", discoveryOrder: 12, level: "Avançado", technicalName: "Inferência", nickname: "Oráculo", category: "Predição", description: "Gera respostas sábias com base em probabilidade.", imageUrl: "/images/agents/agent-12.svg", icon: "Eye", dimension: "Predição", faction: "Pensamento" },
  { id: "13", discoveryOrder: 13, level: "Avançado", technicalName: "Raciocínio", nickname: "Detetive", category: "Lógica", description: "Conecta pistas e monta conclusões com precisão.", imageUrl: "/images/agents/agent-13.svg", icon: "Search", dimension: "Lógica", faction: "Pensamento" },
  { id: "14", discoveryOrder: 14, level: "Avançado", technicalName: "Memória Curto Prazo", nickname: "Post-it", category: "Memória", description: "Segura o agora para decisões rápidas.", imageUrl: "/images/agents/agent-14.svg", icon: "StickyNote", dimension: "Memória", faction: "Pensamento" },
  { id: "15", discoveryOrder: 15, level: "Avançado", technicalName: "Memória Longa", nickname: "HD Eterno", category: "Memória", description: "Armazena aprendizados para o longo prazo.", imageUrl: "/images/agents/agent-15.svg", icon: "HardDrive", dimension: "Memória", faction: "Pensamento" },
  { id: "16", discoveryOrder: 16, level: "Mestre", technicalName: "Probabilidade", nickname: "Cartomante", category: "Predição", description: "Adivinha a melhor resposta com cálculo fino.", imageUrl: "/images/agents/agent-16.svg", icon: "Sparkles", dimension: "Predição", faction: "Pensamento" },
  { id: "17", discoveryOrder: 17, level: "Mestre", technicalName: "Prompt Interno", nickname: "Manual Secreto", category: "Instrução", description: "Coordena instruções invisíveis que guiam o sistema.", imageUrl: "/images/agents/agent-17.svg", icon: "Book", dimension: "Comando", faction: "Pensamento" },
  { id: "18", discoveryOrder: 18, level: "Mestre", technicalName: "Lógica Simbólica", nickname: "Professor Rígido", category: "Regras", description: "Regras claras e decisões consistentes sem ruído.", imageUrl: "/images/agents/agent-18.svg", icon: "GraduationCap", dimension: "Formal", faction: "Pensamento" },
  { id: "19", discoveryOrder: 19, level: "Mestre", technicalName: "Vetores", nickname: "GPS Mental", category: "Navegação", description: "Posiciona ideias no mapa e encontra rotas certeiras.", imageUrl: "/images/agents/agent-19.svg", icon: "MapPin", dimension: "Espacial", faction: "Pensamento" },
  { id: "20", discoveryOrder: 20, level: "Mestre", technicalName: "Arquitetura", nickname: "Planta da Casa", category: "Estrutura", description: "Desenha o formato completo do cérebro artificial.", imageUrl: "/images/agents/agent-20.svg", icon: "Building", dimension: "Estrutural", faction: "Pensamento" },
];

export const nexus = {
  id: "nexus",
  technicalName: "NEXUS",
  nickname: "O Conector",
  role: "Orquestrador Central",
  description: "Conecta ideias, pessoas e dados. NEXUS orquestra todos os agentes.",
  signature: "Orquestrado por NEXUS 'O Conector'",
} as const;

// ── src/data/agentsData.ts ──────────────────────────────────────────────────
export interface AgentsDataAgent {
  id: string;
  name: string;
  role: string;
  color: string;
  description: string;
  tag: string;
}

export const AGENTS: AgentsDataAgent[] = [
  { id: 'ethos', name: 'ETHOS', role: 'Especialista em Ética & Valores', color: '#E50914', description: 'Mestre da ética e caráter. Guia decisões morais com integridade.', tag: 'ÉTICA' },
  { id: 'logos', name: 'LOGOS', role: 'Mestre em Lógica & Raciocínio', color: '#564D4D', description: 'Especialista em pensamento crítico e argumentação lógica.', tag: 'LÓGICA' },
  { id: 'gnosis', name: 'GNOSIS', role: 'Guardião do Conhecimento', color: '#221F1F', description: 'Acesso ao conhecimento profundo e sabedoria ancestral.', tag: 'SABEDORIA' },
  { id: 'pathos', name: 'PATHOS', role: 'Especialista em Emoção & Empatia', color: '#E87C03', description: 'Desenvolve inteligência emocional e conexão humana.', tag: 'EMOÇÃO' },
  { id: 'kairos', name: 'KAIROS', role: 'Mestre do Timing Oportuno', color: '#0071EB', description: 'Reconhece o momento exato para ação e decisão.', tag: 'OPORTUNIDADE' },
  { id: 'nexus', name: 'NEXUS', role: 'Conector de Conceitos', color: '#46D369', description: 'Conecta ideias e cria sinapses entre conhecimentos.', tag: 'CONEXÃO' },
  { id: 'volt', name: 'VOLT', role: 'Especialista em Energia & Ação', color: '#B81D24', description: 'Potencializa execução e produtividade nas tarefas.', tag: 'ENERGIA' },
];

export const CATEGORIES = [
  { title: "Agentes Gregos Clássicos", agents: AGENTS.slice(0, 5) },
  { title: "Destaques da Semana", agents: AGENTS.slice(0, 6) },
  { title: "Especialistas em Ética", agents: AGENTS.filter(a => a.tag === 'ÉTICA') },
  { title: "Todos os Agentes", agents: AGENTS },
];

// ── src/data/all-agents.ts (HomeAgent → @/canon adapter) ────────────────────
export interface HomeAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  longDescription: string;
  image: string;
  color: string;
  category: string;
  level: string;
  features: string[];
  personality: {
    tone: string;
    values: string[];
    approach: string;
  };
  laboratoryTask: string;
  dimension: string;
}

const HOME_COLOR_BY_ID: Record<string, string> = {
  nexus: "#3B82F6", kaos: "#EF4444", cipher: "#10B981", lyra: "#EC4899",
  axiom: "#0EA5E9", stratos: "#64748B", terra: "#22C55E", prism: "#8B5CF6",
  janus: "#F59E0B", volt: "#F59E0B", aurora: "#EC4899", ethos: "#F59E0B",
};

const CATEGORY_BY_DIMENSION: Record<AgentDefinition["dimension"], string> = {
  intellectual: "Fundamentos", creative: "Inovação", ethical: "Ética",
  scientific: "Análise", practical: "Estratégia", emotional: "Empatia",
  aesthetic: "Criatividade", philosophical: "Filosofia", social: "Conexão",
  political: "Liderança", spiritual: "Espiritualidade", mystical: "Mística",
};

const LEVEL_BY_CANONICAL: Record<AgentDefinition["level"], string> = {
  archetypal: "Avançado", primordial: "Expert", mythic: "Intermediário", human: "Iniciante",
};

function toHomeAgent(agent: AgentDefinition): HomeAgent {
  return {
    id: agent.id,
    name: agent.name,
    role: agent.personality.approach.slice(0, 40),
    description: agent.laboratoryTask,
    longDescription: agent.personality.approach,
    image: `/images/agentes/${agent.id}.png`,
    color: HOME_COLOR_BY_ID[agent.id] ?? "#8B5CF6",
    category: CATEGORY_BY_DIMENSION[agent.dimension],
    level: LEVEL_BY_CANONICAL[agent.level],
    features: agent.personality.values,
    personality: {
      tone: agent.personality.tone,
      values: agent.personality.values,
      approach: agent.personality.approach,
    },
    laboratoryTask: agent.laboratoryTask,
    dimension: agent.dimension,
  };
}

export const allAgents: HomeAgent[] = ALL_AGENTS.map(toHomeAgent);

export const AGENT_ROWS = [
  { title: "Em Destaque",         agents: allAgents.slice(0, 6)  },
  { title: "Mais Populares",      agents: allAgents.slice(6, 12) },
  { title: "Conhecer os Agentes", agents: allAgents.slice(0, 4)  },
  { title: "Nível Avançado",      agents: allAgents.filter((a) => a.level === "Avançado" || a.level === "Expert") },
];

// ── src/data/agents-showcase.ts ─────────────────────────────────────────────
export interface AgentShowcase {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  categoryColor: string;
  description: string;
  image: string;
  themeGlow: string;
}

const SHOWCASE_COLOR_BY_ID: Record<string, string> = {
  nexus: "#3B82F6", kaos: "#EF4444", cipher: "#10B981", lyra: "#EC4899",
  axiom: "#0EA5E9", stratos: "#64748B", terra: "#22C55E", prism: "#8B5CF6",
  janus: "#F59E0B", volt: "#F59E0B", aurora: "#EC4899", ethos: "#F59E0B",
};

const SHOWCASE_CATEGORY_BY_DIMENSION: Record<AgentDefinition["dimension"], string> = {
  intellectual: "INTELIGÊNCIA", creative: "INOVAÇÃO", ethical: "ÉTICA",
  scientific: "ANÁLISE", practical: "ESTRATÉGIA", emotional: "EMPATIA",
  aesthetic: "CRIATIVIDADE", philosophical: "FILOSOFIA", social: "CONEXÃO",
  political: "LIDERANÇA", spiritual: "ESPIRITUALIDADE", mystical: "MÍSTICA",
};

function extractSubtitle(name: string): string {
  const match = name.match(/"([^"]+)"/);
  if (!match) return name;
  const epithet = match[1].toLowerCase();
  return epithet.charAt(0).toUpperCase() + epithet.slice(1);
}

function toAgentShowcase(agent: AgentDefinition): AgentShowcase {
  const color = SHOWCASE_COLOR_BY_ID[agent.id] ?? "#8B5CF6";
  return {
    id: agent.id,
    name: agent.name.split('"')[0].trim(),
    subtitle: extractSubtitle(agent.name),
    category: SHOWCASE_CATEGORY_BY_DIMENSION[agent.dimension],
    categoryColor: color,
    description: agent.laboratoryTask,
    image: `/images/agentes/${agent.id}.png`,
    themeGlow: color,
  };
}

export const agentsShowcase: AgentShowcase[] = ALL_AGENTS.map(toAgentShowcase);

// ── src/data/agents-hierarchy.ts ────────────────────────────────────────────
export const agentsHierarchy = [
  {
    level: "Primordial",
    description: "Fundamentos absolutos da mente consciente",
    division: "Consciência Pura",
    narrativeRole: "Arquétipos Fundadores - Celestials tipo Marvel",
    agents: ["LOGOS", "PSYCHE", "COSMOS", "CHAOS", "NOUS", "OUSIA", "APEIRON", "ANAKE", "AION"]
  },
  {
    level: "Titan",
    description: "Forças massivas que moldam a realidade mental",
    division: "Estrutura da Realidade",
    narrativeRole: "Titãs Cósmicos - Game of Thrones level threats",
    agents: ["URANOS", "GAIA", "CHRONOS", "MOIRA", "DIKHE", "NOMOS", "EROS", "THANATOS", "KOSMOS", "MYTHOS", "POLITEIA", "KRATOS", "DUNAMIS", "ENERGEIA", "POIESIS"]
  },
  {
    level: "Architect",
    description: "Projetistas ativos dos sistemas mentais",
    division: "Sistemas Cognitivos",
    narrativeRole: "Builders - Arquitetos da Realidade tipo MCU",
    agents: ["SOPHIA", "EPISTEME", "PHRONESIS", "DIALETICA", "MAIEUTICA", "IRONIA", "ALETHEIA", "ANAMNESIS", "KATHARSIS", "ENTELEQUIA", "HARMONIA", "SYSTASIS", "PARADEIGMA", "TYPOS", "KANON", "GNOMON", "PRONOIA", "HEIMARMENE"]
  },
  {
    level: "Guardian",
    description: "Protetores e estabilizadores da ordem mental",
    division: "Defesa Cognitiva",
    narrativeRole: "Sentinels - Jedi Guardians protetores",
    agents: ["ETHOS", "ARETE", "SOBROSUNE", "ATARAXIA", "AUTONOMIA", "ASKESIS", "HEXIS", "HABITUS", "SYNEIDESIS", "NEMESIS", "ATLAS", "STASIS", "PERAS", "MNEMOS", "MNEME", "HESYCHIA", "ELEUTHERIA", "PARRHESIA", "ZELUS", "PONOS", "XENIA", "CHARIS", "AGAPE"]
  },
  {
    level: "Explorer",
    description: "Pioneiros que expandem fronteiras do conhecimento",
    division: "Expansão Cognitiva",
    narrativeRole: "Pathfinders - Star Trek Explorers",
    agents: ["GNOSIS", "THEORIA", "ANCHINOIA", "EUSTOCHIA", "PHANTASIA", "DOXA", "APORIA", "METIS", "KERDOS", "GNOME", "SUNESIS", "DEINOTES", "EUPRAXIA", "PROHAIRESIS", "KAIROS", "TYCHE", "HELIX", "KINETOS", "METABOLE", "GENESIS", "PHUSIS", "PHILEO", "STORGE", "KOINONIA", "GENOS", "ISEGORIA", "DEMOS"]
  },
  {
    level: "Operator",
    description: "Executores práticos que manifestam na realidade",
    division: "Operações Práticas",
    narrativeRole: "Field Agents - SHIELD Operators, Avengers",
    agents: ["PRAXIS", "TECHNE", "ERGON", "LOGISMOS", "DIANOIA", "MIMESIS", "SOMA", "PSYCHIKOS", "PATHOS", "HUBRIS", "KAOS", "NEXUS", "JANUS", "STRATOS", "ARKHE", "DYNAMIS", "AEON", "TARTAROS", "EREBOS", "NYX", "HEMERA", "HORAI", "PHTHORA", "EPISTROME", "HYPOTYPOSIS", "DIATHESIS", "EXOUSIA"]
  }
];

export const agentRankMap: Record<string, { level: string; division: string; narrativeRole: string }> = {
  "LOGOS": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Fundador da razão e lógica" },
  "PSYCHE": { level: "Primordial", division: "Consciência Pura", narrativeRole: "A própria mente consciente" },
  "COSMOS": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Ordem universal emergente" },
  "CHAOS": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Vazio primordial pré-criação" },
  "NOUS": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Intelecto puro transcendental" },
  "OUSIA": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Essência fundamental do ser" },
  "APEIRON": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Infinito indeterminado" },
  "ANAKE": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Necessidade inevitável" },
  "AION": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Tempo cíclico eterno" },
  "URANOS": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Céu estrelado, transcendência" },
  "GAIA": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Terra fértil, base concreta" },
  "CHRONOS": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Tempo linear, mortalidade" },
  "MOIRA": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Destino tecido, inevitabilidade" },
  "DIKHE": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Ordem natural, justiça cósmica" },
  "NOMOS": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Lei estabelecida, civilização" },
  "EROS": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Desejo criador, força motriz" },
  "THANATOS": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Transformação final, ciclos" },
  "KOSMOS": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Universo ordenado, beleza" },
  "MYTHOS": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Narrativas fundadoras, cultura" },
  "POLITEIA": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Organização coletiva, sociedade" },
  "KRATOS": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Poder efetivo, realização" },
  "DUNAMIS": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Potência latente, força bruta" },
  "ENERGEIA": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Atividade em ato, execução" },
  "POIESIS": { level: "Titan", division: "Estrutura da Realidade", narrativeRole: "Criação poética, existência" },
  "SOPHIA": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Sabedoria conectiva" },
  "EPISTEME": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Ciência verdadeira" },
  "PHRONESIS": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Sabedoria prática" },
  "DIALETICA": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Síntese evolutiva" },
  "MAIEUTICA": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Parto intelectual" },
  "IRONIA": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Questionamento socrático" },
  "ALETHEIA": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Verdade revelada" },
  "ANAMNESIS": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Recordação, aprendizado" },
  "KATHARSIS": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Purificação emocional" },
  "ENTELEQUIA": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Realização plena" },
  "HARMONIA": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Proporção áurea" },
  "SYSTASIS": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Composição organizada" },
  "PARADEIGMA": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Exemplo ilustrativo" },
  "TYPOS": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Modelo exemplar" },
  "KANON": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Medida padrão" },
  "GNOMON": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Indicador preciso" },
  "PRONOIA": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Providência divina" },
  "HEIMARMENE": { level: "Architect", division: "Sistemas Cognitivos", narrativeRole: "Destino entrelaçado" },
  "ETHOS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Ética, valores morais" },
  "ARETE": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Excelência, melhor versão" },
  "SOBROSUNE": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Moderação equilibrada" },
  "ATARAXIA": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Tranquilidade inabalável" },
  "AUTONOMIA": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Auto-governo, disciplina" },
  "ASKESIS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Disciplina voluntária" },
  "HEXIS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Hábito consolidado" },
  "HABITUS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Disposição incorporada" },
  "SYNEIDESIS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Consciência moral" },
  "NEMESIS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Justiça divina" },
  "ATLAS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Estrutura, sustentação" },
  "STASIS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Equilíbrio dinâmico" },
  "PERAS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Limite definido" },
  "MNEMOS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Memória, conhecimento" },
  "MNEME": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Memória preservada" },
  "HESYCHIA": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Silêncio contemplativo" },
  "ELEUTHERIA": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Liberdade responsável" },
  "PARRHESIA": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Fala corajosa" },
  "ZELUS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Dedicação fervorosa" },
  "PONOS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Trabalho árduo" },
  "XENIA": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Hospitalidade sagrada" },
  "CHARIS": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Graça radiante" },
  "AGAPE": { level: "Guardian", division: "Defesa Cognitiva", narrativeRole: "Amor incondicional" },
  "GNOSIS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Conhecimento profundo" },
  "THEORIA": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Contemplação, observar" },
  "ANCHINOIA": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Perspicácia aguda" },
  "EUSTOCHIA": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Intuição certeira" },
  "PHANTASIA": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Imaginação criativa" },
  "DOXA": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Opinião comum" },
  "APORIA": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Impasse questionador" },
  "METIS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Inteligência estratégica" },
  "KERDOS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Ganho inteligente" },
  "GNOME": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Julgamento sábio" },
  "SUNESIS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Compreensão mútua" },
  "DEINOTES": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Habilidade técnica" },
  "EUPRAXIA": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Ação bem-sucedida" },
  "PROHAIRESIS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Escolha voluntária" },
  "KAIROS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Momento oportuno" },
  "TYCHE": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Acaso fortuito" },
  "HELIX": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Espiral evolutiva" },
  "KINETOS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Movimento, fluxo" },
  "METABOLE": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Mudança transformadora" },
  "GENESIS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Nascimento criativo" },
  "PHUSIS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Crescimento natural" },
  "PHILEO": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Amor fraternal" },
  "STORGE": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Apego natural" },
  "KOINONIA": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Comunidade, laços" },
  "GENOS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Origem compartilhada" },
  "ISEGORIA": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Igualdade de voz" },
  "DEMOS": { level: "Explorer", division: "Expansão Cognitiva", narrativeRole: "Povo soberano" },
  "PRAXIS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Ação, prática" },
  "TECHNE": { level: "Operator", division: "Operações Práticas", narrativeRole: "Tecnologia, ferramentas" },
  "ERGON": { level: "Operator", division: "Operações Práticas", narrativeRole: "Obra realizada" },
  "LOGISMOS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Cálculo racional" },
  "DIANOIA": { level: "Operator", division: "Operações Práticas", narrativeRole: "Pensamento discursivo" },
  "MIMESIS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Representação simbólica" },
  "SOMA": { level: "Operator", division: "Operações Práticas", narrativeRole: "Corpo integrado" },
  "PSYCHIKOS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Alma desperta" },
  "PATHOS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Experiência emocional" },
  "HUBRIS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Desmedida, excesso" },
  "KAOS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Criatividade primordial" },
  "NEXUS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Conexão, redes" },
  "JANUS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Visão dupla, humor" },
  "STRATOS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Camadas, níveis" },
  "ARKHE": { level: "Operator", division: "Operações Práticas", narrativeRole: "Origem, princípio" },
  "DYNAMIS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Potencial, forças" },
  "AEON": { level: "Operator", division: "Operações Práticas", narrativeRole: "Tempo eterno" },
  "TARTAROS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Profundezas abissais" },
  "EREBOS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Escuridão inicial" },
  "NYX": { level: "Operator", division: "Operações Práticas", narrativeRole: "Noite misteriosa" },
  "HEMERA": { level: "Operator", division: "Operações Práticas", narrativeRole: "Luz diurna, clareza" },
  "HORAI": { level: "Operator", division: "Operações Práticas", narrativeRole: "Estações ordenadas" },
  "PHTHORA": { level: "Operator", division: "Operações Práticas", narrativeRole: "Corrupção necessária" },
  "EPISTROME": { level: "Operator", division: "Operações Práticas", narrativeRole: "Conversão profunda" },
  "HYPOTYPOSIS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Esboço preliminar" },
  "DIATHESIS": { level: "Operator", division: "Operações Práticas", narrativeRole: "Disposição interna" },
  "EXOUSIA": { level: "Operator", division: "Operações Práticas", narrativeRole: "Autoridade legítima" },
};

export function getAgentInfo(name: string): { level: string; division: string; narrativeRole: string } | null {
  return agentRankMap[name.toUpperCase()] || null;
}

export function getAgentsByLevel(level: string): string[] {
  const hierarchyLevel = agentsHierarchy.find(h => h.level === level);
  return hierarchyLevel ? hierarchyLevel.agents : [];
}

export function getLevelDescription(level: string): string | null {
  const hierarchyLevel = agentsHierarchy.find(h => h.level === level);
  return hierarchyLevel ? hierarchyLevel.description : null;
}

export function isAgent(name: string): boolean {
  return name.toUpperCase() in agentRankMap;
}

export function countAgentsByLevel(): Record<string, number> {
  const counts: Record<string, number> = {};
  agentsHierarchy.forEach(level => {
    counts[level.level] = level.agents.length;
  });
  return counts;
}
