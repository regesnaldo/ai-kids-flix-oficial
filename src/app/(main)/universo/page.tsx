"use client";

/**
 * Universo — Mapa Galactico com Planetas Dinamicos
 *
 * Cada planeta le do planet-registry (dados) e progression-engine (estado).
 * Click ativa o planeta e dispara a assinatura de audio.
 * NEXUS centrado. Orbitas concentricas. 12 circulos perfeitos.
 */

import { useMemo, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  planetRegistry,
  ALL_PLANET_IDS,
  type PlanetId,
  type PlanetState,
} from "@/lib/universe/planet-registry";
import {
  calculatePlanetState,
  normalizeProgression,
  type PlayerProgression,
} from "@/lib/universe/progression-engine";
import { audioManager } from "@/lib/universe/audio-manager";
import { MissionOrbit } from "@/components/universe/MissionOrbit";
import { UniverseHUD } from "@/components/universe/UniverseHUD";
import { tokens } from "@/design-system/tokens";
import { typography, toStyle } from "@/design-system/typography";
import { useOasis } from "@/providers/OasisProvider";

// ─── ORBITAL LAYOUT ───────────────────────────────────────────────────────────

/** Orbital positions: radius in px + rotation angle in degrees */
const ORBIT_CONFIG: Record<PlanetId, { radius: number; angle: number }> = {
  nexus:   { radius: 0,    angle: 0 },
  volt:    { radius: 360,  angle: 0 },
  aurora:  { radius: 520,  angle: 0 },
  ethos:   { radius: 680,  angle: 15 },
  kaos:    { radius: 820,  angle: 45 },
  cipher:  { radius: 960,  angle: 90 },
  lyra:    { radius: 1100, angle: 135 },
  axiom:   { radius: 1220, angle: 180 },
  stratos: { radius: 1340, angle: 225 },
  terra:   { radius: 1460, angle: 270 },
  prism:   { radius: 1580, angle: 315 },
  janus:   { radius: 1700, angle: 30 },
};

// ─── STARFIELD ────────────────────────────────────────────────────────────────

type StarData = {
  left: string; top: string; size: string;
  color: string; opacity: number; twinkle: boolean;
};

function createStars(): StarData[] {
  return Array.from({ length: 120 }, () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: `${Math.random() > 0.7 ? 3 : Math.random() > 0.5 ? 2 : 1}px`,
    color: Math.random() > 0.5 ? "#ffffff" : "#00f5ff",
    opacity: Number((Math.random() * 0.6 + 0.3).toFixed(2)),
    twinkle: Math.random() < 0.3,
  }));
}

// ─── STATE LABELS ─────────────────────────────────────────────────────────────

