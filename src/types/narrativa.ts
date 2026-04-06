/**
 * narrativa.ts — Tipos do Sistema de Narrativa Adaptativa — MENTE.AI
 *
 * D1 = Emocional  → curioso, medo, rebeldia, confiança
 * D2 = Intelectual → lógicas, intuições, hipóteses, planejamento
 * D3 = Moral      → proteção, expansão, decisão ética
 */

import type { UniversoId } from '@/data/universos';

// ─── Dimensões Narrativas ───────────────────────────────────────────────────

export type DimensaoId = 'D1_EMOCIONAL' | 'D2_INTELECTUAL' | 'D3_MORAL';

export interface Dimensao {
  id: DimensaoId;
  nome: string;
  descricao: string;
  exemplos: string[];
  corTema: string;
}

export const DIMENSOES: Record<DimensaoId, Dimensao> = {
  D1_EMOCIONAL: {
    id: 'D1_EMOCIONAL',
    nome: 'Emocional',
    descricao: 'Curiosidade, medo, rebeldia ou confiança. O agente segue complementando ou confrontando a emoção detectada.',
    exemplos: ['Quero entender', 'Estou com medo de', 'Não acredito nisso', 'Confio que'],
    corTema: '#FF6B9D',
  },
  D2_INTELECTUAL: {
    id: 'D2_INTELECTUAL',
    nome: 'Intelectual',
    descricao: 'Respostas lógicas ou intuitivas? Diante de um problema, o usuário analisa ou age na intuição? O próximo agente faz a triagem do usuário.',
    exemplos: ['Como funciona', 'Qual a lógica por trás', 'Meu instinto diz', 'Baseado em dados'],
    corTema: '#4A9EFF',
  },
  D3_MORAL: {
    id: 'D3_MORAL',
    nome: 'Moral',
    descricao: 'O usuário protege ou se expande? Passa do risco? Esses estados escolhem autonomamente e mudam o estado global da narrativa.',
    exemplos: ['Preciso proteger', 'Vale arriscar', 'Qual o impacto', 'Fazer o certo mesmo que'],
    corTema: '#66BB6A',
  },
};

// ─── Perfis de Usuário (roteamento LangChain) ───────────────────────────────

export type PerfilId =
  | 'analitico-protetor'
  | 'rebelde-experimentador'
  | 'pacifico-conformista'
  | 'empatico-humanista'
  | 'estrategico-visioneiro'
  | 'criativo-experimental';

export interface PerfilUsuario {
  id: PerfilId;
  nome: string;
  combinacaoDimensoes: string;   // ex: "Curioso + Lógico + Protetor"
  agentesAtivados: UniversoId[]; // agentes que respondem a este perfil
  descricao: string;
  corTema: string;
}

export const PERFIS: Record<PerfilId, PerfilUsuario> = {
  'analitico-protetor': {
    id: 'analitico-protetor',
    nome: 'Analítico-Protetor',
    combinacaoDimensoes: 'Curioso + Lógico + Protetor',
    agentesAtivados: ['nexus', 'stratos', 'axim'],
    descricao: 'Analisa antes de agir, prioriza segurança e dados concretos.',
    corTema: '#00BCD4',
  },
  'rebelde-experimentador': {
    id: 'rebelde-experimentador',
    nome: 'Rebelde-Experimentador',
    combinacaoDimensoes: 'Rebeldia + Intuição + Expansão',
    agentesAtivados: ['kaos', 'volt'],
    descricao: 'Desafia regras, age por intuição, busca experiências disruptivas.',
    corTema: '#E040FB',
  },
  'pacifico-conformista': {
    id: 'pacifico-conformista',
    nome: 'Pacífico-Conformista',
    combinacaoDimensoes: 'Medo + Conformidade + Hesitação',
    agentesAtivados: ['terra', 'janus'],
    descricao: 'Prefere o caminho seguro, evita conflitos, busca validação.',
    corTema: '#78909C',
  },
  'empatico-humanista': {
    id: 'empatico-humanista',
    nome: 'Empático-Humanista',
    combinacaoDimensoes: 'Empatia + Emoção + Preocupação',
    agentesAtivados: ['lyra', 'janus', 'terra'],
    descricao: 'Centra decisões nas pessoas, prioriza bem-estar coletivo.',
    corTema: '#FF6B9D',
  },
  'estrategico-visioneiro': {
    id: 'estrategico-visioneiro',
    nome: 'Estratégico-Visioneiro',
    combinacaoDimensoes: 'Analítico + Estratégico + Longo Prazo',
    agentesAtivados: ['stratos', 'cipher', 'nexus'],
    descricao: 'Pensa em sistemas, planeja o futuro, vê padrões ocultos.',
    corTema: '#26A69A',
  },
  'criativo-experimental': {
    id: 'criativo-experimental',
    nome: 'Criativo-Experimental',
    combinacaoDimensoes: 'Criativo + Experimental + Inesperado',
    agentesAtivados: ['prism', 'kaos', 'aurora'],
    descricao: 'Experimenta sem medo, cria novas formas, rompe padrões.',
    corTema: '#FF7043',
  },
};

// ─── Estado Narrativo do Usuário ────────────────────────────────────────────

export interface EstadoNarrativo {
  userId?: string;
  perfilDetectado: PerfilId | null;
  dimensaoAtiva: DimensaoId;
  agenteAtivo: UniversoId;
  fase: number;           // 1-5
  temporada: number;      // 1-50
  modulo: number;         // 1-10
  xpTotal: number;
  decisoesTomadas: DecisaoNarrativa[];
  conflitosNavegados: string[];  // ids de conflitos
  updatedAt: string;
}

export interface DecisaoNarrativa {
  id: string;
  temporada: number;
  modulo: number;
  tipo: 'CLIQUE' | 'DIGITACAO' | 'VOZ' | 'ESCOLHA_MORAL';
  opcaoEscolhida: string;
  agenteRespondeu: UniversoId;
  dimensaoAtivada: DimensaoId;
  timestamp: string;
}

// ─── Evento de Narrativa ────────────────────────────────────────────────────

export type EventoNarrativoTipo =
  | 'DIMENSAO_DETECTADA'
  | 'PERFIL_ATUALIZADO'
  | 'AGENTE_ATIVADO'
  | 'CONFLITO_INICIADO'
  | 'CONFLITO_RESOLVIDO'
  | 'NEXUS_INTERVEIO'
  | 'FASE_CONCLUIDA'
  | 'TEMPORADA_CONCLUIDA';

export interface EventoNarrativo {
  tipo: EventoNarrativoTipo;
  payload: Record<string, unknown>;
  timestamp: string;
}

