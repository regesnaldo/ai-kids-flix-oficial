"use client";

import Link from "next/link";

interface HeroCTAProps {
  isNew: boolean;
  episode?: {
    id: string;
    title: string;
    agentName: string;
    url: string;
  };
}

export function HeroCTA({ isNew, episode }: HeroCTAProps) {
  const href = isNew ? "/universo/nexus" : (episode?.url ?? "/universo/nexus");
  const label = isNew
    ? "🚀 Começar minha jornada"
    : `▶ Continuar ${episode?.title ?? "sua jornada"}`;

  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        marginTop: "1.5rem",
        padding: "1rem 2.5rem",
        background: "linear-gradient(135deg, #3DC0C0, #2DA0A0)",
        color: "#0a0a1a",
        fontFamily: "monospace",
        fontSize: "1.125rem",
        fontWeight: 700,
        letterSpacing: "0.05em",
        textDecoration: "none",
        borderRadius: "12px",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        minHeight: "56px",
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        boxShadow: "0 0 20px rgba(61,192,192,0.3)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 0 30px rgba(61,192,192,0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 0 20px rgba(61,192,192,0.3)";
      }}
    >
      {label}
    </Link>
  );
}
