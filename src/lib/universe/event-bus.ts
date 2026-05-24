/**
 * ─── EVENT BUS — Centralized Runtime Communication ────────────────────────────
 *
 * NO component may directly control another component.
 * All state transitions flow through UniverseEventBus.
 *
 * Events are typed. Subscribers filter by type. Emitters fire into the void
 * (no return value, no promise, no coupling to consumers).
 */

import type { PlanetId, PlanetState } from "./planet-registry";

// ─── EVENT TYPES ──────────────────────────────────────────────────────────────

export type UniverseEvent =
  | { type: "PLANET_UNLOCKED"; planetId: PlanetId; source: string }
  | { type: "PLANET_ACTIVATED"; planetId: PlanetId }
  | { type: "PLANET_COMPLETED"; planetId: PlanetId }
  | { type: "SIGNAL_DETECTED"; planetId: PlanetId; strength: number }
  | { type: "MISSION_COMPLETED"; planetId: PlanetId }
  | { type: "MISSION_FAILED"; planetId: PlanetId; reason: string }
  | { type: "HINT_GENERATED"; planetId: PlanetId; hint: string }
  | { type: "PROGRESSION_STATE_CHANGED"; planetId: PlanetId; from: PlanetState; to: PlanetState }
  | { type: "AUDIO_STATE_CHANGED"; planetId: PlanetId; signature: string; active: boolean }
  | { type: "CONTEXT_COMPRESSED"; planetId: PlanetId; tokenCount: number };

export type UniverseEventType = UniverseEvent["type"];

// ─── SUBSCRIBER ───────────────────────────────────────────────────────────────

export type UniverseSubscriber<T extends UniverseEvent = UniverseEvent> = (
  event: T
) => void;

type Subscription = {
  type: UniverseEventType | "*";
  subscriber: UniverseSubscriber;
  id: number;
};

// ─── BUS IMPLEMENTATION ───────────────────────────────────────────────────────

let nextId = 0;

class UniverseEventBus {
  private subscribers: Subscription[] = [];

  /** Fire an event. All matching subscribers are called synchronously. */
  emit(event: UniverseEvent): void {
    for (const sub of this.subscribers) {
      if (sub.type === "*" || sub.type === event.type) {
        try {
          sub.subscriber(event);
        } catch (err) {
          console.error(
            `[UniverseEventBus] Subscriber error for "${event.type}":`,
            err
          );
          // NEVER let one subscriber crash others
        }
      }
    }
  }

  /** Subscribe to events. Returns an unsubscribe function. */
  subscribe<T extends UniverseEvent>(
    type: UniverseEventType | "*",
    subscriber: UniverseSubscriber<T>
  ): () => void {
    const id = nextId++;
    const sub: Subscription = { type, subscriber: subscriber as UniverseSubscriber, id };
    this.subscribers.push(sub);

    return () => {
      this.subscribers = this.subscribers.filter((s) => s.id !== id);
    };
  }

  /** Remove all subscribers. Used for testing and cleanup. */
  reset(): void {
    this.subscribers = [];
  }

  /** Current subscriber count (diagnostic) */
  get subscriberCount(): number {
    return this.subscribers.length;
  }
}

/** Singleton instance — entire app shares one bus */
export const universeBus = new UniverseEventBus();
