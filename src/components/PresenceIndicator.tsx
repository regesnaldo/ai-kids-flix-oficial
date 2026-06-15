"use client";

interface PresenceIndicatorProps {
  agentId: string;
  count: number;
  color?: string;
  pulseIntensity?: "subtle" | "moderate" | "urgent";
}

export function PresenceIndicator({ agentId, count, color = "#00FF88", pulseIntensity }: PresenceIndicatorProps) {
  if (count <= 0) return null;

  const intensity = pulseIntensity ?? (count >= 10 ? "urgent" : count >= 3 ? "moderate" : "subtle");
  const label = count === 1 ? "1 participante aqui" : `${count} participantes aqui`;

  const animationDuration = intensity === "urgent" ? "0.8s" : intensity === "moderate" ? "2s" : "3s";
  const glowSize = intensity === "urgent" ? "12px" : intensity === "moderate" ? "8px" : "4px";

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "6px",
      fontFamily: "monospace", fontSize: "10px", color: "#9ca3af",
    }}>
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%",
        backgroundColor: color,
        boxShadow: `0 0 ${glowSize} ${color}`,
        animation: `pulse ${animationDuration} ease-in-out infinite`,
      }} />
      {label}
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  );
}
