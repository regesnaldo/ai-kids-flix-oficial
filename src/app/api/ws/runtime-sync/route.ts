/**
 * ─── RUNTIME SYNC — GET /api/ws/runtime-sync ──────────────────────────────
 *
 * Server-Sent Events endpoint that streams real-time Nexus state updates
 * to connected clients. Replaces polling in progression routes.
 *
 * TRANSPORT HIERARCHY (client-side):
 *   1. WebSocket (ws://)       — preferred, bidirectional
 *   2. SSE (this endpoint)     — HTTP streaming, universal
 *   3. REST polling            — fallback via /api/universo/progression
 *
 * CLIENT EXAMPLE:
 *   const es = new EventSource("/api/ws/runtime-sync");
 *   es.onmessage = (e) => {
 *     const { state, sourceEvent } = JSON.parse(e.data);
 *     // Update your Zustand store with nexusRuntime state
 *   };
 *
 * PHASE 4: Memory Keeper & WebSocket Runtime
 */

import { nexusBus } from "@/lib/nexus/nexus.events";
import { nexusRuntime } from "@/lib/nexus/NexusRuntime";
import type { NexusCanonicalState } from "@/lib/nexus/nexus.types";
import type { NexusEvent } from "@/lib/nexus/nexus.events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** State-changing event types that trigger a broadcast. */
const STATE_EVENT_TYPES = new Set([
  "PLANET_ACTIVATED",
  "PLANET_COMPLETED",
  "PLANET_UNLOCKED",
  "PROGRESSION_STATE_CHANGED",
  "MISSION_COMPLETED",
  "MISSION_FAILED",
  "HINT_GENERATED",
  "CONTEXT_COMPRESSED",
  "MEMORY_SYNC",
  "AGENT_LIFECYCLE",
  "RUNTIME_HEALTH",
]);

/**
 * GET — establish SSE connection.
 *
 * Returns a ReadableStream with Content-Type: text/event-stream.
 * The client receives STATE_UPDATED events whenever the Nexus
 * state changes through nexusBus.
 */
export async function GET() {
  // Ensure Nexus is initialized
  if (!nexusRuntime.isInitialized) {
    nexusRuntime.init();
  }

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      // Send initial state snapshot immediately
      const initial = buildStateEvent("CONNECTION_ESTABLISHED");
      controller.enqueue(encodeSSE(initial));

      // Subscribe to nexusBus for state changes
      const unsubscribe = nexusBus.subscribe(
        "*",
        (event: NexusEvent) => {
          if (closed) return;
          if (!STATE_EVENT_TYPES.has(event.type)) return;

          try {
            const update = buildStateEvent(event.type);
            controller.enqueue(encodeSSE(update));
          } catch {
            closed = true;
            try { controller.close(); } catch { /* ok */ }
          }
        }
      );

      // Keep-alive ping every 15 seconds
      const keepAlive = setInterval(() => {
        if (closed) return;
        try {
          controller.enqueue(encodeSSE({ type: "KEEPALIVE" }));
        } catch {
          closed = true;
          clearInterval(keepAlive);
          try { controller.close(); } catch { /* ok */ }
        }
      }, 15_000);

      // Cleanup on disconnect
      const cleanup = () => {
        closed = true;
        clearInterval(keepAlive);
        unsubscribe();
        try { controller.close(); } catch { /* ok */ }
      };

      // request.signal is available in Next.js route handlers
      // to detect client disconnection
      // We rely on the enqueue throwing when the stream is closed
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

// ── Helpers ────────────────────────────────────────────────────────────────────

interface SSEPayload {
  type: "STATE_UPDATED" | "KEEPALIVE";
  state?: NexusCanonicalState;
  timestamp?: number;
  sourceEvent?: string;
}

function encodeSSE(payload: SSEPayload): Uint8Array {
  let data: string;

  if (payload.type === "KEEPALIVE") {
    data = `: keepalive\n\n`;
  } else {
    data = `data: ${JSON.stringify(payload)}\n\n`;
  }

  return new TextEncoder().encode(data);
}

function buildStateEvent(sourceEvent: string): SSEPayload {
  return {
    type: "STATE_UPDATED",
    state: nexusRuntime.getSnapshot() as NexusCanonicalState,
    timestamp: Date.now(),
    sourceEvent,
  };
}
