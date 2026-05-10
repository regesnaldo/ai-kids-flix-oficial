import { motion } from "framer-motion";
import Image from "next/image";
import { HomeAgent } from "@/data/all-agents";

interface AgentPairingCardProps {
  agent1: HomeAgent;
  agent2: HomeAgent;
  title: string;
  description: string;
}

export default function AgentPairingCard({
  agent1,
  agent2,
  title,
  description,
}: AgentPairingCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      style={{
        padding: "24px",
        background: `linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(139, 92, 246, 0.05))`,
        border: "1px solid rgba(139, 92, 246, 0.4)",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(139, 92, 246, 1)";
        el.style.boxShadow = "0 0 30px rgba(139, 92, 246, 0.4)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = "rgba(139, 92, 246, 0.4)";
        el.style.boxShadow = "none";
      }}
    >
      <h3
        style={{
          color: "#fff",
          fontSize: "1.2rem",
          fontWeight: "600",
          margin: 0,
        }}
      >
        {title}
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid ${agent1.color}`,
              boxShadow: `0 0 20px ${agent1.color}40`,
            }}
          >
            <Image
              src={agent1.image}
              alt={agent1.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <span
            style={{
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            {agent1.name}
          </span>
        </div>

        <div
          style={{
            color: "#a0aec0",
            fontSize: "1.5rem",
            opacity: 0.6,
          }}
        >
          +
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              overflow: "hidden",
              border: `2px solid ${agent2.color}`,
              boxShadow: `0 0 20px ${agent2.color}40`,
            }}
          >
            <Image
              src={agent2.image}
              alt={agent2.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <span
            style={{
              color: "#fff",
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            {agent2.name}
          </span>
        </div>
      </div>

      <p
        style={{
          color: "#a0aec0",
          fontSize: "0.95rem",
          margin: 0,
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        {description}
      </p>

      <button
        style={{
          padding: "10px 16px",
          background: "#8B5CF6",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "0.95rem",
          fontWeight: "600",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        Explorar Combinação
      </button>
    </motion.div>
  );
}
