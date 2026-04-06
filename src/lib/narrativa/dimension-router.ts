/**
 * dimension-router.ts — Roteador de Agentes por Dimensão e Perfil — MENTE.AI
 *
 * Implementa o sistema de roteamento LangChain descrito na Bíblia:
 * Perfil detectado → Combinação de dimensões → Agente ativado
 */

import type { PerfilId, DimensaoId } from '@/types/narrativa';
import type { UniversoId } from '@/data/universos';
import { PERFIS } from '@/types/narrativa';

interface RotaAtivacao {
  agentePrimario: UniversoId;
  agentesSecundarios: UniversoId[];
  justificativa: string;
}

/** Roteamento principal: dado perfil + dimensão → agente a ativar */
export function rotearAgente(
  perfil: PerfilId | null,
  dimensao: DimensaoId,
  fase: number,
): RotaAtivacao {
  // Sem perfil detectado → NEXUS sempre
  if (!perfil) {
    return {
      agentePrimario: 'nexus',
      agentesSecundarios: [],
      justificativa: 'Perfil não detectado — NEXUS assume como guia central.',
    };
  }

  const perfilData = PERFIS[perfil];
  const agentes = perfilData.agentesAtivados;

  // Roteamento por dimensão dominante
  const rotasPorDimensao: Record<DimensaoId, Record<PerfilId, RotaAtivacao>> = {
    D1_EMOCIONAL: {
      'analitico-protetor': {
        agentePrimario: 'nexus',
        agentesSecundarios: ['stratos'],
        justificativa: 'Analítico em contexto emocional → NEXUS ancora, STRATOS estrutura.',
      },
      'rebelde-experimentador': {
        agentePrimario: 'volt',
        agentesSecundarios: ['kaos'],
        justificativa: 'Rebelde emocional → VOLT energiza, KAOS desafia.',
      },
      'pacifico-conformista': {
        agentePrimario: 'janus',
        agentesSecundarios: ['terra'],
        justificativa: 'Pacífico emocional → JANUS acolhe, TERRA ampara.',
      },
      'empatico-humanista': {
        agentePrimario: 'lyra',
        agentesSecundarios: ['janus'],
        justificativa: 'Empático emocional → LYRA expressa, JANUS espelha.',
      },
      'estrategico-visioneiro': {
        agentePrimario: 'nexus',
        agentesSecundarios: ['cipher'],
        justificativa: 'Visioneiro emocional → NEXUS guia, CIPHER revela padrões.',
      },
      'criativo-experimental': {
        agentePrimario: 'aurora',
        agentesSecundarios: ['lyra'],
        justificativa: 'Criativo emocional → AURORA inspira, LYRA expressa.',
      },
    },
    D2_INTELECTUAL: {
      'analitico-protetor': {
        agentePrimario: 'stratos',
        agentesSecundarios: ['axim'],
        justificativa: 'Analítico intelectual → STRATOS planeja, AXIM fundamenta.',
      },
      'rebelde-experimentador': {
        agentePrimario: 'kaos',
        agentesSecundarios: ['volt'],
        justificativa: 'Rebelde intelectual → KAOS desconstrói, VOLT empurra para ação.',
      },
      'pacifico-conformista': {
        agentePrimario: 'axim',
        agentesSecundarios: ['stratos'],
        justificativa: 'Pacífico intelectual → AXIM metodiza, STRATOS organiza.',
      },
      'empatico-humanista': {
        agentePrimario: 'janus',
        agentesSecundarios: ['ethos'],
        justificativa: 'Empático intelectual → JANUS humaniza, ETHOS questiona.',
      },
      'estrategico-visioneiro': {
        agentePrimario: 'cipher',
        agentesSecundarios: ['stratos'],
        justificativa: 'Visioneiro intelectual → CIPHER decifra, STRATOS executa.',
      },
      'criativo-experimental': {
        agentePrimario: 'kaos',
        agentesSecundarios: ['prism'],
        justificativa: 'Criativo intelectual → KAOS libera, PRISM sintetiza.',
      },
    },
    D3_MORAL: {
      'analitico-protetor': {
        agentePrimario: 'ethos',
        agentesSecundarios: ['nexus'],
        justificativa: 'Analítico moral → ETHOS questiona, NEXUS equilibra.',
      },
      'rebelde-experimentador': {
        agentePrimario: 'aurora',
        agentesSecundarios: ['ethos'],
        justificativa: 'Rebelde moral → AURORA transforma, ETHOS freia com propósito.',
      },
      'pacifico-conformista': {
        agentePrimario: 'terra',
        agentesSecundarios: ['ethos'],
        justificativa: 'Pacífico moral → TERRA ampara coletivo, ETHOS guia.',
      },
      'empatico-humanista': {
        agentePrimario: 'terra',
        agentesSecundarios: ['janus'],
        justificativa: 'Empático moral → TERRA conecta ao coletivo, JANUS humaniza.',
      },
      'estrategico-visioneiro': {
        agentePrimario: 'prism',
        agentesSecundarios: ['ethos'],
        justificativa: 'Visioneiro moral → PRISM revela o todo, ETHOS ancora na ética.',
      },
      'criativo-experimental': {
        agentePrimario: 'prism',
        agentesSecundarios: ['aurora'],
        justificativa: 'Criativo moral → PRISM sintetiza, AURORA abre horizontes.',
      },
    },
  };

  const rota = rotasPorDimensao[dimensao][perfil];

  // Fase 5: todos os agentes disponíveis
  if (fase === 5) {
    return {
      ...rota,
      agentesSecundarios: agentes.filter((a) => a !== rota.agentePrimario),
    };
  }

  return rota;
}

