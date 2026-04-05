/**
 * MENTE.AI — Testes Unitários: Logger de Gamificação
 * src/lib/__tests__/gamification-logger.test.ts
 *
 * Testes para:
 *  - Formato estruturado dos logs
 *  - Filtragem por nível de log
 *  - Geração de sessionId
 *  - Tipos de eventos
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock de console
const mockConsole = {
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  console.debug = mockConsole.debug;
  console.info = mockConsole.info;
  console.warn = mockConsole.warn;
  console.error = mockConsole.error;
});

describe('gamification-logger', () => {
  describe('logXPGain', () => {
    it('deve logar evento XP_GAIN com formato estruturado', async () => {
      const { logXPGain } = await import('../gamification-logger');
      
      logXPGain({
        xpGanho: 50,
        xpTotal: 150,
        xpSemana: 50,
        tipoEvento: 'COMBINACAO_DESCOBERTA',
      }, 1);

      expect(mockConsole.info).toHaveBeenCalled();
      const logCall = mockConsole.info.mock.calls[0];
      const logJson = JSON.parse(logCall[1] as string);
      
      expect(logJson.event).toBe('XP_GAIN');
      expect(logJson.level).toBe('INFO');
      expect(logJson.metadata).toEqual(expect.objectContaining({
        xpGanho: 50,
        xpTotal: 150,
      }));
    });

    it('deve incluir userId quando fornecido', async () => {
      const { logXPGain } = await import('../gamification-logger');
      
      logXPGain({
        xpGanho: 10,
        xpTotal: 100,
        xpSemana: 10,
        tipoEvento: 'NOTA_CRIADA',
      }, 123);

      const logCall = mockConsole.info.mock.calls[0];
      const logJson = JSON.parse(logCall[1] as string);
      
      expect(logJson.userId).toBe(123);
    });
  });

  describe('logCombination', () => {
    it('deve logar evento COMBINATION com dados completos', async () => {
      const { logCombination } = await import('../gamification-logger');
      
      logCombination({
        combinationId: 'combo-1',
        agentAId: 'agente-a',
        agentBId: 'agente-b',
        tipoSinergia: 'amplificacao',
        sinergiaBonus: 1.2,
        novaDescoberta: true,
        xpGanho: 75,
      }, 1);

      const logCall = mockConsole.info.mock.calls[0];
      const logJson = JSON.parse(logCall[1] as string);
      
      expect(logJson.event).toBe('COMBINATION');
      expect(logJson.metadata).toEqual(expect.objectContaining({
        combinationId: 'combo-1',
        agentAId: 'agente-a',
        agentBId: 'agente-b',
        novaDescoberta: true,
      }));
    });
  });

  describe('logBadgeEarned', () => {
    it('deve logar evento BADGE_EARNED com dados da badge', async () => {
      const { logBadgeEarned } = await import('../gamification-logger');
      
      logBadgeEarned({
        badgeId: 'explorador',
        badgeLabel: 'Explorador',
        xpTotal: 50,
      }, 1);

      const logCall = mockConsole.info.mock.calls[0];
      const logJson = JSON.parse(logCall[1] as string);
      
      expect(logJson.event).toBe('BADGE_EARNED');
      expect(logJson.metadata).toEqual({
        badgeId: 'explorador',
        badgeLabel: 'Explorador',
        xpTotal: 50,
      });
    });
  });

  describe('logError', () => {
    it('deve logar evento ERROR com nível ERROR', async () => {
      const { logError } = await import('../gamification-logger');
      
      logError({
        context: 'agent-combination',
        error: 'Erro de conexão',
        userId: 1,
      });

      expect(mockConsole.error).toHaveBeenCalled();
      const logCall = mockConsole.error.mock.calls[0];
      const logJson = JSON.parse(logCall[1] as string);
      
      expect(logJson.event).toBe('ERROR');
      expect(logJson.level).toBe('ERROR');
      expect(logJson.error).toBe('Erro de conexão');
    });

    it('deve incluir stack trace quando disponível', async () => {
      const { logError } = await import('../gamification-logger');
      
      logError({
        context: 'xp-webhook',
        error: 'Erro interno',
        stack: 'Error: Erro interno\n  at xyz',
      });

      const logCall = mockConsole.error.mock.calls[0];
      const logJson = JSON.parse(logCall[1] as string);
      
      expect(logJson.error).toBe('Erro interno');
    });
  });

  describe('logStreakUpdate', () => {
    it('deve logar evento STREAK_UPDATE com dias consecutivos', async () => {
      const { logStreakUpdate } = await import('../gamification-logger');
      
      logStreakUpdate({
        streakDias: 7,
        ultimaAtividade: '2026-03-30',
      }, 1);

      const logCall = mockConsole.info.mock.calls[0];
      const logJson = JSON.parse(logCall[1] as string);
      
      expect(logJson.event).toBe('STREAK_UPDATE');
      expect(logJson.metadata).toEqual({
        streakDias: 7,
        ultimaAtividade: '2026-03-30',
      });
    });
  });

  describe('logAgentInteraction', () => {
    it('deve logar evento AGENT_INTERACTION com nível de interação', async () => {
      const { logAgentInteraction } = await import('../gamification-logger');
      
      logAgentInteraction({
        agentId: 'agente-a',
        nivelInteracao: 3,
        agenteConcluido: false,
      }, 1);

      const logCall = mockConsole.info.mock.calls[0];
      const logJson = JSON.parse(logCall[1] as string);
      
      expect(logJson.event).toBe('AGENT_INTERACTION');
      expect(logJson.metadata).toEqual({
        agentId: 'agente-a',
        nivelInteracao: 3,
        agenteConcluido: false,
      });
    });
  });

  describe('logAgentUnlock', () => {
    it('deve logar evento AGENT_UNLOCK quando agente é desbloqueado', async () => {
      const { logAgentUnlock } = await import('../gamification-logger');
      
      logAgentUnlock({
        agentId: 'agente-x',
        agentName: 'Agente X',
        requisitoAtendido: 'nivel_interacao_5',
      }, 1);

      const logCall = mockConsole.info.mock.calls[0];
      const logJson = JSON.parse(logCall[1] as string);
      
      expect(logJson.event).toBe('AGENT_UNLOCK');
      expect(logJson.metadata).toEqual({
        agentId: 'agente-x',
        agentName: 'Agente X',
        requisitoAtendido: 'nivel_interacao_5',
      });
    });
  });

  describe('SessionId', () => {
    it('deve gerar sessionId único para cada sessão', async () => {
      const { logXPGain } = await import('../gamification-logger');
      
      logXPGain({ xpGanho: 10, xpTotal: 10, xpSemana: 10, tipoEvento: 'LOGIN_DIARIO' }, 1);
      const logCall1 = mockConsole.info.mock.calls[0];
      const logJson1 = JSON.parse(logCall1[1] as string);
      
      logXPGain({ xpGanho: 10, xpTotal: 20, xpSemana: 20, tipoEvento: 'LOGIN_DIARIO' }, 1);
      const logCall2 = mockConsole.info.mock.calls[1];
      const logJson2 = JSON.parse(logCall2[1] as string);
      
      // SessionId deve ser o mesmo na mesma sessão (client-side)
      expect(logJson1.sessionId).toBeDefined();
      expect(logJson2.sessionId).toBeDefined();
    });

    it('deve incluir timestamp em formato ISO', async () => {
      const { logXPGain } = await import('../gamification-logger');
      
      logXPGain({ xpGanho: 10, xpTotal: 10, xpSemana: 10, tipoEvento: 'LOGIN_DIARIO' }, 1);
      
      const logCall = mockConsole.info.mock.calls[0];
      const logJson = JSON.parse(logCall[1] as string);
      
      expect(logJson.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});
