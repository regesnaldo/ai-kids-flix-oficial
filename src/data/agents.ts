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
