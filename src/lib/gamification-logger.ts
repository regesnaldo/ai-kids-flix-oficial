/**
 * MENTE.AI — Sistema de Logging Estruturado para Gamificação
 * src/lib/gamification-logger.ts
 *
 * Propósito:
 *  - Rastrear eventos de gamificação para analytics e debug
 *  - Padronizar formato dos logs para facilitar parsing em ferramentas de monitoramento
 *  - Permitir filtragem por tipo de evento, userId, sessionId
 *
 * Formato de log (JSON estruturado):
 * {
 *   "timestamp": "2026-03-30T14:32:15.123Z",
 *   "level": "INFO" | "WARN" | "ERROR",
 *   "event": "XP_GAIN" | "AGENT_UNLOCK" | "COMBINATION" | "BADGE_EARNED",
 *   "userId": 123,
 *   "sessionId": "abc-123",
 *   "metadata": { ... },
 *   "latencyMs": 45
 * }
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type GamificationEventType =
  | 'XP_GAIN'
  | 'AGENT_UNLOCK'
  | 'AGENT_INTERACTION'
  | 'COMBINATION'
  | 'BADGE_EARNED'
  | 'STREAK_UPDATE'
  | 'LEVEL_UP'
  | 'ERROR';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface GamificationLogEvent {
  timestamp: string;
  level: LogLevel;
  event: GamificationEventType;
  userId?: number;
  sessionId?: string;
  metadata?: Record<string, unknown>;
  latencyMs?: number;
  error?: string;
}

// ─── Configuração ─────────────────────────────────────────────────────────────

interface LoggerConfig {
  /** Prefixo para todos os logs */
  prefix: string;
  /** Habilitar logs em ambiente de produção */
  enableInProduction: boolean;
  /** Nível mínimo de log (DEBUG < INFO < WARN < ERROR) */
  minLevel: LogLevel;
}

const CONFIG: LoggerConfig = {
  prefix: '[MENTE.AI-GAMIFICATION]',
  enableInProduction: false,
  minLevel: 'INFO',
};

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function shouldLog(level: LogLevel): boolean {
  if (process.env.NODE_ENV === 'production' && !CONFIG.enableInProduction) {
    return level === 'ERROR';
  }
  return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[CONFIG.minLevel];
}

