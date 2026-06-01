/**
 * ─── RUNTIME SYNC — GET /api/ws/runtime-sync ──────────────────────────────
 *
 * Returns the current Nexus runtime state snapshot.
 * Formerly SSE; converted to instant REST to eliminate Vercel timeout errors.
 *
 * TRANSPORT:
 *   REST polling (10s interval via OasisProvider)
 *
 * CLIENT EXAMPLE:
 *   const res = await fetch("/api/ws/runtime-sync");
 *   const { state, timestamp } = await res.json();
 *
 * PHASE 4: Memory Keeper & WebSocket Runtime
 */

import { nexusRuntime } from "@/lib/nexus/NexusRuntime";
import type { NexusCanonicalState } from "@/lib/nexus/nexus.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET — return current Nexus runtime state snapshot.
 * Instant response, no streaming. Compatible with Vercel Serverless.
 */
export async function GET() {
  // Ensure Nexus is initialized
  if (!nexusRuntime.isInitialized) {
    nexusRuntime.init();
  }

  const state = nexusRuntime.getSnapshot() as NexusCanonicalState;

  return Response.json({
    type: "STATE_UPDATED",
    state,
    timestamp: Date.now(),
  });
}