const STATE_LABEL: Record<PlanetState, string> = {
  undiscovered: "",
  available: "SINAL DETECTADO",
  active: "MISSÃO EM ANDAMENTO",
  completed: "DOMINADO",
};

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function UniversoPage() {
  const router = useRouter();
  const { progressionSnapshot, currentScene, healthStatus, triggerTransition } = useOasis();
  const [hoveredPlanet, setHoveredPlanet] = useState<PlanetId | null>(null);
  const [enteringId, setEnteringId] = useState<PlanetId | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [viewport, setViewport] = useState({ w: 1920, h: 1080 });

  // Track viewport for SVG coordinate calculations
  useEffect(() => {
    const update = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Mark mounted for hydration-safe star generation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Build progression from oasis snapshot (SSE-driven, no polling)
  const progression: PlayerProgression = useMemo(
    () =>
      normalizeProgression({
        completed: progressionSnapshot.completed as PlanetId[],
        activePlanet: progressionSnapshot.activePlanet as PlanetId | null,
        available: progressionSnapshot.available as PlanetId[],
        totalCompleted: progressionSnapshot.totalCompleted,
      }),
    [progressionSnapshot]
  );

  const stars = useMemo(() => (mounted ? createStars() : []), [mounted]);

  // Planet state calculator (pure, derived from progression)
  const getState = useCallback(
    (id: PlanetId): PlanetState => {
      return calculatePlanetState(id, progression);
    },
    [progression]
  );

  // ── SVG positions (viewport-relative, mathematically calculated) ──
  const orbitPositions = useMemo(() => {
    const cx = viewport.w / 2;
    const cy = viewport.h / 2;
    const pos: Record<PlanetId, { x: number; y: number }> = {} as any;

    for (const id of ALL_PLANET_IDS) {
      const cfg = ORBIT_CONFIG[id];
      const rad = (cfg.angle * Math.PI) / 180;
      pos[id] = {
        x: cx + Math.cos(rad) * cfg.radius,
        y: cy + Math.sin(rad) * cfg.radius,
      };
    }
    return pos;
  }, [viewport]);

  // ── SVG connections (NEXUS → available/active, completed → unlocked) ──
  const orbitConnections = useMemo(() => {
    const conns: { from: PlanetId; to: PlanetId }[] = [];
    const added = new Set<string>();

    const add = (a: PlanetId, b: PlanetId) => {
      const key = [a, b].sort().join("|");
      if (!added.has(key)) {
        added.add(key);
        conns.push({ from: a, to: b });
      }
    };

    for (const id of ALL_PLANET_IDS) {
      const state = calculatePlanetState(id, progression);
      // NEXUS connects to available/active/completed planets
      if (state === "available" || state === "active" || state === "completed") {
        add("nexus", id);
      }
      // Completed planet connects to its unlocked children
      if (state === "completed") {
        for (const child of planetRegistry[id].unlocks) {
          add(id, child);
        }
      }
    }

    return conns;
  }, [progression]);

  // Handle planet click
  const handlePlanetClick = useCallback(
    async (planetId: PlanetId) => {
      const state = getState(planetId);
      if (state === "undiscovered") return;

      // Init audio on first interaction
      if (!audioManager.isAvailable()) {
        await audioManager.init();
      }

      // Activate planet via API (server-side DB call)
      if (state === "available") {
        try {
          const res = await fetch("/api/universe/progression", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "activate", planetId }),
          });
          const result = await res.json();
          if (result.success) {
            audioManager.playSignature(planetId);
            triggerTransition(planetId as any, "warp");
          }
        } catch {
          console.error("Falha ao ativar planeta via API");
          // TODO: [MENTE.AI] adicionar feedback visual ao usuário
        }
      } else if (state === "active") {
        audioManager.playSignature(planetId);
      }

      // Navigate to lab
      setEnteringId(planetId);
      setFlashActive(true);
      window.setTimeout(() => {
        router.push(`/universo/${planetId}/lab`);
      }, 600);
      window.setTimeout(() => setFlashActive(false), 620);
    },
    [getState]
  );

  return (
    <div style={styles.galacticMap}>
      {/* Stars */}
      {stars.map((star, i) => (
        <span
          key={i}
          className={star.twinkle ? "star-twinkle" : ""}
          style={{
            position: "absolute",
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            opacity: star.opacity,
            borderRadius: "50%",
          }}
        />
      ))}

      {/* Header */}
      <div style={styles.headerLabel}>
        NEXUS PRIME // MAPA GALACTICO // {progression.totalCompleted}/12 MUNDOS ATIVOS
      </div>
      <button
        style={styles.backButton}
        type="button"
        onClick={() => router.push("/home")}
      >
        ← TORRE CENTRAL
      </button>

      {/* ── Solar System ── */}
      <div style={styles.solarSystem}>

        {/* ── MissionOrbit: SVG connection lines ── */}
        <MissionOrbit
          connections={orbitConnections}
          progression={progression}
          positions={orbitPositions}
          width={viewport.w}
          height={viewport.h}
        />

        {/* ── Orbital rings ── */}
        {ALL_PLANET_IDS.filter((id) => id !== "nexus").map((id) => {
          const config = ORBIT_CONFIG[id];
          const state = getState(id);
          const isDiscovered = state !== "undiscovered";
          return (
            <div
              key={`orbit-${id}`}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: config.radius * 2,
                height: config.radius * 2,
                borderRadius: "50%",
                border: "1px dashed",
                borderColor: isDiscovered
                  ? "rgba(0, 245, 255, 0.12)"
                  : "rgba(255, 255, 255, 0.04)",
                pointerEvents: "none",
              }}
            />
          );
        })}

        {/* ── NEXUS (center) ── */}
        <PlanetOrb
          planetId="nexus"
          state={getState("nexus")}
          isHovered={hoveredPlanet === "nexus"}
          onHover={setHoveredPlanet}
          onClick={handlePlanetClick}
          isCenter
        />

        {/* ── Orbiting planets ── */}
        {ALL_PLANET_IDS.filter((id) => id !== "nexus").map((id) => {
          const config = ORBIT_CONFIG[id];
          const state = getState(id);
          return (
            <PlanetOrb
              key={id}
              planetId={id}
              state={state}
              radius={config.radius}
              angle={config.angle}
              isHovered={hoveredPlanet === id}
              onHover={setHoveredPlanet}
              onClick={handlePlanetClick}
            />
          );
        })}

      </div>

      {/* Flash overlay on planet entry */}
      {flashActive && <div style={styles.flashOverlay} />}

      {/* ── UniverseHUD: sistema operacional overlay ── */}
      <UniverseHUD progression={progression} />

      {/* Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes twinkleStar {
          from { opacity: 0.35; transform: scale(1); }
          to { opacity: 0.95; transform: scale(1.2); }
        }
        .star-twinkle { animation: twinkleStar 3s ease-in-out infinite alternate; }
        @keyframes sunPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes planetPulse {
          0%, 100% { box-shadow: var(--glow-color); }
          50% { box-shadow: var(--glow-color-strong); }
        }
      ` }} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PLANET ORB — Sub-componente
// ═══════════════════════════════════════════════════════════════════════════════

function PlanetOrb({
  planetId,
  state,
  radius = 0,
  angle = 0,
  isHovered,
  onHover,
  onClick,
  isCenter = false,
}: {
  planetId: PlanetId;
  state: PlanetState;
  radius?: number;
  angle?: number;
  isHovered: boolean;
  onHover: (id: PlanetId | null) => void;
  onClick: (id: PlanetId) => void;
  isCenter?: boolean;
}) {
  const planet = planetRegistry[planetId];
  const isInteractive = state !== "undiscovered";

  // ── Visual properties ──────────────────────────────────────────────

  const orbSize = isCenter ? 80 : state === "undiscovered" ? 40 : 52;

  const orbBackground = isCenter
    ? "radial-gradient(circle at 40% 40%, #6ee7ff, #00f5ff, #0088cc)"
    : state === "undiscovered"
      ? "radial-gradient(circle, #1a1a2e, #000)"
      : `radial-gradient(circle at 35% 35%, ${planet.color}88, ${planet.color}, #000)`;

  const orbBorderColor = isCenter
    ? "#00f5ff"
    : state === "undiscovered"
      ? "rgba(255,255,255,0.08)"
      : planet.color;

  const glowIntensity: Record<PlanetState, string> = {
    undiscovered: "none",
    available: `0 0 8px ${planet.color}40`,
    active: `0 0 20px ${planet.color}, 0 0 40px ${planet.color}60`,
    completed: "0 0 14px rgba(245, 158, 11, 0.60)",
  };

  const glowStrong: Record<PlanetState, string> = {
    undiscovered: "none",
    available: `0 0 14px ${planet.color}60`,
    active: `0 0 30px ${planet.color}, 0 0 60px ${planet.color}80`,
    completed: "0 0 22px rgba(245, 158, 11, 0.85)",
  };

  const opacity = state === "undiscovered" ? 0.35 : 1;

  const nameColor = isCenter
    ? "#ffffff"
    : state === "undiscovered"
      ? "#555"
      : planet.color;

  // ── Positioning ────────────────────────────────────────────────────

  // Center
  if (isCenter) {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
          cursor: isInteractive ? "pointer" : "default",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity,
          transition: "opacity 500ms",
        }}
        onClick={() => isInteractive && onClick(planetId)}
        onMouseEnter={() => onHover(planetId)}
        onMouseLeave={() => onHover(null)}
        data-planet={planetId}
        data-state={state}
      >
        {/* Sun core */}
        <div
          style={{
            width: orbSize,
            height: orbSize,
            borderRadius: "50%",
            background: orbBackground,
            boxShadow: `0 0 30px #00f5ff, 0 0 60px rgba(0,245,255,0.5), 0 0 100px rgba(0,245,255,0.2)`,
            animation: "sunPulse 3s ease-in-out infinite",
            transition: "transform 300ms ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        />
        {/* Glow ring */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,245,255,0.15), transparent 70%)",
            animation: "sunPulse 3s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <span style={{ ...nameStyle, color: nameColor, fontSize: 14 }}>
          {planet.name}
        </span>

        {isHovered && (
          <div style={tooltipStyle}>ENTRAR NO NUCLEO</div>
        )}
        {state === "active" && (
          <span style={stateTagStyle}>
            {STATE_LABEL[state]}
          </span>
        )}
      </div>
    );
  }

  // ── Orbiting planet ────────────────────────────────────────────────

  // Calculate position on the orbit
  const angleRad = (angle * Math.PI) / 180;
  const x = Math.cos(angleRad) * radius;
  const y = Math.sin(angleRad) * radius;

  return (
    <div
      style={{
        position: "absolute",
        top: `calc(50% + ${y}px)`,
        left: `calc(50% + ${x}px)`,
        transform: "translate(-50%, -50%)",
        cursor: isInteractive ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity,
        transition: "opacity 500ms, filter 500ms",
        filter: isHovered && isInteractive ? "brightness(1.2)" : "none",
        zIndex: isHovered ? 10 : 2,
      }}
      onClick={() => isInteractive && onClick(planetId)}
      onMouseEnter={() => onHover(planetId)}
      onMouseLeave={() => onHover(null)}
      data-planet={planetId}
      data-state={state}
    >
      {/* Planet circle */}
      <div
        style={{
          width: orbSize,
          height: orbSize,
          borderRadius: "50%",
          background: orbBackground,
          border: `1px solid ${orbBorderColor}`,
          boxShadow: glowIntensity[state],
          transition: "transform 300ms ease, box-shadow 500ms",
          transform: isHovered ? "scale(1.15)" : "scale(1)",
          display: "grid",
          placeItems: "center",
        }}
      >
        {/* Locked: show muted indicator */}
        {state === "undiscovered" && (
          <span style={{ fontSize: 10, color: "#444", fontFamily: "monospace" }}>
            ◆
          </span>
        )}
        {/* Available: pulse animation */}
        {state === "available" && (
          <div
            style={{
              width: orbSize + 12,
              height: orbSize + 12,
              borderRadius: "50%",
              border: `1px solid ${planet.color}44`,
              position: "absolute",
              animation: "planetPulse 3s ease-in-out infinite",
              "--glow-color": glowIntensity.available,
              "--glow-color-strong": glowStrong.available,
            } as React.CSSProperties}
          />
        )}
      </div>

      {/* Planet name */}
      <span style={{ ...nameStyle, color: nameColor, fontSize: 14 }}>
        {planet.name}
      </span>

      {/* State label */}
      {state !== "undiscovered" && state !== "completed" && !isCenter && (
        <span style={{
          ...stateTagStyle,
          color: planet.color,
        }}>
          {STATE_LABEL[state]}
        </span>
      )}
      {state === "completed" && (
        <span style={{ ...stateTagStyle, color: "rgba(245, 158, 11, 0.85)" }}>
          DOMINADO
        </span>
      )}

      {/* Tooltip */}
      {isHovered && isInteractive && (
        <div style={tooltipStyle}>
          {state === "available" ? "SINAL DETECTADO — ATIVAR MISSÃO" :
           state === "active" ? "MISSÃO EM ANDAMENTO — ENTRAR" :
           state === "completed" ? "TERRITÓRIO DOMINADO" :
           "ENTRAR NO MUNDO"}
        </div>
      )}
    </div>
  );
}

