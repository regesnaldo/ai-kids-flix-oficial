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
          fontSize: "24px",
          marginBottom: "8px",
          fontWeight: "700",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "14px",
            marginBottom: "32px",
            margin: "8px 0 32px",
          }}
        >
          {subtitle}
        </p>
      )}

      <div
        style={{
          display: "flex",
          overflowX: "auto",
          overflowY: "hidden",
          gap: "24px",
          paddingBottom: "20px",
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}
