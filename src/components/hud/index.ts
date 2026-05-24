/**
 * ─── HUD COMPONENT LIBRARY — Barrel Export ────────────────────────────────────
 *
 * Phase 2 Design System Foundation: 6 cinematic HUD components.
 *
 * Phase 1 Integration:
 *   These components consume data from `useNavigationStore` (Zustand store
 *   delivered in Phase 1). The mapping is as follows:
 *
 *   PulseBeacon:
 *     Reads: useNavigationStore().beacons (BeaconUIObject[])
 *     Maps:  beacon.priority → PulseBeaconState via priorityToPulseBeaconState()
 *            beacon.section → label (SECTION_DISPLAY_NAMES)
 *            beacon.subtitle → subtitle (reason text)
 *            beacon.route → onNavigate (router.push + pushHandoff)
 *
 *   ScannerRing:
 *     Reads: useNavigationStore().labState (LabStateContext)
 *     Maps:  labState.state → ScannerRingState
 *            idle      → "idle"
 *            scanning  → "scanning"
 *            processing → "scanning" (same visual)
 *            synthesis → "scanning" (same visual, accelerated)
 *            complete  → "complete"
 *            error     → "error"
 *
 *   SignalBars:
 *     Reads: useNavigationStore().beacons (for highest priority)
 *     Maps:  0.0-0.4 → "weak", 0.4-0.6 → "moderate",
 *            0.6-0.8 → "strong", 0.8+ → "urgent"
 *     Also reads: labState to show pipeline signal strength
 *
 *   ActionNode:
 *     Reads: useNavigationStore().mission.unlockedNodes
 *     Maps:  node.visitedAt === null → "unlocked"
 *            node === mission.currentNode → "active"
 *            node.completedAt !== null → "completed"
 *
 *   ClassificationTag:
 *     Reads: useNavigationStore().mission.currentLayer
 *     Maps:  layer 0 → clearance "surface"
 *            layer 1-2 → clearance "deep"
 *            layer 3 → clearance "core"
 *
 *   GridOverlay:
 *     Reads: useNavigationStore().labState.state
 *     Maps:  idle → "idle", scanning/processing → "scanning",
 *            synthesis → "active", complete → "idle", error → "idle"
 *
 * Usage:
 *   import { PulseBeacon, ScannerRing, SignalBars, ActionNode,
 *            ClassificationTag, GridOverlay } from "@/components/hud";
 */

export { ScannerRing } from "./ScannerRing";
export { ActionNode } from "./ActionNode";
export { ClassificationTag } from "./ClassificationTag";
export { GridOverlay } from "./GridOverlay";
export { SignalBars } from "./SignalBars";
export { PulseBeacon, priorityToPulseBeaconState } from "./PulseBeacon";

// Re-export contracts for consumers that need direct access
export {
  ScannerRingState,
  ActionNodeState,
  ClassificationTagState,
  GridOverlayState,
  SignalBarsState,
  PulseBeaconState,
  SCANNER_RING_COLORS,
  SCANNER_RING_LABELS,
  ACTION_NODE_COLORS,
  SIGNAL_BARS_COLORS,
  SIGNAL_BARS_FILLED,
  SIGNAL_BARS_LABELS,
  PULSE_BEACON_COLORS,
  PULSE_BEACON_PREFIXES,
  CLASSIFICATION_TAG_CLEARANCE_LABELS,
} from "./_contracts";
