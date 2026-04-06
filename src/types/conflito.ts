import type { UniversoId } from "@/data/universos";

export interface ConflitoNarrativo {
  id: string;
  agente1: UniversoId;
  agente2: UniversoId;
  titulo: string;
  descricao: string;
  premissa: string;
  argumentoAgente1: string;
  argumentoAgente2: string;
  resolucaoNexus: string;
}

export interface RespostaConflito {
  conflitoId: string;
  posicaoEscolhida: "AGENTE_1" | "AGENTE_2" | "NEXUS" | "PROPRIA";
  justificativa?: string;
  createdAt: string;
}

export interface EstadoConflitos {
  conflitoAtivoId: string | null;
  historicoRespostas: RespostaConflito[];
  conflitosResolvidos: string[];
  nexusIntervencoes: string[];
}

