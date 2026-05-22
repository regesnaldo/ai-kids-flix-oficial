"use client";

import { memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Journey = {
  id: string;
  agentId: string;
  agent: string;
  title: string;
  description: string;
  color: string;
  level: string;
  href: string;
};

const journeys: Journey[] = [
  {
    id: "fundamentos",
    agentId: "nexus",
    agent: "NEXUS",
    title: "Fundamentos de IA",
    description: "Domine os conceitos essenciais da inteligência artificial.",
    color: "#00d4ff",
    level: "Iniciante",
    href: "/universo/nexus",
  },
  {
    id: "criatividade",
    agentId: "kaos",
    agent: "KAOS",
    title: "Criatividade Radical",
    description: "Explore o caos criativo e como a IA pode gerar inovação.",
    color: "#EF4444",
    level: "Intermediário",
    href: "/universo/kaos",
  },
  {
    id: "etica",
    agentId: "ethos",
    agent: "ETHOS",
    title: "IA Ética",
    description: "O que é certo e errado para uma inteligência artificial?",
    color: "#F59E0B",
    level: "Avançado",
    href: "/universo/ethos",
  },
  {
    id: "estrategia",
    agentId: "axiom",
    agent: "AXIOM",
    title: "Estratégia",
    description: "Use dados e precisão para tomar decisões com IA.",
    color: "#0EA5E9",
    level: "Intermediário",
    href: "/universo/axiom",
  },
  {
    id: "futuro",
    agentId: "cipher",
    agent: "CIPHER",
    title: "Futuro da IA",
    description: "Descubra os padrões ocultos que moldarão o amanhã.",
    color: "#10B981",
    level: "Avançado",
    href: "/universo/cipher",
  },
];

const JourneyCard = memo(function JourneyCard({ journey }: { journey: Journey }) {
  return (
    <Link href={journey.href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group relative flex-shrink-0 w-[280px] overflow-hidden cursor-pointer border border-white/10 hover:border-current rounded-xl transition-all duration-300 ease-out"
        style={{ height: 220 }}
      >
        {/* Agent background image */}
        <div className="absolute inset-0">
          <img
            src={`/images/agentes/${journey.agentId}.png`}
            alt={journey.agent}
            className="w-full h-full object-cover brightness-[0.3] scale-110 group-hover:brightness-[0.45] transition-all duration-500"
            loading="lazy"
            decoding="async"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder.svg"; }}
          />
        </div>

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.95) 100%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-5">
          {/* Level badge */}
          <span
            className="self-start text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full border mb-2"
            style={{
              color: journey.color,
              borderColor: `${journey.color}40`,
              background: `${journey.color}15`,
            }}
          >
            {journey.level}
          </span>
          <h3
            className="text-base font-semibold text-white mb-1"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
          >
            {journey.title}
          </h3>
          <p
            className="text-[11px] text-gray-300 line-clamp-2"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}
          >
            {journey.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
});

export default function JourneyCards() {
  return (
    <section className="w-full py-8">
      <div className="mb-4 px-4 md:px-16">
        <p className="font-mono text-[11px] text-cyan-400/60 tracking-wider uppercase">
          // JORNADAS DE APRENDIZADO
        </p>
        <div className="h-px mt-1 bg-cyan-400/20" />
      </div>

      <div
        className="flex gap-4 overflow-x-auto px-4 md:px-16 pb-4"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          flexWrap: "nowrap",
        }}
      >
        {journeys.map((j) => (
          <JourneyCard key={j.id} journey={j} />
        ))}
      </div>
    </section>
  );
}
