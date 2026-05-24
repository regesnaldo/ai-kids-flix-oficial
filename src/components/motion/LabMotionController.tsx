"use client";

/**
 * LabMotionController — Phase 4 motion orchestrator for the LAB page.
 *
 * Consumes Phase 1 (useNavigationStore) + Phase 3 (useLabInterface)
 * and wires Phase 4 motion components as an overlay layer.
 *
 * Trigger wiring:
 *   labState === 'scanning' || 'processing'  → <DeepScan />
 *   labState === 'complete' && beacons > 0   → <SignalAcquisition />
 *   handoffPayload !== null                   → <QuantumLeap />
 *   newHintWhileAway (beacon count increased) → <EchoPulse />
 *   revisitingNode (mission.lastDiscovery)    → <MemoryEcho />
 *
 * Creates ZERO new state. Pure mapping layer.
 * Mounts as overlay — does not modify HUD, chat, or page structure.
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useNavigationStore } from "@/store/useNavigationStore";
import { useLabInterface } from "@/components/lab/useLabInterface";
import { getActiveBeacons, SECTION_DISPLAY_NAMES } from "@/lib/navigation-hints";
import { prefersReducedMotion } from "@/design-system/motion";
import {
  checkPerformanceGate,
  COGNITIVE_PRIORITY,
} from "./_motionContracts";
import type { CognitiveEvent } from "./_motionContracts";

// ─── Motion components ─────────────────────────────────────────────────────
import { QuantumLeap } from "./QuantumLeap";
import { DeepScan } from "./DeepScan";
import { SignalAcquisition } from "./SignalAcquisition";
import { EchoPulse } from "./EchoPulse";
import { MemoryEcho } from "./MemoryEcho";

// ═══════════════════════════════════════════════════════════════════════════════
// MOTION QUEUE ITEM
// ═══════════════════════════════════════════════════════════════════════════════

interface MotionQueueItem {
  event: CognitiveEvent;
  priority: number;
  key: string;
  startedAt: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STABLE KEY COMPARISON (prevents infinite re-render loop)
// ═══════════════════════════════════════════════════════════════════════════════

/** Returns true if two arrays of motion keys are identical (same set, same order) */
function keysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DERIVED SIGNALS (no new store state)
// ═══════════════════════════════════════════════════════════════════════════════

