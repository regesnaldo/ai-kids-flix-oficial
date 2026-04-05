/**
 * MENTE.AI — Testes Unitários: Serviço de Combinação de Agentes
 * src/services/__tests__/agent-combination.test.ts
 *
 * Testes para:
 *  - Normalização de pares (A, B) = (B, A)
 *  - Validações básicas de entrada
 */

import { describe, it, expect } from '@jest/globals';
import { normalizarPar } from '../agent-combination';

describe('agent-combination', () => {
  describe('normalizarPar', () => {
    it('deve manter ordem lexicográfica quando A < B', () => {
      expect(normalizarPar('agente-a', 'agente-b')).toEqual(['agente-a', 'agente-b']);
    });

    it('deve inverter ordem quando B < A', () => {
      expect(normalizarPar('agente-b', 'agente-a')).toEqual(['agente-a', 'agente-b']);
    });

    it('deve lidar com strings idênticas', () => {
      expect(normalizarPar('agente-x', 'agente-x')).toEqual(['agente-x', 'agente-x']);
    });

    it('deve lidar com diferenças de case', () => {
      // 'A' (65) vem antes de 'b' (98) em ordem lexicográfica
      expect(normalizarPar('agente-b', 'Agente-a')).toEqual(['Agente-a', 'agente-b']);
    });

    it('deve lidar com números no nome', () => {
      expect(normalizarPar('agente-2', 'agente-10')).toEqual(['agente-10', 'agente-2']);
    });

    it('deve lidar com strings vazias', () => {
      expect(normalizarPar('', 'agente-a')).toEqual(['', 'agente-a']);
    });
  });
});
