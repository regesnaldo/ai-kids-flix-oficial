"use client";

interface PresenceIndicatorProps {
  agentId: string;
  count: number;
  color?: string;
}

export function PresenceIndicator({ agentId, count, color = "#00FF88" }: PresenceIndicatorProps) {
  if (count <= 0) return null;

  const label = count === 1 ? "1 participante aqui" : `${count} participantes aqui`;

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      fontFamily: "monospace", fontSize: "10px", color: "#9ca3af",
    }}>
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 6px ${color}`,
        animation: "pulse 2s ease-in-out infinite",
      }} />
      {label}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
