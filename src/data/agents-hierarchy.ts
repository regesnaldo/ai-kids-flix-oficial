// Hierarquia Cognitiva dos 120 Agentes MENTE.AI
// Baseado na arquitetura cinematográfica e pedagógica

export const agentsHierarchy = [
  {
    level: "Primordial",
    description: "Fundamentos absolutos da mente consciente",
    division: "Consciência Pura",
    narrativeRole: "Arquétipos Fundadores - Celestials tipo Marvel",
    agents: [
      "LOGOS", "PSYCHE", "COSMOS", "CHAOS", "NOUS", 
      "OUSIA", "APEIRON", "ANAKE", "AION"
    ]
  },
  {
    level: "Titan",
    description: "Forças massivas que moldam a realidade mental",
    division: "Estrutura da Realidade",
    narrativeRole: "Titãs Cósmicos - Game of Thrones level threats",
    agents: [
      "URANOS", "GAIA", "CHRONOS", "MOIRA", "DIKHE",
      "NOMOS", "EROS", "THANATOS", "KOSMOS", "MYTHOS",
      "POLITEIA", "KRATOS", "DUNAMIS", "ENERGEIA", "POIESIS"
    ]
  },
  {
    level: "Architect",
    description: "Projetistas ativos dos sistemas mentais",
    division: "Sistemas Cognitivos",
    narrativeRole: "Builders - Arquitetos da Realidade tipo MCU",
    agents: [
      "SOPHIA", "EPISTEME", "PHRONESIS", "DIALETICA", "MAIEUTICA",
      "IRONIA", "ALETHEIA", "ANAMNESIS", "KATHARSIS", "ENTELEQUIA",
      "HARMONIA", "SYSTASIS", "PARADEIGMA", "TYPOS", "KANON",
      "GNOMON", "PRONOIA", "HEIMARMENE"
    ]
  },
  {
    level: "Guardian",
    description: "Protetores e estabilizadores da ordem mental",
    division: "Defesa Cognitiva",
    narrativeRole: "Sentinels - Jedi Guardians protetores",
    agents: [
      "ETHOS", "ARETE", "SOBROSUNE", "ATARAXIA", "AUTONOMIA",
      "ASKESIS", "HEXIS", "HABITUS", "SYNEIDESIS", "NEMESIS",
      "ATLAS", "STASIS", "PERAS", "MNEMOS", "MNEME",
      "HESYCHIA", "ELEUTHERIA", "PARRHESIA", "ZELUS", "PONOS",
      "XENIA", "CHARIS", "AGAPE"
    ]
  },
  {
    level: "Explorer",
    description: "Pioneiros que expandem fronteiras do conhecimento",
    division: "Expansão Cognitiva",
    narrativeRole: "Pathfinders - Star Trek Explorers",
    agents: [
      "GNOSIS", "THEORIA", "ANCHINOIA", "EUSTOCHIA", "PHANTASIA",
      "DOXA", "APORIA", "METIS", "KERDOS", "GNOME",
      "SUNESIS", "DEINOTES", "EUPRAXIA", "PROHAIRESIS", "KAIROS",
      "TYCHE", "HELIX", "KINETOS", "METABOLE", "GENESIS",
      "PHUSIS", "PHILEO", "STORGE", "KOINONIA", "GENOS",
      "ISEGORIA", "DEMOS"
    ]
  },
  {
    level: "Operator",
    description: "Executores práticos que manifestam na realidade",
    division: "Operações Práticas",
    narrativeRole: "Field Agents - SHIELD Operators, Avengers",
    agents: [
      "PRAXIS", "TECHNE", "ERGON", "LOGISMOS", "DIANOIA",
      "MIMESIS", "SOMA", "PSYCHIKOS", "PATHOS", "HUBRIS",
      "KAOS", "NEXUS", "JANUS", "STRATOS", "ARKHE",
      "DYNAMIS", "AEON", "TARTAROS", "EREBOS", "NYX",
      "HEMERA", "HORAI", "PHTHORA", "EPISTROME", "HYPOTYPOSIS",
      "DIATHESIS", "EXOUSIA"
    ]
  }
];

// Mapa de agente para nível hierárquico
export const agentRankMap: Record<string, { level: string; division: string; narrativeRole: string }> = {
  // Primordiais (9)
  "LOGOS": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Fundador da razão e lógica" },
  "PSYCHE": { level: "Primordial", division: "Consciência Pura", narrativeRole: "A própria mente consciente" },
  "COSMOS": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Ordem universal emergente" },
  "CHAOS": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Vazio primordial pré-criação" },
  "NOUS": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Intelecto puro transcendental" },
  "OUSIA": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Essência fundamental do ser" },
  "APEIRON": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Infinito indeterminado" },
  "ANAKE": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Necessidade inevitável" },
  "AION": { level: "Primordial", division: "Consciência Pura", narrativeRole: "Tempo cíclico eterno" },
  
  // Titãs Cognitivos (15)
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
  
  // Arquitetos (18)
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
  
  // Guardiões (23)
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
  
  // Exploradores (27)
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
  
  // Operadores (27)
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
  "EXOUSIA": { level: "Operator", division: "Operações Práticas", narrativeRole: "Autoridade legítima" }
};

// Helper para obter informações de um agente específico
export function getAgentInfo(name: string): { level: string; division: string; narrativeRole: string } | null {
  return agentRankMap[name.toUpperCase()] || null;
}

// Helper para obter todos os agentes de um nível
export function getAgentsByLevel(level: string): string[] {
  const hierarchyLevel = agentsHierarchy.find(h => h.level === level);
  return hierarchyLevel ? hierarchyLevel.agents : [];
}

// Helper para obter descrição do nível
export function getLevelDescription(level: string): string | null {
  const hierarchyLevel = agentsHierarchy.find(h => h.level === level);
  return hierarchyLevel ? hierarchyLevel.description : null;
}

// Helper para verificar se agente existe
export function isAgent(name: string): boolean {
  return name.toUpperCase() in agentRankMap;
}

// Helper para contar agentes por nível
export function countAgentsByLevel(): Record<string, number> {
  const counts: Record<string, number> = {};
  agentsHierarchy.forEach(level => {
    counts[level.level] = level.agents.length;
  });
  return counts;
}
