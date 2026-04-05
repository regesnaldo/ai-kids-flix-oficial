"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { AgentShowcase } from "@/data/agents-showcase";

interface AgentCardProps {
  agent: AgentShowcase;
  priority?: boolean;
}

export default function AgentCard({ agent, priority = false }: AgentCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <style>{`
        .agent-card-root {
          aspect-ratio: 3 / 4;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          width: 100%;
          max-width: 360px;
          cursor: default;
        }
        @media (max-width: 768px) {
          .agent-card-root {
            aspect-ratio: 16 / 9;
            max-width: none;
          }
        }
      `}</style>

      <motion.div
        className="agent-card-root"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          boxShadow: `0 24px 48px rgba(0,0,0,0.5), 0 0 60px ${agent.themeGlow}33`,
        }}
      >
        {/* Image or initial-letter placeholder */}
        {imgError ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `linear-gradient(135deg, ${agent.themeGlow}22 0%, #0a0a0f 60%)`,
              fontSize: "clamp(64px, 12vw, 100px)",
              fontWeight: 900,
              color: agent.themeGlow,
              letterSpacing: "-2px",
              userSelect: "none",
            }}
            aria-hidden="true"
          >
            {agent.name.charAt(0)}
          </div>
        ) : (
          <Image
            src={agent.image}
            alt={`${agent.name} — ${agent.subtitle}`}
            fill
            style={{ objectFit: "cover" }}
            priority={priority}
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
          />
        )}

        {/* Gradient overlay bottom-to-top */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.25) 45%, transparent 72%)",
            pointerEvents: "none",
          }}
        />

        {/* Footer info */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: agent.categoryColor,
              color: "#fff",
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              padding: "3px 8px",
              borderRadius: "4px",
              marginBottom: "6px",
            }}
          >
            {agent.category}
          </div>

          <div
            style={{
              fontSize: "22px",
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.5px",
              lineHeight: 1.1,
            }}
          >
            {agent.name}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.65)",
              marginTop: "3px",
              fontWeight: 400,
            }}
          >
            {agent.subtitle}
          </div>
        </div>
      </motion.div>
    </>
  );
}
