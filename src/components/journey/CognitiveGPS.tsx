"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useJourney, getArchetypeLabel, getRecommendationReason, AGENT_COLORS } from "@/providers/JourneyProvider";
import { useOasis } from "@/providers/OasisProvider";

// ═══════════════════════════════════════════════════════════════════
// COGNITIVE GPS — sticky breadcrumb com posição atual + próx passo
//
// Exibição:
//   📍 ARQUÉTIPO · ROTA ATUAL · MISSÃO → PRÓXIMO (justificativa)
//
// Posição: sticky abaixo do header principal
// ═══════════════════════════════════════════════════════════════════

const ROUTE_LABELS: Record<string, string> = {
  "/home": "Torre Central",
  "/explorar": "Explorador",
  "/blog": "Arquivos",
  "/lab": "Lab",
  "/logos": "LOGOS",
  "/agentes": "Agentes",
  "/series": "Séries",
  "/universo": "Mapa",
  "/perfil": "Perfil",
};

export default function CognitiveGPS() {
  const { journey } = useJourney();
  const { progressionSnapshot } = useOasis();
  const pathname = usePathname();

  // Não mostrar em rotas que já têm header próprio
  if (pathname.startsWith("/login") || pathname.startsWith("/onboarding")) return null;

  const { archetype, recommended, loading } = journey;
  const currentLocation = ROUTE_LABELS[pathname] ?? pathname.replace("/", "").toUpperCase();
  const activePlanet = progressionSnapshot.activePlanet;
  const missionLabel = activePlanet
    ? `${activePlanet.charAt(0).toUpperCase() + activePlanet.slice(1)}`
    : null;

  // Não mostra enquanto carrega
  if (loading) return null;

  return (
    <div
      style={{
        position: "sticky",
        top: "64px", // abaixo do header fixo (64px)
        zIndex: 90,
        background: "rgba(10,14,39,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(0,255,255,0.08)",
        padding: "6px 24px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontFamily: "monospace",
        fontSize: "10px",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      {/* Arquétipo */}
      <span style={{ color: "#C084FC", letterSpacing: "0.1em" }}>
        {getArchetypeLabel(archetype)}
      </span>

      <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>

      {/* Localização atual */}
      <span style={{ color: "#00FFFF", letterSpacing: "0.05em" }}>
        {currentLocation}
      </span>

      {missionLabel && (
        <>
          <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>
          <span style={{ color: "#00FF88", letterSpacing: "0.05em" }}>
            {missionLabel}
          </span>
        </>
      )}

      <span style={{ color: "rgba(255,255,255,0.15)" }}>/</span>

      {/* Próximo destino */}
      {archetype && recommended && (
        <>
          <span style={{ color: AGENT_COLORS[recommended] ?? "#FFFFFF", letterSpacing: "0.05em" }}>
            {recommended}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: "9px",
              maxWidth: "300px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {getRecommendationReason(archetype, recommended)}
          </span>
        </>
      )}

      {!archetype && (
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "9px" }}>
          —
        </span>
      )}
    </div>
  );
}
