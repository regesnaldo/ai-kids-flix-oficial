"use client";

/**
 * MENTE.AI — Popup Flutuante de XP
 * src/components/combinacao/XPPopup.tsx
 *
 * Renderiza "+50 XP" (ou qualquer valor) flutuando para cima e
 * desaparecendo. Deve ser montado/desmontado pelo pai — usa
 * AnimatePresence externamente.
 *
 * Uso:
 *   <AnimatePresence>
 *     {mostrar && <XPPopup xp={50} badges={["explorador"]} key="xp" />}
 *   </AnimatePresence>
 */

import { motion } from "framer-motion";

// ─── Mapeamento de badge → label legível ──────────────────────────────────────

const BADGE_LABEL: Record<string, string> = {
  explorador:   "🧭 Explorador",
  aprendiz:     "📚 Aprendiz da IA",
  conector:     "🔗 Conector de Agentes",
  investigador: "🔍 Investigador",
  mestre:       "🏆 Mestre MENTE.AI",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface XPPopupProps {
  xp: number;
  badges?: string[];
  novaDescoberta?: boolean;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function XPPopup({ xp, badges = [], novaDescoberta = false }: XPPopupProps) {
  return (
    <motion.div
      data-testid="xp-popup"
      initial={{ opacity: 0, y: 0, scale: 0.6 }}
      animate={{ opacity: 1, y: -60, scale: 1 }}
      exit={{ opacity: 0, y: -100, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {/* Valor de XP */}
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ delay: 0.1, duration: 0.4 }}
        style={{
          fontSize: 28,
          fontWeight: 900,
          letterSpacing: "-0.02em",
          background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #fcd34d 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 12px rgba(251,191,36,0.8))",
          lineHeight: 1,
        }}
      >
        +{xp} XP
      </motion.div>

      {/* Tag de nova descoberta */}
      {novaDescoberta && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 16 }}
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#fff",
            background: "linear-gradient(90deg, #9333ea, #6366f1)",
            padding: "3px 10px",
            borderRadius: 20,
            boxShadow: "0 0 14px rgba(147,51,234,0.6)",
          }}
        >
          ✨ Nova Descoberta!
        </motion.div>
      )}

      {/* Badges desbloqueadas */}
      {badges.map((badgeId, i) => (
        <motion.div
          key={badgeId}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }}
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#fbbf24",
            background: "rgba(251,191,36,0.12)",
            border: "1px solid rgba(251,191,36,0.35)",
            padding: "3px 10px",
            borderRadius: 20,
            whiteSpace: "nowrap",
          }}
        >
          {BADGE_LABEL[badgeId] ?? badgeId} desbloqueada!
        </motion.div>
      ))}
    </motion.div>
  );
}
