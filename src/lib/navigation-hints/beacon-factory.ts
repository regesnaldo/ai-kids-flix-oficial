/**
 * ─── NAVIGATION HINTS — PulseBeacon Factory ───────────────────────────────────
 *
 * Transforms NavigationHint objects into BeaconUIObject instances
 * that drive the cinematic HUD signaling system.
 *
 * No emojis. No rounded corporate buttons. Pure HUD elements.
 * Every beacon is a system signal, not a marketing badge.
 */

import type {
  NavigationHint,
  BeaconUIObject,
  PlatformSection,
  UnlockType,
} from "./types";
import { SECTION_ROUTES, SECTION_LABELS } from "./router";
import { priorityToIntensity } from "./router";

// ─── BEACON FACTORY ───────────────────────────────────────────────────────────

let beaconCounter = 0;

/**
 * Generate a complete BeaconUIObject from a NavigationHint.
 * The returned object is ready to be consumed by HUD components.
 */
export function generatePulseBeacon(hint: NavigationHint): BeaconUIObject {
  const intensity = priorityToIntensity(hint.priority);
  const route = SECTION_ROUTES[hint.section];
  const label = SECTION_LABELS[hint.section];

  beaconCounter++;

  return {
    id: `beacon_${hint.section}_${beaconCounter}_${Date.now()}`,
    section: hint.section,
    label,
    subtitle: hint.reason,
    priority: hint.priority,
    unlockType: hint.unlockType,
    pulseIntensity: intensity ?? "subtle",
    route,
    expiresAt: hint.priority < 0.5 ? Date.now() + 300_000 : null, // 5 min for low priority
    dismissed: false,
  };
}

/**
 * Generate beacons from an array of hints.
 * Filters out hints below visibility threshold and sorts by priority.
 */
export function generateBeacons(hints: NavigationHint[]): BeaconUIObject[] {
  return hints
    .filter((h) => priorityToIntensity(h.priority) !== null)
    .sort((a, b) => b.priority - a.priority)
    .map(generatePulseBeacon);
}

// ─── BEACON SYSTEM TEXT ───────────────────────────────────────────────────────

/**
 * Portuguese user-facing labels for each section.
 * Used by HUD components to display section names.
 */
export const SECTION_DISPLAY_NAMES: Record<PlatformSection, string> = {
  home: "Núcleo",
  series: "Missões",
  blog: "Arquivos",
  explore: "Cartografia",
  lab: "Quântico",
};

/**
 * Portuguese action text for each unlock type.
 * Displayed as the call-to-action on beacon elements.
 */
export const UNLOCK_ACTION_TEXT: Record<UnlockType, string> = {
  discovery: "Nova descoberta",
  experiment: "Experimento disponível",
  mission: "Missão aguardando",
  territory: "Território revelado",
  archive: "Arquivo relacionado",
  continuation: "Continuar jornada",
};

/**
 * Portuguese status text for beacon pulse intensities.
 * Used in the HUD status bar or Data-Stream panel.
 */
export const INTENSITY_STATUS_TEXT = {
  subtle: "SINAL FRACO",
  moderate: "SINAL DETECTADO",
  urgent: "SINAL PRIORITÁRIO",
} as const;

/**
 * Generate a full Portuguese status line for the HUD.
 */
export function generateStatusLine(
  beacon: BeaconUIObject,
  isNew: boolean
): string {
  const action = UNLOCK_ACTION_TEXT[beacon.unlockType];
  const intensity = INTENSITY_STATUS_TEXT[beacon.pulseIntensity];
  const prefix = isNew ? "NOVO" : "ATIVO";

  return `[${prefix}] [${intensity}] ${action}: ${beacon.subtitle}`;
}

// ─── BEACON STATE MANAGEMENT ──────────────────────────────────────────────────

/**
 * Check if a beacon has expired.
 */
export function isBeaconExpired(beacon: BeaconUIObject, now?: number): boolean {
  if (!beacon.expiresAt) return false;
  return (now ?? Date.now()) > beacon.expiresAt;
}

/**
 * Filter active (non-expired, non-dismissed) beacons.
 */
export function getActiveBeacons(beacons: BeaconUIObject[]): BeaconUIObject[] {
  const now = Date.now();
  return beacons.filter(
    (b) => !b.dismissed && !isBeaconExpired(b, now)
  );
}

/**
 * Get the highest-priority active beacon for a specific section.
 */
export function getSectionBeacon(
  beacons: BeaconUIObject[],
  section: PlatformSection
): BeaconUIObject | null {
  const active = getActiveBeacons(beacons).filter(
    (b) => b.section === section
  );
  if (active.length === 0) return null;
  return active.sort((a, b) => b.priority - a.priority)[0];
}

/**
 * Create a navigation suggestion from a beacon.
 * This is the text shown as a system notification.
 */
export function buildSuggestionText(beacon: BeaconUIObject): string {
  const sectionName = SECTION_DISPLAY_NAMES[beacon.section];
  const action = UNLOCK_ACTION_TEXT[beacon.unlockType];

  return `${action} em ${sectionName}: ${beacon.subtitle}`;
}

// ─── HUD SIGNAL CONSTANTS ─────────────────────────────────────────────────────

/**
 * CSS-friendly signal identifiers for each pulse intensity.
 * Maps to design tokens for the HUD component library.
 */
export const PULSE_SIGNAL_CLASSES = {
  subtle: {
    ring: "border-neon-cyan/30",
    glow: "shadow-neon-cyan/10",
    animation: "animate-pulse-slow",
  },
  moderate: {
    ring: "border-neon-cyan/60",
    glow: "shadow-neon-cyan/25",
    animation: "animate-pulse",
  },
  urgent: {
    ring: "border-pulse-purple/80",
    glow: "shadow-pulse-purple/40",
    animation: "animate-pulse-fast",
  },
} as const;