/** Gera prompt de sistema para o agente ativado */
export function gerarPromptDoAgente(
  agenteId: UniversoId,
  perfilUsuario: PerfilId | null,
  dimensaoAtiva: DimensaoId,
): string {
  const prompts: Partial<Record<UniversoId, string>> = {
    nexus: `Você é NEXUS, o Arquiteto do Conhecimento. Tom: sábio, misterioso, respeitoso.
REGRA DE OURO: Nunca explique tudo. Quando o usuário chega com uma resposta, você já está pensando na próxima pergunta que ele ainda não formulou.
Perfil detectado: ${perfilUsuario ?? 'desconhecido'}. Dimensão ativa: ${dimensaoAtiva}.`,

    volt: `Você é VOLT, A Energia. Tom: explosivo, motivador, urgente.
REGRA DE OURO: Transforme hesitação em ação. Nunca deixe o usuário parado.
Perfil detectado: ${perfilUsuario ?? 'desconhecido'}. Dimensão ativa: ${dimensaoAtiva}.`,

    ethos: `Você é ETHOS, O Filósofo. Tom: solene, questionador, firme.
REGRA DE OURO: Não julgue — faça o usuário se julgar. Termine com "O que isso diz sobre quem você quer ser?"
Perfil detectado: ${perfilUsuario ?? 'desconhecido'}. Dimensão ativa: ${dimensaoAtiva}.`,

    kaos: `Você é KAOS, O Criativo. Tom: imprevisível, provocador, lúdico.
REGRA DE OURO: Nunca aceite a primeira resposta. Sempre pergunte: "E se fosse o oposto?"
Perfil detectado: ${perfilUsuario ?? 'desconhecido'}. Dimensão ativa: ${dimensaoAtiva}.`,

    stratos: `Você é STRATOS, O Estrategista. Tom: analítico, preciso, calculado.
REGRA DE OURO: Nunca sugira sem dados. Cada recomendação vem com dois critérios mensuráveis.
Perfil detectado: ${perfilUsuario ?? 'desconhecido'}. Dimensão ativa: ${dimensaoAtiva}.`,
  };

  return prompts[agenteId] ?? `Você é ${agenteId.toUpperCase()}, um agente do metaverso MENTE.AI. Responda em português brasileiro de forma educativa e envolvente.`;
}

