/**
 * sentry-transport.ts — Integração opcional com Sentry para o logger.
 *
 * ATIVAÇÃO: Instale @sentry/nextjs e configure SENTRY_DSN nas env vars.
 *
 * Depois, no layout raiz ou instrumentation.ts:
 *   import * as Sentry from "@sentry/nextjs";
 *   import { setTransport } from "@/lib/logger";
 *   import { createSentryTransport } from "@/lib/sentry-transport";
 *   setTransport(createSentryTransport({
 *     capture: (msg, extra) => Sentry.captureMessage(msg, { level: "error", extra }),
 *   }));
 */

import type { LogEntry } from "./logger";

type CaptureFn = (message: string, extra?: Record<string, unknown>) => void;

interface SentryTransportOptions {
  console?: boolean;
  capture?: CaptureFn;
}

export function createSentryTransport(options: SentryTransportOptions = {}) {
  const capture: CaptureFn =
    options.capture ??
    ((msg: string, extra?: Record<string, unknown>) => {
      const payload = JSON.stringify({
        level: "error",
        message: msg,
        timestamp: new Date().toISOString(),
        context: extra ?? {},
        platform: "MENTE.AI",
      });
      console.error(payload);
    });

  return (entry: LogEntry): void => {
    if (entry.level === "error" || entry.level === "warn") {
      try {
        capture(entry.message, {
          level: entry.level,
          timestamp: entry.timestamp,
          ...entry.context,
        });
      } catch {
        // Silencioso
      }
    }

    if (options.console) {
      const fn = entry.level === "error" ? console.error : console.warn;
      fn(`[MENTE.AI|Sentry] ${entry.message}`, entry.context ?? "");
    }
  };
}
