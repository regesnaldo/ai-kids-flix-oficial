"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { allAgents, type HomeAgent } from "@/data/all-agents";

const GLOW_MAP: Record<string, string> = {
  nexus: "ring-cyan-400 shadow-[0_0_15px_rgba(0,212,255,0.3)]",
  volt: "ring-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]",
  aurora: "ring-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]",
  kaos: "ring-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]",
  cipher: "ring-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]",
  lyra: "ring-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.3)]",
  axiom: "ring-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]",
  stratos: "ring-slate-400 shadow-[0_0_15px_rgba(100,116,139,0.3)]",
  terra: "ring-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]",
  prism: "ring-purple-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]",
  janus: "ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
  ethos: "ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
};

function UniverseCard({ agent }: { agent: HomeAgent }) {
  const glow = GLOW_MAP[agent.id] ?? "ring-cyan-400";

  return (
    <Link href={`/universo/${agent.id}`}>
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="group relative aspect-[4/5] rounded-xl overflow-hidden cursor-pointer border border-white/5"
      >
        {/* Agent image fill */}
        <Image
          src={`/images/agentes/${agent.id}.png`}
          alt={agent.name}
          fill
          className="object-cover brightness-[0.6] group-hover:brightness-[0.85] transition-all duration-400"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          loading="lazy"
          quality={75}
        />

        {/* Dark gradient overlay from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

        {/* Colored ring on hover */}
        <div className={`absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:${glow} transition-all duration-300 pointer-events-none`}
          style={{
            boxShadow: "none",
          }}
        />

        {/* Text content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3
            className="text-sm font-bold text-white leading-tight mb-0.5"
            style={{ textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}
          >
            {agent.name}
          </h3>
          <p className="text-[11px] text-gray-300 line-clamp-2 leading-tight"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}>
            {agent.category}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function UniversesGrid() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full px-4 md:px-16 mb-12"
    >
      <div className="mb-4">
        <p className="font-mono text-[11px] text-cyan-400/60">// 12 UNIVERSOS</p>
        <div className="h-px mt-1 bg-cyan-400/20" />
      </div>

      <p className="text-gray-400 text-sm mb-6 max-w-md">
        Explore os 12 universos 3D dos agentes canônicos do MENTE.AI.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 max-w-6xl">
        {allAgents.map((agent) => (
          <UniverseCard key={agent.id} agent={agent} />
        ))}
      </div>
    </motion.section>
  );
}
