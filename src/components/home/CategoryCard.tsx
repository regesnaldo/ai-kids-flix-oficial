import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HomeAgent } from "@/data/all-agents";

interface CategoryCardProps {
  categoryName: string;
  agents: HomeAgent[];
  agentCount: number;
  color: string;
}

export default function CategoryCard({
  categoryName,
  agents,
  agentCount,
  color,
}: CategoryCardProps) {
  const router = useRouter();
  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => router.push(`/explorar?categoria=${categorySlug}`)}
      style={{
        padding: "24px",
        background: `linear-gradient(135deg, rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.1), rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.05))`,
        border: `1px solid ${color}40`,
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        minHeight: "320px",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = color;
        el.style.boxShadow = `0 0 30px ${color}40`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = `${color}40`;
        el.style.boxShadow = "none";
      }}
    >
      <div>
        <h3
          style={{
            color: "#fff",
            fontSize: "1.3rem",
            fontWeight: "600",
            margin: 0,
          }}
        >
          {categoryName}
        </h3>
        <p
          style={{
            color: "#a0aec0",
            fontSize: "0.9rem",
            margin: "8px 0 0",
          }}
        >
          {agentCount} agentes disponíveis
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          flex: 1,
        }}
      >
        {agents.slice(0, 3).map((agent) => (
          <div
            key={agent.id}
            style={{
              position: "relative",
              borderRadius: "8px",
              overflow: "hidden",
              aspectRatio: "1",
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${color}20`,
            }}
          >
            <Image
              src={agent.image}
              alt={agent.name}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      <button
        style={{
          padding: "10px 16px",
          background: color,
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
        Explorar Categoria
      </button>
    </motion.div>
  );
}
