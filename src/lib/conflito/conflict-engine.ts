/**
 * conflict-engine.ts — Motor de conflitos narrativos
 * Analisa pares de agentes, ativa conflitos e decide quando NEXUS precisa intervir.
 */

import { CONFLITOS, deveNexusIntervir, getConflitoById, getConflitoPorAgentes } from "@/data/conflitos";
import type { ConflitoNarrativo } from "@/types/conflito";

export interface ResultadoConflito {
  conflito: ConflitoNarrativo | null;
  intervencaoNecessaria: boolean;
  justificativa: string;
}

export function avaliarConflito(args: {
  conflitoId?: string;
  agente1?: string;
  agente2?: string;
  interacoesSemResolucao?: number;
}): ResultadoConflito {
  const { conflitoId, agente1, agente2, interacoesSemResolucao = 0 } = args;

  const conflitoEncontrado =
    (conflitoId ? getConflitoById(conflitoId) : null) ??
    (agente1 && agente2 ? getConflitoPorAgentes(agente1, agente2) : null);

  if (!conflitoEncontrado) {
    return {
      conflito: null,
      intervencaoNecessaria: false,
      justificativa: "Nenhum conflito ativo para os parâmetros informados.",
    };
  }

  const intervencaoNecessaria = deveNexusIntervir(interacoesSemResolucao);

  return {
    conflito: conflitoEncontrado,
    intervencaoNecessaria,
    justificativa: `Conflito ${conflitoEncontrado.id} ativado. ${intervencaoNecessaria ? "NEXUS deve intervir." : "Usuário navega o conflito."}`,
  };
}

/** Gera a intervenção de NEXUS quando o conflito não é resolvido */
export function gerarIntervencaoNexus(conflito: ConflitoNarrativo): string {
  return (
    `🌌 **NEXUS observa e questiona:**\n\n` +
    `${conflito.resolucaoNexus}\n\n` +
    `Você escolhe agora: agir, esperar, ou reformular o problema?`
  );
}

export function listarConflitos(): ConflitoNarrativo[] {
  return CONFLITOS;
}

