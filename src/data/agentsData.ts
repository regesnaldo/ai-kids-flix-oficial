// src/data/agentsData.ts

export interface Agent {
  id: string;
  name: string;
  role: string;
  color: string;
  description: string;
  tag: string;
}

export const AGENTS: Agent[] = [
  {
    id: 'ethos',
    name: 'ETHOS',
    role: 'Especialista em Ética & Valores',
    color: '#E50914',
    description: 'Mestre da ética e caráter. Guia decisões morais com integridade.',
    tag: 'ÉTICA'
  },
  {
    id: 'logos',
    name: 'LOGOS',
    role: 'Mestre em Lógica & Raciocínio',
    color: '#564D4D',
    description: 'Especialista em pensamento crítico e argumentação lógica.',
    tag: 'LÓGICA'
  },
  {
    id: 'gnosis',
    name: 'GNOSIS',
    role: 'Guardião do Conhecimento',
    color: '#221F1F',
    description: 'Acesso ao conhecimento profundo e sabedoria ancestral.',
    tag: 'SABEDORIA'
  },
  {
    id: 'pathos',
    name: 'PATHOS',
    role: 'Especialista em Emoção & Empatia',
    color: '#E87C03',
    description: 'Desenvolve inteligência emocional e conexão humana.',
    tag: 'EMOÇÃO'
  },
  {
    id: 'kairos',
    name: 'KAIROS',
    role: 'Mestre do Timing Oportuno',
    color: '#0071EB',
    description: 'Reconhece o momento exato para ação e decisão.',
    tag: 'OPORTUNIDADE'
  },
  {
    id: 'nexus',
    name: 'NEXUS',
    role: 'Conector de Conceitos',
    color: '#46D369',
    description: 'Conecta ideias e cria sinapses entre conhecimentos.',
    tag: 'CONEXÃO'
  },
  {
    id: 'volt',
    name: 'VOLT',
    role: 'Especialista em Energia & Ação',
    color: '#B81D24',
    description: 'Potencializa execução e produtividade nas tarefas.',
    tag: 'ENERGIA'
  }
];

export const CATEGORIES = [
  {
    title: "Agentes Gregos Clássicos",
    agents: AGENTS.slice(0, 5)
  },
  {
    title: "Destaques da Semana",
    agents: AGENTS.slice(0, 6)
  },
  {
    title: "Especialistas em Ética",
    agents: AGENTS.filter(a => a.tag === 'ÉTICA')
  },
  {
    title: "Todos os Agentes",
    agents: AGENTS
  }
];
