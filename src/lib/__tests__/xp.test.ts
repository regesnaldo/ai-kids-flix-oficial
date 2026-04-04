/**
 * MENTE.AI — Testes Unitários: Configuração de XP
 * src/lib/__tests__/xp.test.ts
 *
 * Testes para configuração de recompensas de XP.
 */

import { describe, it, expect } from '@jest/globals';
import { XP_REWARDS } from '../xp';

describe('xp rewards', () => {
  it('deve ter valores positivos para todas as recompensas', () => {
    for (const [key, value] of Object.entries(XP_REWARDS)) {
      expect(value).toBeGreaterThan(0);
      expect(typeof value).toBe('number');
    }
  });

  it('deve ter recompensas da Fase 1 (MVP)', () => {
    expect(XP_REWARDS.NOTA_CRIADA).toBe(10);
    expect(XP_REWARDS.EXPERIMENTO_CONCLUIDO).toBe(25);
    expect(XP_REWARDS.LOGIN_DIARIO).toBe(5);
    expect(XP_REWARDS.PERFIL_COMPLETO).toBe(50);
  });

  it('deve ter recompensas de agentes (Fase 2)', () => {
    expect(XP_REWARDS.AGENTE_DESBLOQUEADO).toBe(30);
    expect(XP_REWARDS.AGENTE_INTERACAO).toBe(15);
    expect(XP_REWARDS.AGENTE_COMPLETADO).toBe(100);
  });

  it('deve ter recompensas de combinações (Fase 2)', () => {
    expect(XP_REWARDS.COMBINACAO_DESCOBERTA).toBe(50);
    expect(XP_REWARDS.COMBINACAO_USADA).toBe(10);
  });

  it('COMBINACAO_DESCOBERTA deve valer mais que COMBINACAO_USADA', () => {
    expect(XP_REWARDS.COMBINACAO_DESCOBERTA).toBeGreaterThan(XP_REWARDS.COMBINACAO_USADA);
  });

  it('AGENTE_COMPLETADO deve ser a maior recompensa de agente', () => {
    expect(XP_REWARDS.AGENTE_COMPLETADO).toBeGreaterThan(XP_REWARDS.AGENTE_DESBLOQUEADO);
    expect(XP_REWARDS.AGENTE_COMPLETADO).toBeGreaterThan(XP_REWARDS.AGENTE_INTERACAO);
  });
});
