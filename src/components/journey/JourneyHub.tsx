"use client";

import React from "react";
import Link from "next/link";
import { useJourney, getArchetypeLabel, getRecommendationReason, AGENT_FACTION, AGENT_COLORS } from "@/providers/JourneyProvider";
import { useOasis } from "@/providers/OasisProvider";
import { useSession } from "@/providers/SessionProvider";
import { usePathname } from "next/navigation";

// ═══════════════════════════════════════════════════════════════════
// JOURNEY HUB — responde às 5 perguntas do usuário
//
// 1. ONDE ESTOU?      → pathname atual
// 2. O QUE ESTOU FAZENDO? → missão atual (progressionSnapshot.activePlanet)
// 3. O QUE JÁ CONQUISTEI? → completed (episódios) + archetype + dimensões
// 4. PARA ONDE VOU?   → recommended agent
// 5. POR QUÊ?         → justificativa contextual
// ═══════════════════════════════════════════════════════════════════

const ROUTE_LABELS: Record<string, string> = {
  "/home": "Torre Central",
  "/explorar": "Explorador Estelar",
  "/blog": "Arquivos do Conhecimento",
  "/lab": "Laboratório de Experimentos",
  "/logos": "Oráculo LOGOS",
  "/agentes": "Galeria de Agentes",
  "/series": "Navegador Narrativo",
  "/universo": "Mapa Galáctico",
  "/perfil": "Diário de Bordo",
};

function getCurrentMissionLabel(activePlanet: string | null): string {
  if (!activePlanet) return "Navegando pelo metaverso";
  const agentName = activePlanet.charAt(0).toUpperCase() + activePlanet.slice(1);
  return `Explorando o universo ${agentName}`;
}

