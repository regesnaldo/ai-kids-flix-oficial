"use client";

import Link from "next/link";

interface ContinueCardProps {
  completedCount: number;
  isNew: boolean;
}

export function ContinueCard({ completedCount, isNew }: ContinueCardProps) {
  // Não renderiza se usuário novo (sem progresso)
  if (isNew || completedCount === 0) return null;

  const progress = Math.min(100, Math.round((completedCount / 100) * 100));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1.5rem",
        background: "rgba(0, 255, 255, 0.03)",
        border: "1px solid rgba(0, 255, 255, 0.15)",
        borderRadius: "12px",
        marginBottom: "2rem",
      }}
    >
      {/* Imagem placeholder à esquerda */}
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "8px",
          background: "linear-gradient(135deg, rgba(0,255,255,0.1), rgba(139,92,246,0.1))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "2rem" }}>🎬</span>
      </div>

      {/* Conteúdo à direita */}
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.75rem",
          color: "#3DC0C0",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          margin: "0 0 0.25rem",
        }}>
          Continue de onde parou
        </p>
        <h3 style={{
          fontFamily: "monospace",
          fontSize: "1.1rem",
          color: "#fff",
          margin: "0 0 0.5rem",
        }}>
          Sua jornada no MENTE.AI
        </h3>

        {/* Barra de progresso */}
        <div style={{
          width: "100%",
          height: "6px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "3px",
          margin: "0.75rem 0",
          overflow: "hidden",
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "linear-gradient(90deg, #3DC0C0, #8B5CF6)",
            borderRadius: "3px",
            transition: "width 0.5s ease",
          }} />
        </div>

        <p style={{
          fontFamily: "monospace",
          fontSize: "0.7rem",
          color: "#9ca3af",
          margin: "0 0 1rem",
        }}>
          {completedCount}/100 episódios completos
        </p>

        <Link
          href="/series/nexus/1/1"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.6rem 1.5rem",
            background: "transparent",
            border: "1px solid rgba(0,255,255,0.3)",
            color: "#00FFFF",
            fontFamily: "monospace",
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textDecoration: "none",
            borderRadius: "8px",
            transition: "all 0.2s ease",
          }}
        >
          ▶ Continuar
        </Link>
      </div>
    </div>
  );
}
