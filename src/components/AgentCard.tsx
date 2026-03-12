"use client";

import { AgentUI } from "@/types/agent";

export default function AgentCard({ agent }: { agent: AgentUI }) {
  return (
    <div
      style={{
        position: "relative",
        width: "280px",
        height: "158px",
        borderRadius: "8px",
        overflow: "hidden",
        background: "linear-gradient(135deg, " + agent.color + "40, " + agent.color + "20)",
        border: "2px solid " + agent.color,
        cursor: "pointer",
        transition: "transform 0.3s, box-shadow 0.3s",
        flexShrink: "0",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 8px 20px " + agent.color + "60";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Conteúdo */}
      <div style={{ padding: "16px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        {/* Topo: Nome e Tag */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
            <h3 style={{ color: agent.color, fontSize: "20px", fontWeight: "bold", margin: 0 }}>
              {agent.name}
            </h3>
            <span
              style={{
                padding: "4px 8px",
                fontSize: "10px",
                fontWeight: "bold",
                borderRadius: "4px",
                backgroundColor: agent.color,
                color: "white",
                textTransform: "uppercase",
              }}
            >
              {agent.tag}
            </span>
          </div>
        </div>

        {/* Descrição */}
        <p style={{ fontSize: "12px", color: "#e5e7eb", lineHeight: "1.4", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {agent.desc}
        </p>
      </div>

      {/* Barra colorida inferior */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: agent.color }} />
    </div>
  );
}
