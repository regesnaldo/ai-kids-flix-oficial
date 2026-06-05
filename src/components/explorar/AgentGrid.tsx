// ─── src/components/explorar/AgentGrid.tsx ──────────────────────────────────

"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { HomeAgent } from "@/data/mockAgents";

/* ─── Props ──────────────────────────────────────────────────────────────── */

interface AgentGridProps {
  agents: HomeAgent[];
}

/* ─── Agent Card ─────────────────────────────────────────────────────────── */

function AgentCard({ agent }: { agent: HomeAgent }) {
  return (
    <Link href={`/agentes/${agent.id}`} className="group block">
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.3 }}
        className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 hover:scale-[1.03] transition-all duration-300 group"
      >
        {/* Image */}
        <div className="aspect-square bg-slate-800 relative overflow-hidden">
          <img
            src={agent.image}
            alt={agent.name}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span
              className="inline-block px-2.5 py-1 text-[11px] font-bold text-white rounded-md"
              style={{ backgroundColor: agent.color }}
            >
              {agent.category}
            </span>
          </div>

          {/* Level badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2 py-0.5 text-[10px] font-medium text-slate-300 bg-slate-950/60 rounded-full border border-slate-700/50">
              {agent.level}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-bold text-white text-sm mb-1 truncate">
            {agent.name}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {agent.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

/* ─── Grid ───────────────────────────────────────────────────────────────── */

export default function AgentGrid({ agents }: AgentGridProps) {
  return (
    <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <AnimatePresence mode="popLayout">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
