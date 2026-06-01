/**
 * ─── NEXUS WEBSOCKET RUNTIME — Real-Time State Sync ─────────────────────────
 *
 * Broadcasts STATE_UPDATED events from nexusBus to connected clients.
 * Replaces polling in progression routes with live push.
 *
 * TRANSPORTS:
 *   1. WebSocket   — ws:// (native, bidirectional)
 *   2. SSE         — /api/ws/runtime-sync (HTTP streaming, universal)
 *   3. REST fallback — GET /api/universo/progression (polling)
 *
 * PHASE 4: Memory Keeper & WebSocket Runtime
 */

import { nexusBus, type NexusEvent } from "./nexus.events";
import { nexusRuntime } from "./NexusRuntime";
import type { NexusCanonicalState } from "./nexus.types";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** The shape of a STATE_UPDATED event sent to WebSocket/SSE clients. */
export interface StateUpdatedEvent {
  type: "STATE_UPDATED";
  /** The canonical state snapshot after the change */
  state: NexusCanonicalState;
  /** Timestamp of the state change */
  timestamp: number;
  /** Which event triggered the update */
  sourceEvent: string;
  /** Optional delta description */
  delta?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SERVER-SENT EVENTS (SSE) WRITER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Manages the SSE connection lifecycle.
 * Used by the API route to stream state updates to a single client.
 */
export class SSEClientWriter {
  private closed = false;
  private controller: ReadableStreamDefaultController;

  constructor(controller: ReadableStreamDefaultController) {
    this.controller = controller;
  }

  /** Send a state update event to the SSE client. */
  send(event: StateUpdatedEvent): void {
    if (this.closed) return;
    try {
      const data = `data: ${JSON.stringify(event)}\n\n`;
      this.controller.enqueue(new TextEncoder().encode(data));
    } catch {
      this.closed = true;
    }
  }

  /** Close the SSE connection. */
  close(): void {
    if (this.closed) return;
    this.closed = true;
    try {
      this.controller.close();
    } catch {
      // Already closed
    }
  }

  get isClosed(): boolean {
    return this.closed;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// WEBSOCKET BROADCASTER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * WebSocket broadcaster that subscribes to nexusBus and pushes
 * STATE_UPDATED events to all connected WebSocket clients.
 *
 * Singleton — one instance manages all connections.
 */
class WebSocketBroadcaster {
  private clients: Set<import("ws").WebSocket> = new Set();
  private unsubscribeFromBus: (() => void) | null = null;
  private started = false;

  /**
   * Add a WebSocket client to the broadcast pool.
   * Starts the nexusBus subscription on first client.
   */
  addClient(ws: import("ws").WebSocket): void {
    this.clients.add(ws);

    ws.on("close", () => {
      this.clients.delete(ws);
    });

    ws.on("error", () => {
      this.clients.delete(ws);
    });

    if (!this.started) {
      this.startBroadcast();
    }

    // Send initial state snapshot
    const snapshot = nexusRuntime.getSnapshot();
    this.sendToClient(ws, {
      type: "STATE_UPDATED",
      state: snapshot as NexusCanonicalState,
      timestamp: Date.now(),
      sourceEvent: "CONNECTION_ESTABLISHED",
      delta: "Initial state snapshot",
    });
  }

  /** Start listening to nexusBus and broadcasting to all clients. */
  private startBroadcast(): void {
    this.unsubscribeFromBus = nexusBus.subscribe(
      "*",
      this.handleNexusEvent.bind(this)
    );
    this.started = true;
  }

  /** Handle a nexusBus event by broadcasting state to all clients. */
  private handleNexusEvent(event: NexusEvent): void {
    // Only broadcast on state-changing events
    const stateEvents = new Set([
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

    if (!stateEvents.has(event.type)) return;

    const snapshot = nexusRuntime.getSnapshot();
    const update: StateUpdatedEvent = {
      type: "STATE_UPDATED",
      state: snapshot as NexusCanonicalState,
      timestamp: Date.now(),
      sourceEvent: event.type,
    };

    this.broadcast(update);
  }

  /** Broadcast a state update to all connected clients. */
  private broadcast(event: StateUpdatedEvent): void {
    const message = JSON.stringify(event);
    for (const client of this.clients) {
      try {
        client.send(message);
      } catch {
        this.clients.delete(client);
      }
    }
  }

  /** Send to a single client. */
  private sendToClient(
    ws: import("ws").WebSocket,
    event: StateUpdatedEvent
  ): void {
    try {
      ws.send(JSON.stringify(event));
    } catch {
      this.clients.delete(ws);
    }
  }

  /** Number of connected clients. */
  get clientCount(): number {
    return this.clients.size;
  }

  /** Shutdown — close all connections and unsubscribe. */
  shutdown(): void {
    for (const client of this.clients) {
      try {
        client.close(1001, "Server shutdown");
      } catch {
        // Best effort
      }
    }
    this.clients.clear();
    if (this.unsubscribeFromBus) {
      this.unsubscribeFromBus();
      this.unsubscribeFromBus = null;
    }
    this.started = false;
  }
}

// Singleton
export const wsBroadcaster = new WebSocketBroadcaster();
