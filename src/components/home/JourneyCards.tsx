"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

type Journey = {
  id: string;
  agent: string;
  title: string;
  description: string;
  color: string;
  glowClass: string;
  borderClass: string;
  href: string;
};

const journeys: Journey[] = [
  {
    id: "nexus",
    agent: "NEXUS",
    title: "Fundamentos de IA",
    description: "Domine os conceitos essenciais da inteligência artificial com o guia primário do MENTE.AI.",
    color: "#00d4ff",
    glowClass: "shadow-[0_0_20px_rgba(0,212,255,0.4)]",
    borderClass: "border-cyan-400",
    href: "/universo/nexus",
  },
  {
    id: "volt",
    agent: "VOLT",
    title: "Redes Neurais",
    description: "Sinta a energia do backpropagation fluindo enquanto constrói redes neurais do zero.",
    color: "#8B5CF6",
    glowClass: "shadow-[0_0_20px_rgba(139,92,246,0.4)]",
    borderClass: "border-purple-500",
    href: "/universo/volt",
  },
  {
    id: "aurora",
    agent: "AURORA",
    title: "Criatividade com IA",
    description: "Explore espaços vetoriais e crie arte, música e narrativas com inteligência artificial.",
    color: "#EC4899",
    glowClass: "shadow-[0_0_20px_rgba(236,72,153,0.4)]",
    borderClass: "border-pink-500",
    href: "/universo/aurora",
  },
];

function JourneyCard({ journey }: { journey: Journey }) {
  return (
    <Link href={journey.href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="group relative flex-shrink-0 w-[280px] h-[200px] rounded-xl overflow-hidden cursor-pointer border transition-all duration-300 ease-out border-white/10 hover:border-current"
        style={{
          ["--hover-border" as string]: journey.color,
        }}
      >
        {/* Background image with blur */}
        <div className="absolute inset-0">
          <Image
            src={`/images/agentes/${journey.id}.png`}
            alt={journey.agent}
            fill
            className="object-cover blur-[8px] brightness-[0.35] scale-110 group-hover:brightness-[0.5] transition-all duration-500"
            sizes="280px"
            loading="lazy"
            quality={75}
          />
        </div>

        {/* Color overlay gradient */}
        <div
          className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-80"
          style={{
            background: `linear-gradient(135deg, ${journey.color}40, transparent 60%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-5">
          <span
            className="text-xs font-mono tracking-wider mb-2"
            style={{ color: journey.color }}
          >
            {journey.agent}
          </span>
          <h3
            className="text-lg font-bold text-white mb-1"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
          >
            {journey.title}
          </h3>
          <p
            className="text-xs text-gray-300 line-clamp-2"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
          >
            {journey.description}
          </p>
        </div>

        {/* Glow border on hover */}
        <div
          className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${journey.glowClass}`}
          style={{ boxShadow: `inset 0 0 30px ${journey.color}20` }}
        />
      </motion.div>
    </Link>
  );
}

export default function JourneyCards() {
  return (
    <section className="w-full">
      <div className="mb-4 px-4 md:px-16">
        <p className="font-mono text-[11px] text-cyan-400/60">// JORNADAS DE APRENDIZADO</p>
        <div className="h-px mt-1 bg-cyan-400/20" />
      </div>

      <div className="flex gap-4 overflow-x-auto px-4 md:px-16 pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", flexWrap: "nowrap" }}>
        {journeys.map((j) => (
          <JourneyCard key={j.id} journey={j} />
        ))}
      </div>
    </section>
  );
}