export default function JourneyHub() {
  const { journey } = useJourney();
  const { cognitiveProfile, progressionSnapshot } = useOasis();
  const { user } = useSession();
  const pathname = usePathname();

  const { archetype, recommended, needsOnboarding, completed, dimensions, loading, error } = journey;

  const username = user?.name ?? "Participante";
  const currentRoute = ROUTE_LABELS[pathname] ?? pathname;
  const activePlanet = progressionSnapshot.activePlanet;
  const currentMission = getCurrentMissionLabel(activePlanet);
  const totalCompleted = progressionSnapshot.totalCompleted ?? 0;
  const archetypeDisplay = getArchetypeLabel(archetype);
  const reason = getRecommendationReason(archetype, recommended);
  const recomColor = AGENT_COLORS[recommended] ?? "#00FFFF";
  const recomFaction = AGENT_FACTION[recommended] ?? "";

  // Estados de carregamento e erro — não bloqueiam
  if (loading) {
    return (
      <div
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(4,7,18,0.94) 0%, rgba(4,7,18,0.78) 44%, rgba(4,7,18,0.28) 100%), url('/images/home/cognitive-calibration-chamber.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid rgba(0,255,255,0.28)",
          borderRadius: "8px",
          padding: "32px 24px",
          minHeight: "220px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#00FF88", margin: "0 0 0.5rem" }}>
          {/* CALIBRANDO SENSORES DE JORNADA */}
        </p>
        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#0088FF", margin: 0 }}>
          Sincronizando dados do metaverso...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "rgba(0,0,0,0.6)",
          border: "1px solid rgba(255,68,68,0.2)",
          borderRadius: "4px",
          padding: "16px",
          marginBottom: "2rem",
        }}
      >
        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#FF4444", margin: 0 }}>
          {/* ERRO DE TELEMETRIA: */} {error}
        </p>
      </div>
    );
  }

  // ─── Perfil em formação (novo usuário) ──────────────────────────
  if (needsOnboarding || !archetype) {
    return (
      <div
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(4,7,18,0.94) 0%, rgba(4,7,18,0.78) 44%, rgba(4,7,18,0.28) 100%), url('/images/home/cognitive-calibration-chamber.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: "1px solid rgba(0,255,255,0.28)",
          borderRadius: "8px",
          padding: "32px 24px",
          minHeight: "220px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginBottom: "2rem",
        }}
      >
        <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#00FF88", margin: "0 0 0.5rem" }}>
          {/* PERFIL EM FORMAÇÃO */}
        </p>
        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#0088FF", margin: "0 0 1rem" }}>
          Calibrando sensores cognitivos...
        </p>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link
            href="/onboarding"
            style={{
              display: "inline-flex",
              padding: "8px 16px",
              border: "1px solid #00FFFF",
              color: "#00FFFF",
              fontFamily: "monospace",
              fontSize: "10px",
              textDecoration: "none",
              letterSpacing: "0.1em",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(0,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            }}
          >
            INICIAR CALIBRAÇÃO
          </Link>
        </div>
      </div>
    );
  }

  // ─── Perfil ativo — mostra jornada completa ─────────────────────
  return (
    <div
      style={{
        background: "rgba(0,0,0,0.6)",
        border: "1px solid rgba(0,255,255,0.15)",
        borderRadius: "4px",
        padding: "24px",
        marginBottom: "2rem",
      }}
    >
      {/* Header */}
      <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#00FF88", margin: "0 0 0.25rem", letterSpacing: "0.1em" }}>
        {/* SISTEMA DE NAVEGAÇÃO COGNITIVA */}
      </p>
      <p style={{ fontFamily: "monospace", fontSize: "10px", color: "#0088FF", margin: "0 0 1.25rem" }}>
        {username} · ARQUÉTIPO: {archetypeDisplay}
      </p>

      {/* Grid 2x2 — responde às 5 perguntas */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>

        {/* Q1: ONDE ESTOU */}
        <div style={{ padding: "12px", background: "rgba(0,255,255,0.03)", borderRadius: "4px" }}>
          <p style={{ fontFamily: "monospace", fontSize: "8px", color: "#0088FF", margin: "0 0 4px", letterSpacing: "0.15em" }}>
            LOKALIZAÇÃO ATUAL
          </p>
          <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#00FFFF", margin: 0 }}>
            {currentRoute}
          </p>
        </div>

        {/* Q2: O QUE ESTOU FAZENDO */}
        <div style={{ padding: "12px", background: "rgba(0,255,255,0.03)", borderRadius: "4px" }}>
          <p style={{ fontFamily: "monospace", fontSize: "8px", color: "#00FF88", margin: "0 0 4px", letterSpacing: "0.15em" }}>
            MISSÃO ATUAL
          </p>
          <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#00FF88", margin: 0 }}>
            {currentMission}
          </p>
          {activePlanet && (
            <Link
              href={`/universo/${activePlanet}`}
              style={{
                fontFamily: "monospace",
                fontSize: "9px",
                color: "#00FF88",
                textDecoration: "underline",
                textUnderlineOffset: "2px",
                opacity: 0.7,
                marginTop: "4px",
                display: "inline-block",
              }}
            >
              CONTINUAR →
            </Link>
          )}
        </div>

        {/* Q3: O QUE JÁ CONQUISTEI */}
        <div style={{ padding: "12px", background: "rgba(0,255,255,0.03)", borderRadius: "4px" }}>
          <p style={{ fontFamily: "monospace", fontSize: "8px", color: "#C084FC", margin: "0 0 4px", letterSpacing: "0.15em" }}>
            CONQUISTAS
          </p>
          <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#C084FC", margin: 0 }}>
            {completed} episódios · {totalCompleted}/12 universos
          </p>
          <div style={{ marginTop: "6px", display: "flex", gap: "6px" }}>
            {[
              { label: "E", value: dimensions.emotional, color: "#FF69B4" },
              { label: "I", value: dimensions.intellectual, color: "#00BFFF" },
              { label: "M", value: dimensions.moral, color: "#00FF88" },
            ].map((dim) => (
              <div key={dim.label} style={{ flex: 1 }}>
                <div style={{
                  height: "3px",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    width: `${dim.value * 100}%`,
                    height: "100%",
                    background: dim.color,
                    borderRadius: "2px",
                    transition: "width 0.5s ease",
                  }} />
                </div>
                <p style={{ fontFamily: "monospace", fontSize: "7px", color: dim.color, margin: "2px 0 0", textAlign: "center" }}>
                  {dim.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Q4+5: PARA ONDE VOU + POR QUÊ */}
        <div style={{ padding: "12px", background: "rgba(0,0,0,0.3)", borderRadius: "4px", border: `1px solid ${recomColor}33` }}>
          <p style={{ fontFamily: "monospace", fontSize: "8px", color: recomColor, margin: "0 0 4px", letterSpacing: "0.15em" }}>
            PRÓXIMO DESTINO
          </p>
          <Link
            href={`/universo/${recommended.toLowerCase()}`}
            style={{
              fontFamily: "monospace",
              fontSize: "14px",
              color: recomColor,
              textDecoration: "none",
              display: "block",
              marginBottom: "4px",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.textShadow = `0 0 12px ${recomColor}44`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.textShadow = "none";
            }}
          >
            {recommended} {recomFaction && `(${recomFaction})`} →
          </Link>
          <p style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: "1.4" }}>
            {reason}
          </p>
        </div>

      </div>
    </div>
  );
}
