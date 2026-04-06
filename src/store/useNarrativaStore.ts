/**
 * useNarrativaStore.ts — Estado Global da Narrativa Adaptativa — MENTE.AI
 *
 * Gerencia o perfil do usuário, dimensão ativa, agente em jogo,
 * decisões tomadas e progresso nas 50 temporadas.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  DimensaoId,
  EstadoNarrativo,
  PerfilId,
  DecisaoNarrativa,
  EventoNarrativo,
} from '@/types/narrativa';
import type { UniversoId } from '@/data/universos';

interface NarrativaStore extends EstadoNarrativo {
  // Ações de perfil
  detectarPerfil: (perfil: PerfilId) => void;
  setDimensaoAtiva: (dimensao: DimensaoId) => void;
  setAgenteAtivo: (agente: UniversoId) => void;

  // Progresso
  avancarModulo: () => void;
  avancarTemporada: () => void;
  avancarFase: () => void;
  adicionarXP: (quantidade: number) => void;

  // Decisões e conflitos
  registrarDecisao: (decisao: Omit<DecisaoNarrativa, 'id' | 'timestamp'>) => void;
  marcarConflitoNavegado: (conflitoId: string) => void;

  // Eventos
  emitirEvento: (evento: Omit<EventoNarrativo, 'timestamp'>) => void;
  ultimoEvento: EventoNarrativo | null;

  // Reset
  resetarNarrativa: () => void;
}

const ESTADO_INICIAL: EstadoNarrativo = {
  perfilDetectado: null,
  dimensaoAtiva: 'D1_EMOCIONAL',
  agenteAtivo: 'nexus',
  fase: 1,
  temporada: 1,
  modulo: 1,
  xpTotal: 0,
  decisoesTomadas: [],
  conflitosNavegados: [],
  updatedAt: new Date().toISOString(),
};

export const useNarrativaStore = create<NarrativaStore>()(
  persist(
    (set, get) => ({
      ...ESTADO_INICIAL,
      ultimoEvento: null,

      detectarPerfil: (perfil) =>
        set({
          perfilDetectado: perfil,
          updatedAt: new Date().toISOString(),
        }),

      setDimensaoAtiva: (dimensao) =>
        set({ dimensaoAtiva: dimensao, updatedAt: new Date().toISOString() }),

      setAgenteAtivo: (agente) =>
        set({ agenteAtivo: agente, updatedAt: new Date().toISOString() }),

      avancarModulo: () => {
        const { modulo, temporada, fase } = get();
        if (modulo < 10) {
          set({ modulo: modulo + 1, updatedAt: new Date().toISOString() });
        } else {
          // Avança temporada
          const novaTemporada = temporada + 1;
          if (novaTemporada > 50) return; // fim do conteúdo
          const novaFase = Math.ceil(novaTemporada / 10);
          set({
            modulo: 1,
            temporada: novaTemporada,
            fase: novaFase,
            updatedAt: new Date().toISOString(),
          });
        }
      },

      avancarTemporada: () => {
        const { temporada } = get();
        const novaTemporada = Math.min(temporada + 1, 50);
        set({
          temporada: novaTemporada,
          fase: Math.ceil(novaTemporada / 10),
          modulo: 1,
          updatedAt: new Date().toISOString(),
        });
      },

      avancarFase: () => {
        const { fase } = get();
        if (fase < 5) {
          const novaFase = fase + 1;
          set({
            fase: novaFase,
            temporada: (novaFase - 1) * 10 + 1,
            modulo: 1,
            updatedAt: new Date().toISOString(),
          });
        }
      },

      adicionarXP: (quantidade) =>
        set((state) => ({
          xpTotal: state.xpTotal + quantidade,
          updatedAt: new Date().toISOString(),
        })),

      registrarDecisao: (decisaoSemId) => {
        const decisao: DecisaoNarrativa = {
          ...decisaoSemId,
          id: `d-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          decisoesTomadas: [...state.decisoesTomadas, decisao],
          updatedAt: new Date().toISOString(),
        }));
      },

      marcarConflitoNavegado: (conflitoId) =>
        set((state) => ({
          conflitosNavegados: [...new Set([...state.conflitosNavegados, conflitoId])],
          updatedAt: new Date().toISOString(),
        })),

      emitirEvento: (eventoSemTimestamp) => {
        const evento: EventoNarrativo = {
          ...eventoSemTimestamp,
          timestamp: new Date().toISOString(),
        };
        set({ ultimoEvento: evento });
      },

      resetarNarrativa: () =>
        set({ ...ESTADO_INICIAL, ultimoEvento: null }),
    }),
    {
      name: 'mente-ai-narrativa',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        perfilDetectado: state.perfilDetectado,
        dimensaoAtiva: state.dimensaoAtiva,
        agenteAtivo: state.agenteAtivo,
        fase: state.fase,
        temporada: state.temporada,
        modulo: state.modulo,
        xpTotal: state.xpTotal,
        decisoesTomadas: state.decisoesTomadas,
        conflitosNavegados: state.conflitosNavegados,
        updatedAt: state.updatedAt,
      }),
    },
  ),
);

