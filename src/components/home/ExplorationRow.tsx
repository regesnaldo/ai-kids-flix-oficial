import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ExplorationRowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  delay?: number;
}

export default function ExplorationRow({
  title,
  subtitle,
  children,
  delay = 0,
}: ExplorationRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      style={{ marginTop: "80px" }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: "2rem",
          marginBottom: "10px",
          fontWeight: "700",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            color: "#a0aec0",
            fontSize: "1.1rem",
            marginBottom: "40px",
          }}
        >
          {subtitle}
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
          overflowX: "auto",
          paddingBottom: "20px",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
