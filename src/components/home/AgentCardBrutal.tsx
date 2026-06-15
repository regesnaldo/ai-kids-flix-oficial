"use client";

import Link from "next/link";

interface AgentCardBrutalProps {
  id: string;
  name: string;
  color: string;
  faction: string;
  image: string;
}

export function AgentCardBrutal({ id, name, color, faction, image }: AgentCardBrutalProps) {
  return (
    <Link
      href={`/universo/${id}`}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        border: `3px solid ${color}`,
        background: `${color}15`,
        boxShadow: "4px 4px 0 0 #000",
        transition: "all 0.2s ease",
        position: "relative",
        overflow: "hidden",
        borderRadius: "4px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `6px 6px 0 0 #000`;
        e.currentTarget.style.transform = "translate(-2px, -2px)";
        e.currentTarget.style.background = `${color}25`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "4px 4px 0 0 #000";
        e.currentTarget.style.transform = "translate(0, 0)";
        e.currentTarget.style.background = `${color}15`;
      }}
    >
      {/* Image */}
      <div
        style={{
          height: "180px",
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      {/* Name + Faction */}
      <div style={{ padding: "0.75rem" }}>
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.8rem",
          fontWeight: 700,
          color: color,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          margin: 0,
          textShadow: `0 0 6px ${color}80`,
        }}>
          {name}
        </p>
        <p style={{
          fontFamily: "monospace",
          fontSize: "0.6rem",
          color: "#9ca3af",
          margin: "4px 0 0",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          {faction}
        </p>
      </div>
    </Link>
  );
}
