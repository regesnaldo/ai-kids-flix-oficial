"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Agent } from "@/data/agents";

type AgentCardCompactProps = {
  agent: Agent;
};

export default function AgentCardCompact({ agent }: AgentCardCompactProps) {
  const router = useRouter();

  return (
    <article className="group relative w-full max-w-[280px] overflow-hidden rounded-xl border-2 border-purple-600 bg-gradient-to-b from-[#1a1a2e] to-[#0f3460] transition-all duration-300 hover:scale-[1.03] hover:border-pink-500 hover:shadow-[0_0_24px_rgba(233,69,96,0.45)]">
      <div className="relative h-[240px] w-full overflow-hidden">
        <Image
          src={agent.imageUrl}
          alt={agent.technicalName}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 640px) 150px, (max-width: 768px) 200px, (max-width: 1280px) 250px, 280px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-[#1a1a2e]/35 to-transparent" />
        <span className="absolute right-2 top-2 rounded-md bg-purple-600/85 px-2 py-1 text-[10px] font-semibold text-white">
          {agent.level}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-purple-400">Descoberta #{agent.discoveryOrder}</p>
        <h3 className="mt-1 text-lg font-bold leading-tight text-white">
          {agent.technicalName}
          <span className="block text-sm font-medium text-gray-300">"{agent.nickname}"</span>
        </h3>

        <button
          type="button"

          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-2 text-sm font-semibold text-white transition-all duration-300 hover:brightness-125"
        >
          Experimentar
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
