/**
 * ─── NAVIGATION HINTS — Cross-Section Handoff Protocol ────────────────────────
 *
 * How context survives navigation between sections without page reload
 * or state loss. Implements the 5-section connectivity matrix as a
 * runtime protocol that preserves mission state, active discoveries,
 * and pending navigation hints across section boundaries.
 *
 * Architecture:
 *   - Zustand store (useNavigationStore) holds current handoff payload
 *   - On navigation, origin section pushes payload before route change
 *   - Destination section reads payload on mount and consumes it
 *   - Payload auto-expires after TTL to prevent stale context
 */

import type {
  PlatformSection,
  NavigationHint,
  CrossSectionPayload,
  MissionState,
} from "./types";

// ─── HANDSOFF PAYLOAD FACTORY ─────────────────────────────────────────────────

/**
 * Create a handoff payload when navigating from one section to another.
 * The payload carries mission context so the destination can continue
 * the journey seamlessly.
 */
export function createHandoffPayload(
  origin: PlatformSection,
  destination: PlatformSection,
  context: {
    missionId: string | null;
    lastDiscoveryTag: string | null;
    activeExperimentId: string | null;
    transferredHints: NavigationHint[];
  }
): CrossSectionPayload {
  return {
    origin,
    destination,
    context,
    timestamp: Date.now(),
    ttl: 600_000, // 10 minutes
  };
}

/**
 * Check if a handoff payload is still valid.
 */
export function isPayloadValid(payload: CrossSectionPayload): boolean {
  return Date.now() - payload.timestamp < payload.ttl;
}

// ─── CONTEXT TRANSFER ─────────────────────────────────────────────────────────

/**
 * Transfer mission continuity context from origin to destination.
 * Returns the actions the destination section should take on mount.
 */
export function processHandoff(
  payload: CrossSectionPayload
): {
  shouldResumeMission: boolean;
  shouldShowBeacons: boolean;
  relevantHints: NavigationHint[];
  continuationMessage: string | null;
} {
  if (!isPayloadValid(payload)) {
    return {
      shouldResumeMission: false,
      shouldShowBeacons: false,
      relevantHints: [],
      continuationMessage: null,
    };
  }

  const { context } = payload;

  return {
    shouldResumeMission: context.missionId !== null,
    shouldShowBeacons: context.transferredHints.length > 0,
    relevantHints: context.transferredHints.filter(
      (h) => h.section === payload.destination
    ),
    continuationMessage: buildContinuationMessage(payload),
  };
}

function buildContinuationMessage(
  payload: CrossSectionPayload
): string | null {
  const { context, origin, destination } = payload;

  // Only generate if there's meaningful context to continue
  if (!context.lastDiscoveryTag && context.transferredHints.length === 0) {
    return null;
  }

  const originLabels: Record<PlatformSection, string> = {
    home: "Núcleo",
    series: "Missões",
    blog: "Arquivos",
    explore: "Cartografia",
    lab: "Núcleo Quântico",
  };

  const destinationLabels: Record<PlatformSection, string> = {
    home: "Núcleo do Sistema",
    series: "Missões",
    blog: "Arquivos",
    explore: "Cartografia",
    lab: "Núcleo Quântico",
  };

  if (context.lastDiscoveryTag) {
    return `Continuando jornada de ${originLabels[origin]} — descoberta "${context.lastDiscoveryTag}" conectada a ${destinationLabels[destination]}`;
  }

  return `Transitando de ${originLabels[origin]} para ${destinationLabels[destination]}`;
}

// ─── HANDOFF PROTOCOL ─────────────────────────────────────────────────────────

export interface HandoffProtocol {
  /** Push context before leaving origin section */
  push: (destination: PlatformSection) => void;
  /** Consume context on destination section mount */
  consume: () => CrossSectionPayload | null;
  /** Clear expired or consumed payloads */
  clear: () => void;
}

/**
 * Create a handoff protocol instance bound to a Zustand store.
 * Used by the useNavigationStore to manage the handoff lifecycle.
 */
export function createHandoffProtocol(
  getPayload: () => CrossSectionPayload | null,
  setPayload: (p: CrossSectionPayload | null) => void,
  getMission: () => MissionState | null,
  getPendingHints: () => NavigationHint[]
): HandoffProtocol {
  return {
    push(destination: PlatformSection) {
      const mission = getMission();
      const hints = getPendingHints();

      if (!mission && hints.length === 0) return; // Nothing to handoff

      // Determine origin from current route
      const origin = detectCurrentSection();

      const payload = createHandoffPayload(origin, destination, {
        missionId: mission?.missionId ?? null,
        lastDiscoveryTag: mission?.lastDiscovery?.tag ?? null,
        activeExperimentId: null, // Populated by lab-specific logic
        transferredHints: hints,
      });

      setPayload(payload);
    },

    consume() {
      const payload = getPayload();
      if (!payload) return null;
      if (!isPayloadValid(payload)) {
        setPayload(null);
        return null;
      }
      // Consume once — clear after reading
      setPayload(null);
      return payload;
    },

    clear() {
      setPayload(null);
    },
  };
}

// ─── SECTION DETECTION ────────────────────────────────────────────────────────

/**
 * Detect current section from window.location.
 * Client-side only.
 */
export function detectCurrentSection(): PlatformSection {
  if (typeof window === "undefined") return "home";

  const path = window.location.pathname;

  if (path.startsWith("/series")) return "series";
  if (path.startsWith("/blog")) return "blog";
  if (path.startsWith("/explore") || path.startsWith("/explorar")) return "explore";
  if (path.startsWith("/lab")) return "lab";
  return "home";
}

// ─── NAVIGATION GUARD ─────────────────────────────────────────────────────────

/**
 * Navigation guard that intercepts route changes to push handoff context.
 * Should be called in a global router event listener or Link click handler.
 */
export function onBeforeNavigate(destination: PlatformSection): void {
  // This is called by the navigation store's navigateTo action
  // The actual push happens in the Zustand store
  if (typeof window !== "undefined") {
    // Store current section for handoff
    const currentSection = detectCurrentSection();
    window.__mente_current_section = currentSection;
    window.__mente_navigating_to = destination;
  }
}

// Extend Window interface for navigation tracking
declare global {
  interface Window {
    __mente_current_section?: PlatformSection;
    __mente_navigating_to?: PlatformSection;
  }
}
