"use client";

import AgentCard from "./AgentCard";
import { AgentFull } from "@/lib/agent-mapper";

interface AgentCarouselProps {
  agents: AgentFull[];
}

export default function AgentCarousel({ agents }: AgentCarouselProps) {
  if (!agents || agents.length === 0) return null;

  return (
    <div className="flex overflow-x-auto gap-4 scrollbar-hide scroll-smooth px-12 pb-4">
      {agents.map((agent) => (
        <div key={agent.id} className="flex-none w-[200px] md:w-[300px] transition-transform duration-300 hover:scale-105">
          <AgentCard agent={agent as any} />
        </div>
      ))}
    </div>
  );
}
