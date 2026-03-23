"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Bell, Book, BookOpen, Brain, Building, Cpu, Database, Eye, GraduationCap, HardDrive, Languages, Layers, MapPin, Network, Scale, Scissors, Search, Sparkles, StickyNote } from "lucide-react";
import type { Agent } from "@/data/agents";

const iconMap = {
  Bell,
  Book,
  BookOpen,
  Brain,
  Building,
  Cpu,
  Database,
  Eye,
  GraduationCap,
  HardDrive,
  Languages,
  Layers,
  MapPin,
  Network,
  Scale,
  Scissors,
  Search,
  Sparkles,
  StickyNote,
};

type AgentCardProps = {
  agent: Agent;
};

export default function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();
  const Icon = iconMap[agent.icon as keyof typeof iconMap] ?? Brain;

  return (
    <article
      className="group relative aspect-video w-full overflow-hidden rounded-2xl border-2 border-[#9333ea] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] p-6 text-white shadow-[0_10px_40px_rgba(147,51,234,0.3)] transition-all duration-300 ease-out hover:scale-[1.02] hover:border-[#e94560] hover:shadow-[0_20px_60px_rgba(233,69,96,0.5)]"
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-gray-400">{agent.category}</span>
        <Icon className="h-12 w-12 text-purple-400 transition-colors group-hover:text-pink-400 sm:h-14 sm:w-14" />
      </div>

      <h3 className="text-2xl font-bold text-white sm:text-3xl">
        {agent.technicalName} "{agent.nickname}"
      </h3>

      <div className="my-4 h-px bg-gradient-to-r from-purple-600 to-blue-600 opacity-60" />

      <p className="mb-5 line-clamp-3 text-base text-gray-300">{agent.description}</p>

      <div className="mb-5 flex gap-2">
        <span className="rounded-full border border-purple-500 bg-purple-600/30 px-2 py-1 text-xs text-purple-200">{agent.dimension}</span>
        <span className="rounded-full border border-blue-500 bg-blue-600/30 px-2 py-1 text-xs text-blue-200">{agent.level}</span>
      </div>

      <button
        type="button"
        onClick={() => router.push(`/laboratorio/simulador?agent=${agent.id}`)}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:brightness-125 hover:shadow-[0_0_30px_rgba(147,51,234,0.6)]"
      >
        Experimentar
        <ArrowRight className="h-4 w-4" />
      </button>
    </article>
  );
}
