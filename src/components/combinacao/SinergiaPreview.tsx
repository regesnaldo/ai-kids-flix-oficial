"use client";

/**
 * MENTE.AI — Pré-visualização de Sinergia
 * src/components/combinacao/SinergiaPreview.tsx
 *
 * Renderiza o "arco" animado entre dois agentes selecionados.
 * Mostra o tipo de sinergia, bônus e uma linha SVG pulsante.
 *
 * Estados:
 *  - Neutro (nenhum agente): ícone "VS" estático com instrução
 *  - Um agente: anel + seta aguardando o segundo
 *  - Dois agentes: SVG com arco animado, label da sinergia, bônus XP
 *  - Loading: spinner sobre o arco
 */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Agent } from "@/data/agents";

// ─── Paleta de sinergia ───────────────────────────────────────────────────────

const COR_SINERGIA: Record<string, { primary: string; glow: string; emoji: string }> = {
  amplificacao:   { primary: "#f97316", glow: "#f9731640", emoji: "⚡" },
  contrabalanco:  { primary: "#3b82f6", glow: "#3b82f640", emoji: "⚖️" },
  fusao:          { primary: "#a855f7", glow: "#a855f740", emoji: "🌀" },
  especializacao: { primary: "#22c55e", glow: "#22c55e40", emoji: "🎯" },
  default:        { primary: "#9333ea", glow: "#9333ea40", emoji: "✨" },
};

