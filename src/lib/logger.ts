/**
 * logger.ts — Structured logging leve para MENTE.AI.
 *
 * Design:
 * - Zero dependências externas
 * - Silencioso em produção (apenas warn/error)
 * - Preparado para integração com Sentry/Winston/OpenTelemetry
 * - Formato JSON estruturado para ingestão em sistemas de log
 *
 * Evolução: trocar `writeLog` por um transport do Sentry ou Winston.
 */

// ─── Níveis de log ────────────────────────────────────────────────────────────

export type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export type { LogEntry };

// ─── Configuração ─────────────────────────────────────────────────────────────

const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production";

const isBrowser = typeof window !== "undefined";

// Em produção, só emitimos warn e error para não poluir os logs do Vercel
const MIN_LEVEL: LogLevel = isProduction ? "warn" : "debug";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// ─── Transport ────────────────────────────────────────────────────────────────

/**
 * Hook de transporte — substitua para integrar com Sentry, Datadog, etc.
 *
 * Exemplo:
 *   setTransport((entry) => {
 *     Sentry.captureMessage(entry.message, { level: entry.level, extra: entry.context });
 *   });
 */
let _transport: ((entry: LogEntry) => void) | null = null;

export function setTransport(fn: (entry: LogEntry) => void): void {
  _transport = fn;
}

function writeLog(entry: LogEntry): void {
  // Transport customizado (Sentry, etc.)
  if (_transport) {
    try {
      _transport(entry);
    } catch {
      // Silencioso — não queremos que o logger quebre a app
    }
  }

  // Console nativo
  if (isBrowser) {
    const fn =
      entry.level === "error"
        ? console.error
        : entry.level === "warn"
          ? console.warn
          : entry.level === "info"
            ? console.info
            : console.debug;
    fn(`[MENTE.AI] ${entry.message}`, entry.context ?? "");
  } else {
    // Server-side: JSON estruturado (parseável por Vercel Logs, Datadog, etc.)
    const json = JSON.stringify(entry);
    if (entry.level === "error") console.error(json);
    else if (entry.level === "warn") console.warn(json);
    else console.log(json);
  }
}

// ─── API Pública ──────────────────────────────────────────────────────────────

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[MIN_LEVEL];
}

function log(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>
): void {
  if (!shouldLog(level)) return;

  writeLog({
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  });
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) =>
    log("debug", msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log("info", msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log("warn", msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) =>
    log("error", msg, ctx),
};

export { isProduction, isBrowser };
