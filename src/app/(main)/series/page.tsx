"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Star } from "lucide-react";
import { allAgents } from "@/data/agents";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SeriesPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <main
      className="min-h-screen px-6 md:px-12 pt-24 pb-16"
      style={{ background: "var(--cyber-black)" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1
          className="text-4xl md:text-6xl font-black tracking-tight mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="text-white">SÉRIES </span>
          <span style={{ color: "var(--neon-cyan)" }}>MENTE.AI</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Cada agente tem 50 temporadas de conhecimento. Escolha seu mentor e
          mergulhe em narrativas interativas geradas em tempo real.
        </p>
      </motion.div>

      {/* Agent Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5"
      >
        {allAgents.map((agent) => (
          <motion.div key={agent.id} variants={cardVariant}>
            <Link
              href={`/series/${agent.id}`}
              className="group block"
              onMouseEnter={() => setHoveredId(agent.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Card */}
              <div
                className="relative aspect-[2/3] rounded-lg overflow-hidden border transition-all duration-500"
                style={{
                  borderColor:
                    hoveredId === agent.id
                      ? `${agent.color}50`
                      : "rgba(255,255,255,0.06)",
                  background: `linear-gradient(145deg, ${agent.color}22 0%, #0f0f1a 100%)`,
                  boxShadow:
                    hoveredId === agent.id
                      ? `0 0 40px ${agent.color}20, 0 8px 32px ${agent.color}15`
                      : "none",
                }}
              >
                {/* Image */}
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/images/placeholder.svg";
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

                {/* Play button on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
                    style={{
                      background: agent.color,
                      boxShadow: `0 0 30px ${agent.color}40`,
                    }}
                  >
                    <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                  </div>
                </div>

                {/* Season count badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      background: `${agent.color}30`,
                      color: agent.color,
                      border: `1px solid ${agent.color}40`,
                    }}
                  >
                    50 TEMP
                  </span>
                </div>

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span
                    className="inline-block px-2 py-0.5 text-white text-[9px] font-bold rounded mb-1.5"
                    style={{ background: agent.color }}
                  >
                    {agent.category}
                  </span>
                  <p className="text-sm font-bold text-white leading-tight">
                    {agent.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 text-yellow-400" fill="#facc15" />
                    <span className="text-[10px] text-gray-400">
                      {agent.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Title below card */}
              <p className="mt-2 text-xs font-semibold text-gray-300 truncate">
                {agent.name}
              </p>
              <p className="text-[10px] text-gray-500 truncate">
                50 temporadas • Interativo
              </p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty state fallback */}
      {allAgents.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            Nenhum agente disponível no momento.
          </p>
        </div>
      )}
    </main>
  );
}
