import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface JourneyCardProps {
  id: string;
  title: string;
  description: string;
  level: string;
  color: string;
  progress?: number;
}

export default function JourneyCard({
  id,
  title,
  description,
  level,
  color,
  progress = 0,
}: JourneyCardProps) {
  const router = useRouter();

  const levelLabel: { [key: string]: string } = {
    Iniciante: "Para Iniciantes",
    Intermediário: "Intermediário",
    Avançado: "Avançado",
    Mestre: "Nível Mestre",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => router.push(`/aulas?jornada=${id}`)}
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            marginBottom: "8px",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontSize: "1.2rem",
              fontWeight: "600",
              margin: 0,
              flex: 1,
            }}
          >
            {title}
          </h3>
          <span
            style={{
              background: color,
              color: "#fff",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "0.75rem",
              fontWeight: "600",
              whiteSpace: "nowrap",
              marginLeft: "12px",
            }}
          >
            {levelLabel[level] || level}
          </span>
        </div>
        <p
          style={{
            color: "#a0aec0",
            fontSize: "0.95rem",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      </div>

      {progress > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div
            style={{
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: color,
                width: `${progress}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <span
            style={{
              color: "#a0aec0",
              fontSize: "0.85rem",
            }}
          >
            {progress}% concluído
          </span>
        </div>
      )}

      <button
        style={{
          marginTop: "8px",
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
        {progress > 0 ? "Continuar" : "Começar Jornada"}
      </button>
    </motion.div>
  );
}