const LABEL_SINERGIA: Record<string, string> = {
  amplificacao:   "Amplificação",
  contrabalanco:  "Contrabalanço",
  fusao:          "Fusão",
  especializacao: "Especialização",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface SinergiaPreviewProps {
  agentA: Agent | null;
  agentB: Agent | null;
  /** Tipo de sinergia retornado pela API após a combinação */
  tipoSinergia?: string | null;
  /** Bônus de XP da sinergia */
  sinergiaBonus?: number | null;
  /** Exibe spinner de carregamento */
  carregando?: boolean;
  /** Exibe estado de sucesso (combinação descoberta) */
  sucesso?: boolean;
}

// ─── Mini avatar circular ─────────────────────────────────────────────────────

function MiniAvatar({ agent, tamanho = 52 }: { agent: Agent | null; tamanho?: number }) {
  const cor = agent
    ? ({ Fundamentos: "#3b82f6", Intermediário: "#22c55e", Avançado: "#f97316", Mestre: "#a855f7" }[agent.level] ?? "#9333ea")
    : "#4b5563";

  return (
    <div style={{
      width: tamanho, height: tamanho, borderRadius: "50%",
      border: `2px solid ${agent ? cor + "aa" : "rgba(255,255,255,0.1)"}`,
      background: agent ? `${cor}18` : "rgba(255,255,255,0.04)",
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", flexShrink: 0, position: "relative",
      boxShadow: agent ? `0 0 16px ${cor}44` : "none",
      transition: "all 0.3s ease",
    }}>
      {agent ? (
        <>
          <Image
            src={agent.imageUrl}
            alt={agent.technicalName}
            fill
            sizes={`${tamanho}px`}
            style={{ objectFit: "cover" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <span style={{
            position: "absolute", fontSize: tamanho * 0.38, fontWeight: 900,
            color: cor, userSelect: "none",
          }}>
            {agent.technicalName.charAt(0)}
          </span>
        </>
      ) : (
        <span style={{ fontSize: tamanho * 0.36, color: "rgba(255,255,255,0.2)" }}>?</span>
      )}
    </div>
  );
}

// ─── Arco SVG animado ─────────────────────────────────────────────────────────

function ArcoSVG({ cor, animado }: { cor: string; animado: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!pathRef.current || !animado) return;
    const len = pathRef.current.getTotalLength();
    pathRef.current.style.strokeDasharray = String(len);
    pathRef.current.style.strokeDashoffset = String(len);
    // Trigger animation via CSS transition after mount
    requestAnimationFrame(() => {
      if (pathRef.current) {
        pathRef.current.style.transition = "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)";
        pathRef.current.style.strokeDashoffset = "0";
      }
    });
  }, [animado, cor]);

  return (
    <svg
      viewBox="0 0 120 44"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: 44, overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <filter id="glow-arc">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="arc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={cor} stopOpacity="0.4" />
          <stop offset="50%"  stopColor={cor} stopOpacity="1.0" />
          <stop offset="100%" stopColor={cor} stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Trilha fantasma */}
      <path
        d="M 10 36 Q 60 4 110 36"
        fill="none"
        stroke={cor}
        strokeOpacity="0.12"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Arco principal */}
      <path
        ref={pathRef}
        d="M 10 36 Q 60 4 110 36"
        fill="none"
        stroke="url(#arc-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#glow-arc)"
      />

      {/* Partícula viajante */}
      {animado && (
        <circle r="3.5" fill={cor} filter="url(#glow-arc)">
          <animateMotion dur="1.6s" repeatCount="indefinite" calcMode="spline"
            keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
            keyTimes="0;0.5;1"
            path="M 10 36 Q 60 4 110 36"
          />
        </circle>
      )}
    </svg>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function SinergiaPreview({
  agentA,
  agentB,
  tipoSinergia,
  sinergiaBonus,
  carregando = false,
  sucesso = false,
}: SinergiaPreviewProps) {
  const ambos = !!agentA && !!agentB;
  const paleta = COR_SINERGIA[tipoSinergia ?? ""] ?? COR_SINERGIA.default;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
      minWidth: 120,
      padding: "0 8px",
    }}>
      {/* ── Avatares + arco ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, width: "100%", position: "relative" }}>
        <MiniAvatar agent={agentA} />

        {/* Zona central com arco ou ícone */}
        <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <AnimatePresence mode="wait">
            {carregando ? (
              /* Spinner de loading */
              <motion.div
                key="spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: "0 4px" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  style={{
                    width: 24, height: 24, borderRadius: "50%",
                    border: "2px solid rgba(139,92,246,0.2)",
                    borderTopColor: "#9333ea",
                  }}
                />
              </motion.div>
            ) : sucesso && tipoSinergia ? (
              /* Estado de sucesso: arco animado */
              <motion.div
                key="arco"
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                style={{ width: "100%", position: "relative" }}
              >
                <ArcoSVG cor={paleta.primary} animado />
              </motion.div>
            ) : ambos ? (
              /* Dois agentes selecionados, aguardando combinação */
              <motion.div
                key="vs"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ padding: "0 6px" }}
              >
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  style={{
                    fontSize: 11, fontWeight: 900, letterSpacing: "0.1em",
                    color: "#a855f7", textTransform: "uppercase",
                    display: "block", textAlign: "center",
                    textShadow: "0 0 12px #a855f7aa",
                  }}
                >
                  ✦
                </motion.span>
              </motion.div>
            ) : (
              /* Estado neutro */
              <motion.div
                key="neutro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ padding: "0 4px" }}
              >
                <div style={{
                  fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.15)",
                  letterSpacing: "0.05em", textAlign: "center",
                }}>
                  ·····
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <MiniAvatar agent={agentB} />
      </div>

      {/* ── Label da sinergia ── */}
      <AnimatePresence>
        {sucesso && tipoSinergia && (
          <motion.div
            key="label"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}
          >
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: paleta.primary,
              display: "flex", alignItems: "center", gap: 4,
              textShadow: `0 0 10px ${paleta.primary}88`,
            }}>
              <span>{paleta.emoji}</span>
              <span>{LABEL_SINERGIA[tipoSinergia] ?? tipoSinergia}</span>
            </div>

            {sinergiaBonus != null && sinergiaBonus > 0 && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 18 }}
                style={{
                  fontSize: 10, fontWeight: 800,
                  background: `linear-gradient(90deg, ${paleta.primary}, #fff)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                +{sinergiaBonus} Bonus XP
              </motion.div>
            )}
          </motion.div>
        )}

        {!sucesso && ambos && !carregando && (
          <motion.p
            key="dica"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", margin: 0, textAlign: "center" }}
          >
            Combinação pronta!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
