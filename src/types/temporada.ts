import type { UniversoId } from "@/data/universos";

export interface Temporada {
  id: number;
  titulo: string;
  descricao: string;
  agentesAtivos: UniversoId[];
  objetivoNarrativo: string;
}

export interface FaseMetaverso {
  id: number;
  nome: string;
  descricao: string;
  temporadas: number[];
  agentesAtivos: UniversoId[];
  metaNarrativa: string;
}

