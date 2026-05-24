"use client";

/**
 * HudMotionWrapper — Phase 2 HUD component entry/exit motion layers.
 *
 * Wraps each HUD component without modifying its internals.
 * Every animation reads from motion.ts tokens.
 *
 * Animation map:
 *   ScannerRing      — rotate-in on mount, pulse on state change
 *   ActionNode       — scale-in when unlocked, lock-shake on denied activation
 *   ClassificationTag — slide-in from edge when highlighted
 *   SignalBars       — staggered height animation on state change
 *   PulseBeacon      — rhythmic pulse intensity mapped to priority
 *   GridOverlay      — perspective shift on active state
 */

import React, { useEffect, useRef, useState, type ReactElement } from "react";
import { motion, prefersReducedMotion } from "@/design-system/motion";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type HudComponentName =
  | "ScannerRing"
  | "ActionNode"
  | "ClassificationTag"
  | "SignalBars"
  | "PulseBeacon"
  | "GridOverlay";

interface HudMotionWrapperProps {
  /** Which HUD component is being wrapped */
  component: HudComponentName;
  /** The child component to wrap */
  children: ReactElement;
  /** Current state value (passed through from parent) */
  state?: string;
  /** Previous state value (for transition detection) */
  previousState?: string | null;
  /** Additional class for the wrapper */
  className?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION CONFIG PER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface AnimationConfig {
  /** Mount animation keyframes descriptor */
  mountKeyframes: Keyframe[];
  /** Mount animation timing */
  mountTiming: KeyframeAnimationOptions;
  /** State change animation */
  stateChange?: (from: string | undefined, to: string | undefined) => {
    keyframes: Keyframe[];
    timing: KeyframeAnimationOptions;
  } | null;
}

function getConfig(
  component: HudComponentName,
  reduced: boolean
): AnimationConfig {
  const instantDuration = reduced ? 0 : parseInt(motion.duration.scan) / 4; // ~200ms
  const shortDuration = reduced ? 0 : parseInt(motion.duration.echo);
  const mediumMs = reduced ? 0 : parseInt(motion.duration.scan);

  switch (component) {
    case "ScannerRing":
      return {
        mountKeyframes: [
          { transform: "rotate(-90deg) scale(0.5)", opacity: "0" },
          { transform: "rotate(0deg) scale(1)", opacity: "1" },
        ],
        mountTiming: {
          duration: reduced ? 0 : 400,
          easing: motion.easing.synthesis,
          fill: "forwards",
        },
        stateChange: (_from, to) => {
          if (!to || to === "idle") return null;
          return {
            keyframes: [
              { transform: "scale(1)", filter: "brightness(1)" },
              { transform: "scale(1.05)", filter: "brightness(1.3)" },
              { transform: "scale(1)", filter: "brightness(1)" },
            ],
            timing: {
              duration: shortDuration,
              easing: motion.easing.pulse,
              fill: "forwards",
            },
          };
        },
      };

    case "ActionNode":
      return {
        mountKeyframes: [
          { transform: "scale(0.8)", opacity: "0.4" },
          { transform: "scale(1)", opacity: "1" },
        ],
        mountTiming: {
          duration: reduced ? 0 : 300,
          easing: motion.easing.leap,
          fill: "forwards",
        },
        stateChange: (from, to) => {
          // Lock-shake: when denied activation (trying locked -> active, blocked by contracts)
          if (to === "locked" || (from === "unlocked" && to === "locked")) {
            return {
              keyframes: [
                { transform: "translateX(0)" },
                { transform: "translateX(-3px)" },
                { transform: "translateX(3px)" },
                { transform: "translateX(-2px)" },
                { transform: "translateX(0)" },
              ],
              timing: {
                duration: shortDuration,
                easing: motion.easing.instant === "step-end" ? "linear" : motion.easing.echo,
                fill: "forwards",
              },
            };
          }
          // Scale-in when unlocked
          if (to === "unlocked" || to === "active") {
            return {
              keyframes: [
                { transform: "scale(0.9)", opacity: "0.5" },
                { transform: "scale(1.05)", opacity: "1" },
                { transform: "scale(1)", opacity: "1" },
              ],
              timing: {
                duration: instantDuration + 100,
                easing: motion.easing.leap,
                fill: "forwards",
              },
            };
          }
          return null;
        },
      };

    case "ClassificationTag":
      return {
        mountKeyframes: [
          { transform: "translateX(-16px)", opacity: "0" },
          { transform: "translateX(0)", opacity: "1" },
        ],
        mountTiming: {
          duration: reduced ? 0 : 300,
          easing: motion.easing.echo,
          fill: "forwards",
        },
        stateChange: (_from, to) => {
          // Slide-in from edge when highlighted, dim when not
          if (to === "highlighted") {
            return {
              keyframes: [
                { transform: "translateX(-8px) scale(0.95)", opacity: "0.6" },
                { transform: "translateX(0) scale(1.02)", opacity: "1" },
                { transform: "translateX(0) scale(1)", opacity: "1" },
              ],
              timing: {
                duration: shortDuration,
                easing: motion.easing.leap,
                fill: "forwards",
              },
            };
          }
          return null;
        },
      };

    case "SignalBars":
      return {
        mountKeyframes: [
          { transform: "scaleY(0)", opacity: "0" },
          ...Array.from({ length: 3 }, (_, i) => ({
            transform: `scaleY(${0.3 + i * 0.35})`,
            opacity: `${0.3 + i * 0.35}`,
          })),
          { transform: "scaleY(1)", opacity: "1" },
        ],
        mountTiming: {
          duration: reduced ? 0 : 500,
          easing: motion.easing.scan,
          fill: "forwards",
        },
        stateChange: (_from, to) => {
          if (!to || to === "lost") return null;
          return {
            keyframes: [
              { transform: "scaleY(0.8)", filter: "brightness(0.8)" },
              { transform: "scaleY(1.1)", filter: "brightness(1.3)" },
              { transform: "scaleY(1)", filter: "brightness(1)" },
            ],
            timing: {
              duration: shortDuration,
              easing: motion.easing.pulse,
              fill: "forwards",
            },
          };
        },
      };

    case "PulseBeacon":
      return {
        mountKeyframes: [
          { transform: "scale(0.6)", opacity: "0" },
          { transform: "scale(1.1)", opacity: "0.7" },
          { transform: "scale(1)", opacity: "1" },
        ],
        mountTiming: {
          duration: reduced ? 0 : mediumMs / 2,
          easing: motion.easing.pulse,
          fill: "forwards",
        },
        stateChange: (from, to) => {
          // Pulse intensity mapped directly to animation-duration
          if (!from || !to || from === to) return null;
          return {
            keyframes: [
              { transform: "scale(1)", boxShadow: "0 0 0px transparent" },
              { transform: "scale(1.04)", boxShadow: "0 0 8px currentColor" },
              { transform: "scale(1)", boxShadow: "0 0 0px transparent" },
            ],
            timing: {
              duration: reduced ? 0 : parseInt(motion.duration.pulse) / 2,
              easing: motion.easing.pulse,
              fill: "forwards",
              iterations: 1,
            },
          };
        },
      };

    case "GridOverlay":
      return {
        mountKeyframes: [
          { transform: "perspective(800px) rotateX(70deg)", opacity: "0" },
          { transform: "perspective(800px) rotateX(60deg)", opacity: "1" },
        ],
        mountTiming: {
          duration: reduced ? 0 : 1000,
          easing: motion.easing.synthesis,
          fill: "forwards",
        },
        stateChange: (_from, to) => {
          // Perspective shift on active state
          if (to === "active" || to === "scanning") {
            return {
              keyframes: [
                { transform: "perspective(800px) rotateX(65deg)" },
                { transform: "perspective(800px) rotateX(55deg)" },
                { transform: "perspective(800px) rotateX(60deg)" },
              ],
              timing: {
                duration: reduced ? 0 : motion.stagger.gridPerspective,
                easing: motion.easing.synthesis,
                fill: "forwards",
              },
            };
          }
          return null;
        },
      };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// WRAPPER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function HudMotionWrapper(props: HudMotionWrapperProps) {
  const { component, children, state, previousState, className = "" } = props;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const reduced = prefersReducedMotion();
  const config = getConfig(component, reduced);

  // Mount animation
  useEffect(() => {
    if (!wrapperRef.current) return;
    setMounted(true);

    if (reduced) return;

    const anim = wrapperRef.current.animate(
      config.mountKeyframes,
      config.mountTiming
    );
    return () => anim.cancel();
  }, [component, reduced]);

  // State change animation
  useEffect(() => {
    if (!wrapperRef.current || !mounted || !config.stateChange) return;
    if (previousState === undefined) return; // First render, mount handles it

    const changeAnim = config.stateChange(previousState ?? undefined, state);
    if (!changeAnim) return;

    const anim = wrapperRef.current.animate(
      changeAnim.keyframes,
      changeAnim.timing
    );
    return () => anim.cancel();
  }, [state, previousState, mounted, config, reduced]);

  return (
    <div
      ref={wrapperRef}
      className={`hud-motion-wrapper hud-motion-wrapper--${component.toLowerCase()} ${className}`}
      data-component={component}
      data-state={state}
      data-testid={`hud-motion-wrapper-${component.toLowerCase()}`}
      style={{
        display: "inline-flex",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONVENIENCE WRAPPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Convenience wrapper for ScannerRing.
 * Adds rotate-in mount + pulse on state change.
 */
export function ScannerRingMotion(props: {
  children: ReactElement;
  state?: string;
  previousState?: string | null;
}) {
  return <HudMotionWrapper component="ScannerRing" {...props} />;
}

/**
 * Convenience wrapper for ActionNode.
 * Adds scale-in unlock + lock-shake.
 */
export function ActionNodeMotion(props: {
  children: ReactElement;
  state?: string;
  previousState?: string | null;
}) {
  return <HudMotionWrapper component="ActionNode" {...props} />;
}

/**
 * Convenience wrapper for ClassificationTag.
 * Adds slide-in from edge when highlighted.
 */
export function ClassificationTagMotion(props: {
  children: ReactElement;
  state?: string;
  previousState?: string | null;
}) {
  return <HudMotionWrapper component="ClassificationTag" {...props} />;
}

/**
 * Convenience wrapper for SignalBars.
 * Adds staggered height animation on state change.
 */
export function SignalBarsMotion(props: {
  children: ReactElement;
  state?: string;
  previousState?: string | null;
}) {
  return <HudMotionWrapper component="SignalBars" {...props} />;
}

/**
 * Convenience wrapper for PulseBeacon.
 * Adds rhythmic pulse mapped to priority.
 */
export function PulseBeaconMotion(props: {
  children: ReactElement;
  state?: string;
  previousState?: string | null;
}) {
  return <HudMotionWrapper component="PulseBeacon" {...props} />;
}

/**
 * Convenience wrapper for GridOverlay.
 * Adds perspective shift on active state.
 */
export function GridOverlayMotion(props: {
  children: ReactElement;
  state?: string;
  previousState?: string | null;
}) {
  return <HudMotionWrapper component="GridOverlay" {...props} />;
}
