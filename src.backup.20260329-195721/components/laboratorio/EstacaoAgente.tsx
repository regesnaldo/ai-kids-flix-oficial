"use client";

import Image from "next/image";
import { ChevronRight, Info } from "lucide-react";

import type { Agent } from "@/data/agents";
import HologramaCodigo from "@/components/laboratorio/HologramaCodigo";

interface EstacaoAgenteProps {
  agent: Agent;
  onOpen: (agent: Agent) => void;
}

export default function EstacaoAgente({ agent, onOpen }: EstacaoAgenteProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(agent)}
      className="group relative w-full text-left"
      aria-label={`Abrir estação do agente ${agent.technicalName}`}
    >
      <article className="relative h-full overflow-hidden rounded-2xl border border-purple-400/30 bg-gradient-to-b from-[#0f1a34] via-[#0a1327] to-[#060910] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/65 hover:shadow-[0_14px_34px_rgba(6,182,212,0.22)]">
        <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-cyan-500/25 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-purple-500/25 blur-2xl" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              Estacao #{agent.discoveryOrder}
            </p>
            <h3 className="mt-1 truncate text-lg font-bold text-white">
              {agent.technicalName}
            </h3>
            <p className="text-sm text-cyan-200">&quot;{agent.nickname}&quot;</p>
          </div>
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/15">
            <Image
              src={agent.imageUrl}
              alt={agent.technicalName}
              fill
              sizes="56px"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>

        <p className="mt-3 line-clamp-2 text-xs text-gray-300">{agent.description}</p>

        <div className="mt-4">
          <HologramaCodigo />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] text-gray-200">
            <Info className="h-3 w-3" />
            Mentor: {agent.nickname}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-cyan-200">
            Abrir experimento
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </article>
    </button>
  );
}
