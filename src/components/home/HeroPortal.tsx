"use client";

import Link from "next/link";
import { HeroAgent } from "./HeroAgent";
import { heroAgents } from "@/config/heroAgents";

export default function HeroPortal() {
  return (
    <section
      style={{
        position: "relative",
        minHeight: "340px",
        marginBottom: "2rem",
        borderRadius: "12px",
        overflow: "hidden",
        background: "radial-gradient(ellipse at center, rgba(0,255,255,0.04) 0%, transparent 60%), #05060f",
      }}
    >
      {/* Grid sutil de fundo */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Agentes nos 4 cantos */}
      {heroAgents.map((agent) => (
        <HeroAgent key={agent.id} {...agent} />
      ))}

      {/* Centro — título, subtítulo, CTA. Área protegida: nada pode invadir. */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "70px 20px",
          color: "white",
        }}
      >
        <h2
          style={{
            fontFamily: "monospace",
            color: "#00FFFF",
            fontSize: "1.5rem",
            letterSpacing: "4px",
            marginBottom: "8px",
            textShadow: "0 0 20px rgba(0,255,255,0.3)",
          }}
        >
          12 UNIVERSOS DE IA
        </h2>
        <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "24px" }}>
          Escolha seu agente e comece sua jornada
        </p>
        <Link
          href="/explorar"
          style={{
            background: "transparent",
            border: "1px solid #00FFFF",
            color: "#00FFFF",
            padding: "12px 32px",
            fontFamily: "monospace",
            fontSize: "0.8rem",
            letterSpacing: "2px",
            cursor: "pointer",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          EXPLORAR UNIVERSOS →
        </Link>
      </div>
    </section>
  );
}
