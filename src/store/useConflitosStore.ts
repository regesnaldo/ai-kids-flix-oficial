import { create } from "zustand";
import type { EstadoConflitos, RespostaConflito } from "@/types/conflito";
import type { UniversoId } from "@/data/universos";

interface ConflitosStore extends EstadoConflitos {
  ativarConflito: (conflitoId: string) => void;
  responderConflito: (resposta: Omit<RespostaConflito, "createdAt">) => void;
  resolverConflito: (conflitoId: string) => void;
  registrarIntervencaoNexus: (conflitoId: string) => void;
  getPosicoTomada: (conflitoId: string) => UniversoId | "NEXUS" | "PROPRIA" | null;
  resetarConflitos: () => void;
}

const ESTADO_INICIAL: EstadoConflitos = {
  conflitoAtivoId: null,
  historicoRespostas: [],
  conflitosResolvidos: [],
  nexusIntervencoes: [],
};

export const useConflitosStore = create<ConflitosStore>((set, get) => ({
  ...ESTADO_INICIAL,

  ativarConflito: (conflitoId) => set({ conflitoAtivoId: conflitoId }),

  responderConflito: (resposta) =>
    set((state) => ({
      historicoRespostas: [...state.historicoRespostas, { ...resposta, createdAt: new Date().toISOString() }],
    })),

  resolverConflito: (conflitoId) =>
    set((state) => ({
      conflitoAtivoId: state.conflitoAtivoId === conflitoId ? null : state.conflitoAtivoId,
      conflitosResolvidos: [...new Set([...state.conflitosResolvidos, conflitoId])],
    })),

  registrarIntervencaoNexus: (conflitoId) =>
    set((state) => ({
      nexusIntervencoes: [...new Set([...state.nexusIntervencoes, conflitoId])],
    })),

  getPosicoTomada: (conflitoId) => {
    const resposta = [...get().historicoRespostas].reverse().find((r) => r.conflitoId === conflitoId);
    if (!resposta) return null;
    if (resposta.posicaoEscolhida === "NEXUS" || resposta.posicaoEscolhida === "PROPRIA") {
      return resposta.posicaoEscolhida;
    }
    return resposta.posicaoEscolhida === "AGENTE_1" ? "volt" : "ethos";
  },

  resetarConflitos: () => set({ ...ESTADO_INICIAL }),
}));