function generateSessionId(): string {
  if (typeof crypto === 'undefined') {
    return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }
  return `session-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

function getSessionId(): string {
  if (typeof window === 'undefined') {
    // Server-side: gera novo sessionId por request
    return generateSessionId();
  }
  // Client-side: usa sessionStorage para persistir entre logs
  let sessionId = sessionStorage.getItem('gamification_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('gamification_session_id', sessionId);
  }
  return sessionId;
}

// ─── Logger Principal ─────────────────────────────────────────────────────────

function log(eventData: Omit<GamificationLogEvent, 'timestamp' | 'sessionId'>): void {
  if (!shouldLog(eventData.level)) return;

  const logEntry: GamificationLogEvent = {
    ...eventData,
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
  };

  // Log estruturado em JSON (fácil de parsear em ferramentas de monitoramento)
  const logMessage = JSON.stringify(logEntry);

  switch (eventData.level) {
    case 'DEBUG':
      console.debug(CONFIG.prefix, logMessage);
      break;
    case 'INFO':
      console.info(CONFIG.prefix, logMessage);
      break;
    case 'WARN':
      console.warn(CONFIG.prefix, logMessage);
      break;
    case 'ERROR':
      console.error(CONFIG.prefix, logMessage);
      break;
  }
}

// ─── Funções Especializadas por Tipo de Evento ────────────────────────────────

export interface XPGainMetadata {
  xpGanho: number;
  xpTotal: number;
  xpSemana: number;
  tipoEvento: string;
  agentId?: string;
  combinationId?: string;
  latencyMs?: number;
}

export function logXPGain(metadata: XPGainMetadata, userId?: number): void {
  log({
    level: 'INFO',
    event: 'XP_GAIN',
    userId,
    metadata: {
      xpGanho: metadata.xpGanho,
      xpTotal: metadata.xpTotal,
      xpSemana: metadata.xpSemana,
      tipoEvento: metadata.tipoEvento,
      agentId: metadata.agentId,
      combinationId: metadata.combinationId,
    },
    latencyMs: metadata.latencyMs,
  });
}

export interface AgentInteractionMetadata {
  agentId: string;
  nivelInteracao: number;
  agenteConcluido?: boolean;
}

export function logAgentInteraction(
  metadata: AgentInteractionMetadata,
  userId?: number,
): void {
  log({
    level: 'INFO',
    event: 'AGENT_INTERACTION',
    userId,
    metadata: {
      agentId: metadata.agentId,
      nivelInteracao: metadata.nivelInteracao,
      agenteConcluido: metadata.agenteConcluido,
    },
  });
}

export interface AgentUnlockMetadata {
  agentId: string;
  agentName: string;
  requisitoAtendido: string;
}

export function logAgentUnlock(
  metadata: AgentUnlockMetadata,
  userId?: number,
): void {
  log({
    level: 'INFO',
    event: 'AGENT_UNLOCK',
    userId,
    metadata: {
      agentId: metadata.agentId,
      agentName: metadata.agentName,
      requisitoAtendido: metadata.requisitoAtendido,
    },
  });
}

export interface CombinationMetadata {
  combinationId: string;
  agentAId: string;
  agentBId: string;
  tipoSinergia: string;
  sinergiaBonus: number;
  novaDescoberta: boolean;
  xpGanho: number;
  latencyMs?: number;
}

export function logCombination(
  metadata: CombinationMetadata,
  userId?: number,
): void {
  log({
    level: 'INFO',
    event: 'COMBINATION',
    userId,
    metadata: {
      combinationId: metadata.combinationId,
      agentAId: metadata.agentAId,
      agentBId: metadata.agentBId,
      tipoSinergia: metadata.tipoSinergia,
      sinergiaBonus: metadata.sinergiaBonus,
      novaDescoberta: metadata.novaDescoberta,
      xpGanho: metadata.xpGanho,
    },
    latencyMs: metadata.latencyMs,
  });
}

export interface BadgeEarnedMetadata {
  badgeId: string;
  badgeLabel: string;
  xpTotal: number;
}

export function logBadgeEarned(
  metadata: BadgeEarnedMetadata,
  userId?: number,
): void {
  log({
    level: 'INFO',
    event: 'BADGE_EARNED',
    userId,
    metadata: {
      badgeId: metadata.badgeId,
      badgeLabel: metadata.badgeLabel,
      xpTotal: metadata.xpTotal,
    },
  });
}

export interface StreakUpdateMetadata {
  streakDias: number;
  ultimaAtividade: string;
}

export function logStreakUpdate(
  metadata: StreakUpdateMetadata,
  userId?: number,
): void {
  log({
    level: 'INFO',
    event: 'STREAK_UPDATE',
    userId,
    metadata: {
      streakDias: metadata.streakDias,
      ultimaAtividade: metadata.ultimaAtividade,
    },
  });
}

export interface ErrorMetadata {
  context: string;
  error: string;
  stack?: string;
  userId?: number;
}

export function logError(metadata: ErrorMetadata): void {
  log({
    level: 'ERROR',
    event: 'ERROR',
    userId: metadata.userId,
    metadata: {
      context: metadata.context,
    },
    error: metadata.error,
  });
}

// ─── Exportação para uso em outras partes do código ──────────────────────────

export const GamificationLogger = {
  logXPGain,
  logAgentInteraction,
  logAgentUnlock,
  logCombination,
  logBadgeEarned,
  logStreakUpdate,
  logError,
};

export default GamificationLogger;