// ─── SHARED STYLES ────────────────────────────────────────────────────────────

const nameStyle: React.CSSProperties = {
  fontFamily: typography.fontFamily.mono,
  fontWeight: 700,
  letterSpacing: "0.06em",
  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
  whiteSpace: "nowrap",
};

const tooltipStyle: React.CSSProperties = {
  position: "absolute",
  top: -28,
  left: "50%",
  transform: "translateX(-50%)",
  pointerEvents: "none",
  background: "rgba(0,0,0,0.85)",
  border: "1px solid #00f5ff",
  padding: "3px 8px",
  borderRadius: 4,
  fontFamily: typography.fontFamily.mono,
  fontSize: 10,
  color: "#fff",
  whiteSpace: "nowrap",
  zIndex: 20,
};

const stateTagStyle: React.CSSProperties = {
  fontFamily: typography.fontFamily.mono,
  fontSize: 9,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const styles: Record<string, React.CSSProperties> = {
  galacticMap: {
    width: "100vw",
    height: "100vh",
    position: "relative",
    overflow: "hidden",
    background: "radial-gradient(ellipse at center, #000510 0%, #000000 70%)",
    cursor: "default",
  },
  headerLabel: {
    position: "absolute",
    top: 22,
    left: "50%",
    transform: "translateX(-50%)",
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: "#00f5ff",
    opacity: 0.6,
    zIndex: 10,
    whiteSpace: "nowrap",
  },
  backButton: {
    position: "absolute",
    top: 22,
    left: 24,
    fontFamily: typography.fontFamily.mono,
    fontSize: 11,
    color: "#00f5ff",
    opacity: 0.6,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    zIndex: 10,
  },
  solarSystem: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 0,
    height: 0,
  },
  flashOverlay: {
    position: "absolute",
    inset: 0,
    background: "#00f5ff",
    opacity: 0.12,
    zIndex: 100,
    pointerEvents: "none",
  },
};
