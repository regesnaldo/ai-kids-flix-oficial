/**
 * useNarrativa.ts — Hook para o Sistema de Narrativa Adaptativa — MENTE.AI
 *
 * Abstrai a lógica de roteamento narrativo, detecção de perfil
 * e progressão pelas dimensões D1/D2/D3.
 */

'use client';

import { useCallback } from 'react';
import { useNarrativaStore } from '@/store/useNarrativaStore';
import type { DimensaoId, PerfilId } from '@/types/narrativa';
import type { UniversoId } from '@/data/universos';

interface RotaNarrativa {
  agentePrimario: UniversoId;
  agentesSecundarios: UniversoId[];
  dimensaoDetectada: DimensaoId;
  perfilDetectado: PerfilId;
  xpGanho: number;
}

export function useNarrativa() {
  const store = useNarrativaStore();

  /**
   * Envia mensagem para o sistema de narrativa e recebe a rota de agente
   */
  const rotear = useCallback(
    async (mensagem: string): Promise<RotaNarrativa | null> => {
      try {
        const res = await fetch('/api/narrativa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mensagem,
            perfilAtual: store.perfilDetectado,
            fase: store.fase,
            historico: store.decisoesTomadas.slice(-5).map((d) => d.opcaoEscolhida),
          }),
        });

        if (!res.ok) return null;

        const data = await res.json();

        // Atualiza store com os dados detectados
        if (data.perfilDetectado) store.detectarPerfil(data.perfilDetectado);
        if (data.dimensaoDetectada) store.setDimensaoAtiva(data.dimensaoDetectada);
        if (data.agentePrimario) store.setAgenteAtivo(data.agentePrimario);

        store.adicionarXP(data.xpGanho ?? 15);
        store.emitirEvento({
          tipo: 'AGENTE_ATIVADO',
          payload: { agente: data.agentePrimario, dimensao: data.dimensaoDetectada },
        });

        return data;
      } catch {
        return null;
      }
    },
    [store],
  );

  /**
   * Registra decisão do usuário e avança o módulo
   */
  const registrarDecisaoEAvancar = useCallback(
    (opcao: string, tipo: 'CLIQUE' | 'DIGITACAO' | 'VOZ' | 'ESCOLHA_MORAL' = 'CLIQUE') => {
      store.registrarDecisao({
        temporada: store.temporada,
        modulo: store.modulo,
        tipo,
        opcaoEscolhida: opcao,
        agenteRespondeu: store.agenteAtivo,
        dimensaoAtivada: store.dimensaoAtiva,
      });
      store.avancarModulo();
      store.adicionarXP(tipo === 'ESCOLHA_MORAL' ? 25 : 15);
    },
    [store],
  );

  return {
    // Estado atual
    perfil: store.perfilDetectado,
    dimensao: store.dimensaoAtiva,
    agente: store.agenteAtivo,
    fase: store.fase,
    temporada: store.temporada,
    modulo: store.modulo,
    xp: store.xpTotal,
    ultimoEvento: store.ultimoEvento,

    // Ações
    rotear,
    registrarDecisaoEAvancar,
    setDimensao: store.setDimensaoAtiva,
    setAgente: store.setAgenteAtivo,
    adicionarXP: store.adicionarXP,
    resetar: store.resetarNarrativa,
  };
}

