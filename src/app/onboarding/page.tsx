"use client";

/**
 * Onboarding — Cognitive calibration sequence.
 *
 * Phases:
 *   boot(0s) → calibrate(1.5s) → stabilize(3.5s) → sync(5s) → redirect(7.5s)
 *
 * HUD components animate through their state machines:
 *   ScannerRing:   idle → scanning → complete
 *   SignalBars:    weak → moderate → strong
 *   GridOverlay:   idle → scanning → active → idle
 *   ActionNode:    locked → unlocked (at sync)
 *   ClassificationTags: NEXUS → KAOS → CIPHER → LYRA (progressive reveal)
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScannerRing } from "@/components/hud/ScannerRing";
import { SignalBars } from "@/components/hud/SignalBars";
import { GridOverlay } from "@/components/hud/GridOverlay";
import { ClassificationTag } from "@/components/hud/ClassificationTag";
import { ActionNode } from "@/components/hud/ActionNode";
import { tokens } from "@/design-system/tokens";
import { typography, toStyle } from "@/design-system/typography";
import type {
  ScannerRingState,
  SignalBarsState,
  GridOverlayState,
  ActionNodeState,
} from "@/components/hud/_contracts";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

type Phase = "boot" | "calibrate" | "stabilize" | "sync";

const AGENTS = ["NEXUS", "KAOS", "CIPHER", "LYRA"] as const;

/** Offset from page mount at which each agent tag is revealed. */
const TAG_REVEAL_MS = [1000, 2000, 3500, 5000];

/** Phase advance timings (ms from mount). */
const PHASE_TIMING: Record<Phase, number> = {
  boot: 0,
  calibrate: 1500,
  stabilize: 3500,
  sync: 5000,
};

const REDIRECT_MS = 7500;

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("boot");
  const [revealed, setRevealed] = useState(0);
  const [mounted, setMounted] = useState(false);

  // ── Fade-in on mount ────────────────────────────────────────────────────
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  // ── Timeline orchestrator ────────────────────────────────────────────────
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase advances
    (Object.entries(PHASE_TIMING) as [Phase, number][]).forEach(
      ([p, ms]) => {
        if (ms > 0) {
          timers.push(setTimeout(() => setPhase(p), ms));
        }
      }
    );

    // Progressive tag reveals
    TAG_REVEAL_MS.forEach((ms, i) => {
      timers.push(setTimeout(() => setRevealed(i + 1), ms));
    });

    // Auto-redirect
    timers.push(
      setTimeout(() => {
        router.push("/lab");
      }, REDIRECT_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, [router]);

  // ── Derived component states ─────────────────────────────────────────────

  const scannerState: ScannerRingState =
    phase === "boot"
      ? "idle"
      : phase === "sync"
        ? "complete"
        : "scanning";

  const signalState: SignalBarsState =
    phase === "boot"
      ? "weak"
      : phase === "calibrate"
        ? "moderate"
        : "strong";

  const gridState: GridOverlayState =
    phase === "boot"
      ? "idle"
      : phase === "calibrate"
        ? "scanning"
        : phase === "stabilize"
          ? "active"
          : "idle";

  const actionState: ActionNodeState =
    phase === "sync" ? "unlocked" : "locked";

  // ── Status text ──────────────────────────────────────────────────────────

  const statusLine =
    phase === "sync"
      ? "SINCRONIZAÇÃO COMPLETA"
      : phase !== "boot"
        ? "CALIBRANDO PERFIL COGNITIVO..."
        : "";

  const redirectLine =
    phase === "sync" ? "DIRECIONANDO PARA O LABORATÓRIO" : "";

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: tokens.color.surface.background,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: mounted ? 1 : 0,
        transition: "opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
      }}
    >
      {/* Cinematic vignette — darkens edges, draws focus to center */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: `
            radial-gradient(
              ellipse at center,
              transparent 40%,
              rgba(10, 10, 26, 0.55) 75%,
              rgba(10, 10, 26, 0.85) 100%
            )
          `,
        }}
      />

      {/* Perspective grid */}
      <GridOverlay state={gridState} />

      {/* Content stack */}
      <div
        style={{
          position: "relative",
          zIndex: tokens.zIndex.content,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: tokens.spacing.lg,
          maxWidth: "400px",
          padding: `0 ${tokens.spacing.lg}`,
        }}
      >
        {/* ── Scanner ring (focal point) — uses built-in state labels ──── */}
        <ScannerRing state={scannerState} size={112} />

        {/* ── Status message ────────────────────────────────────────────── */}
        {statusLine && (
          <p
            style={{
              ...toStyle(typography.signal),
              color: tokens.color.text.secondary,
              margin: 0,
              textAlign: "center",
              minHeight: typography.signal.lineHeight,
            }}
          >
            {statusLine}
          </p>
        )}

        {/* ── Signal strength indicator ─────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.sm,
          }}
        >
          <SignalBars state={signalState} />
        </div>

        {/* ── Agent classification tags (progressive reveal) ─────────────── */}
        <div
          style={{
            display: "flex",
            gap: tokens.spacing.xs,
            flexWrap: "wrap",
            justifyContent: "center",
            minHeight: "28px",
          }}
        >
          {AGENTS.slice(0, revealed).map((agent) => (
            <ClassificationTag
              key={agent}
              state="highlighted"
              clearance="deep"
              label={agent}
            />
          ))}
        </div>

        {/* ── Action node — unlocks at sync ─────────────────────────────── */}
        <ActionNode
          state={actionState}
          label="ENTRAR NO LABORATÓRIO"
          onClick={() => router.push("/lab")}
        />

        {/* ── Redirect hint ──────────────────────────────────────────────── */}
        {redirectLine && (
          <p
            style={{
              ...toStyle(typography.restricted),
              color: tokens.color.text.tertiary,
              margin: 0,
              textAlign: "center",
            }}
          >
            {redirectLine}
          </p>
        )}
      </div>

      {/* Keyframe definitions (isolated scope via style jsx) */}
      <style>{`
        @keyframes onboarding-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