function useDerivedSignals() {
  const handoffPayload = useNavigationStore((s) => s.handoffPayload);
  const beacons = useNavigationStore((s) => s.beacons);
  const mission = useNavigationStore((s) => s.mission);

  const { currentState, statusText } = useLabInterface();

  // Track beacon count to detect "new hints while away"
  const prevBeaconCount = useRef(beacons.length);
  const [newHintWhileAway, setNewHintWhileAway] = useState(false);

  useEffect(() => {
    if (beacons.length > prevBeaconCount.current && prevBeaconCount.current > 0) {
      setNewHintWhileAway(true);
      const timer = setTimeout(() => setNewHintWhileAway(false), 5000);
      prevBeaconCount.current = beacons.length;
      return () => clearTimeout(timer);
    }
    prevBeaconCount.current = beacons.length;
  }, [beacons.length]);

  // Derive all primitives here so the controller gets stable deps
  const handoffPending = handoffPayload !== null;
  const isScanningOrProcessing =
    currentState === "scanning" || currentState === "processing";
  const activeBeacons = getActiveBeacons(beacons);
  const isCompleteWithBeacons =
    currentState === "complete" && activeBeacons.length > 0;
  const revisitingNode = mission?.lastDiscovery !== null && !!mission?.lastDiscovery;
  const topBeacon = activeBeacons.length > 0 ? activeBeacons[0] : null;

  return {
    handoffPending,
    isScanningOrProcessing,
    isCompleteWithBeacons,
    newHintWhileAway,
    revisitingNode,
    statusText,
    destination: handoffPayload?.destination
      ? SECTION_DISPLAY_NAMES[handoffPayload.destination]
      : undefined,
    topBeaconLabel: topBeacon?.label,
    discoveryTag: mission?.lastDiscovery?.tag ?? undefined,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANDIDATE BUILDER (called inside useEffect with stable deps)
// ═══════════════════════════════════════════════════════════════════════════════

function buildCandidateKeys(signals: ReturnType<typeof useDerivedSignals>): string[] {
  const keys: string[] = [];

  if (signals.handoffPending) keys.push("quantum-leap");
  if (signals.isScanningOrProcessing) keys.push("deep-scan");
  if (signals.isCompleteWithBeacons) keys.push("signal-acquisition");
  if (signals.newHintWhileAway) keys.push("echo-pulse");
  if (signals.revisitingNode) keys.push("memory-echo");

  return keys;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════════

export function LabMotionController() {
  const router = useRouter();
  const signals = useDerivedSignals();
  const reduced = prefersReducedMotion();

  const [activeMotions, setActiveMotions] = useState<MotionQueueItem[]>([]);
  const activeCountRef = useRef(0);

  // Track last scheduled keys to avoid redundant setState
  const lastKeysRef = useRef<string[]>([]);

  // Extract stable primitive dependencies from signals
  const {
    handoffPending,
    isScanningOrProcessing,
    isCompleteWithBeacons,
    newHintWhileAway,
    revisitingNode,
  } = signals;

  // ─── Schedule motions respecting performance rules ──────────────────────
  // Dependencies are PRIMITIVE booleans — stable between renders
  // when the underlying store values haven't changed.

  useEffect(() => {
    try {
      const candidateKeys = buildCandidateKeys(signals);

      if (candidateKeys.length === 0) {
        // Only clear if we actually have motions to clear
        if (lastKeysRef.current.length > 0) {
          setActiveMotions([]);
          activeCountRef.current = 0;
          lastKeysRef.current = [];
        }
        return;
      }

      // GUARD: skip setState if candidates haven't changed
      if (keysEqual(candidateKeys, lastKeysRef.current)) {
        return;
      }

      // Sort by priority (highest first)
      const keyPriority: Record<string, number> = {
        "quantum-leap": COGNITIVE_PRIORITY.cross_section_handoff_initiated,
        "deep-scan": COGNITIVE_PRIORITY.lab_scanning_or_processing,
        "signal-acquisition": COGNITIVE_PRIORITY.discovery_moment,
        "echo-pulse": COGNITIVE_PRIORITY.new_hint_while_away,
        "memory-echo": COGNITIVE_PRIORITY.revisiting_unlocked_node,
      };

      const sorted = [...candidateKeys].sort(
        (a, b) => (keyPriority[b] ?? 0) - (keyPriority[a] ?? 0)
      );
      const gate = checkPerformanceGate(activeCountRef.current, reduced);

      if (gate && activeCountRef.current > 0) {
        return;
      }

      const allowed = sorted.slice(0, 2); // max 2 simultaneous

      // Build MotionQueueItem array from allowed keys
      const items: MotionQueueItem[] = allowed.map((key) => {
        const eventMap: Record<string, CognitiveEvent> = {
          "quantum-leap": "cross_section_handoff_initiated",
          "deep-scan": "lab_scanning_or_processing",
          "signal-acquisition": "discovery_moment",
          "echo-pulse": "new_hint_while_away",
          "memory-echo": "revisiting_unlocked_node",
        };
        return {
          event: eventMap[key] ?? "revisiting_unlocked_node",
          priority: keyPriority[key] ?? 1,
          key,
          startedAt: Date.now(),
        };
      });

      lastKeysRef.current = allowed;
      setActiveMotions(items);
      activeCountRef.current = items.length;
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("LabMotionController scheduling error:", err);
      }
    }
  }, [
    handoffPending,
    isScanningOrProcessing,
    isCompleteWithBeacons,
    newHintWhileAway,
    revisitingNode,
    reduced,
    signals,
  ]);

  // ─── Completion handler ─────────────────────────────────────────────────

  const handleMotionComplete = useCallback(
    (key: string) => {
      setActiveMotions((prev) => {
        const next = prev.filter((m) => m.key !== key);
        activeCountRef.current = next.length;
        lastKeysRef.current = next.map((m) => m.key);
        return next;
      });
    },
    []
  );

  // ─── Handoff navigation ─────────────────────────────────────────────────

  const handleLeapComplete = useCallback(() => {
    const consumed = useNavigationStore.getState().consumeHandoff();
    handleMotionComplete("quantum-leap");

    if (consumed?.destination) {
      try {
        const route = `/${consumed.destination}`;
        router.push(route);
      } catch {
        // Navigation failed, handoff already consumed
      }
    }
  }, [router, handleMotionComplete]);

  // ─── Echo dismiss ───────────────────────────────────────────────────────

  const handleEchoDismiss = useCallback(() => {
    handleMotionComplete("echo-pulse");
  }, [handleMotionComplete]);

  // ─── Derive active motion keys for rendering ────────────────────────────

  const motionKeys = new Set(activeMotions.map((m) => m.key));

  return (
    <div
      data-testid="lab-motion-controller"
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    >
      {/* QuantumLeap — handoff initiated */}
      {motionKeys.has("quantum-leap") && (
        <div style={{ pointerEvents: "auto" }}>
          <QuantumLeap
            triggerState={signals.handoffPending}
            destination={signals.destination}
            onComplete={handleLeapComplete}
          />
        </div>
      )}

      {/* DeepScan — scanning / processing */}
      {motionKeys.has("deep-scan") && (
        <DeepScan
          triggerState={signals.isScanningOrProcessing}
          statusLabel={signals.statusText}
          onComplete={() => handleMotionComplete("deep-scan")}
        />
      )}

      {/* SignalAcquisition — discovery moment */}
      {motionKeys.has("signal-acquisition") && (
        <SignalAcquisition
          triggerState={signals.isCompleteWithBeacons}
          shape="hexagon"
          label={signals.topBeaconLabel}
          onComplete={() => handleMotionComplete("signal-acquisition")}
        />
      )}

      {/* EchoPulse — new hint while away */}
      {motionKeys.has("echo-pulse") && (
        <div style={{ pointerEvents: "auto" }}>
          <EchoPulse
            triggerState={signals.newHintWhileAway}
            message={signals.topBeaconLabel}
            onDismiss={handleEchoDismiss}
            onComplete={() => handleMotionComplete("echo-pulse")}
          />
        </div>
      )}

      {/* MemoryEcho — revisiting node */}
      {motionKeys.has("memory-echo") && (
        <MemoryEcho
          triggerState={signals.revisitingNode}
          discoveryTag={signals.discoveryTag}
          onComplete={() => handleMotionComplete("memory-echo")}
        />
      )}
    </div>
  );
}
