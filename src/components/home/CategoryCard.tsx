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

const pluralizeAgentes = (count: number) =>
  count === 1 ? `${count} agente disponível` : `${count} agentes disponíveis`;

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
        padding: "20px",
        background: "#0d0d1f",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        minHeight: "320px",
        scrollSnapAlign: "start",
        flex: "0 0 auto",
        minWidth: "280px",
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
          {pluralizeAgentes(agentCount)}
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
