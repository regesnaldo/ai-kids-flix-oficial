"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { allAgents, type HomeAgent } from "@/data/all-agents";

const GLOW_COLORS: Record<string, string> = {
  nexus: "rgba(0,212,255,0.5)",
  volt: "rgba(251,191,36,0.5)",
  aurora: "rgba(236,72,153,0.5)",
  kaos: "rgba(239,68,68,0.5)",
  cipher: "rgba(16,185,129,0.5)",
  lyra: "rgba(236,72,153,0.5)",
  axiom: "rgba(14,165,233,0.5)",
  stratos: "rgba(100,116,139,0.5)",
  terra: "rgba(34,197,94,0.5)",
  prism: "rgba(139,92,246,0.5)",
  janus: "rgba(245,158,11,0.5)",
  ethos: "rgba(245,158,11,0.5)",
};

function UniverseCard({ agent }: { agent: HomeAgent }) {
  const ringColor = GLOW_COLORS[agent.id] ?? "rgba(0,212,255,0.5)";

  return (
    <Link href={`/lab?agent=${agent.id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group relative rounded-xl overflow-hidden cursor-pointer border border-white/10 transition-all duration-300 ease-out"
        style={{ height: 200 }}
      >
        {/* Agent image background */}
        <div className="absolute inset-0">
          <img
            src={`/images/agentes/${agent.id}.png`}
            alt={agent.name}
            className="w-full h-full object-cover brightness-[0.55] group-hover:brightness-[0.8] transition-all duration-400"
            loading="lazy"
          />
        </div>

        {/* Dark gradient overlay from bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          }}
        />

        {/* Colored ring on hover */}
        <div
          className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-[2px] transition-all duration-300 pointer-events-none"
        />

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <h3
            className="text-sm font-bold text-white leading-tight"
            style={{ textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}
          >
            {agent.name}
          </h3>
          <span
            className="text-[10px] font-mono tracking-wider"
            style={{
              color: ringColor,
              textShadow: "0 1px 3px rgba(0,0,0,0.7)",
            }}
          >
            {agent.category}
          </span>
        </div>

      </motion.div>
    </Link>
  );
}

export default function UniversesGrid() {
  return (
    <section className="w-full py-8">
      <div className="mb-4 px-4 md:px-16">
        <p className="font-mono text-[11px] text-cyan-400/60 tracking-wider uppercase">
          // 12 UNIVERSOS
        </p>
        <div className="h-px mt-1 bg-cyan-400/20" />
      </div>

      <p className="text-gray-400 text-sm mb-6 px-4 md:px-16 max-w-md">
        Explore os 12 universos dos agentes canônicos do MENTE.AI.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-4 md:px-16 max-w-6xl mx-auto">
        {allAgents.map((agent) => (
          <UniverseCard key={agent.id} agent={agent} />
        ))}
      </div>
    </section>
  );
}
