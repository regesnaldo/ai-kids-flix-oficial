"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ParticleConcept = {
  label: string;
  description: string;
  agent: string;
  agentId: string;
  seasonSlug: "fundamentos" | "linguagens" | "criacao" | "inovacao";
};

const PARTICLE_CONCEPTS: ParticleConcept[] = [
  {
    label: "Contexto",
    description: "Memória da conversa. O caderninho que lembra tudo.",
    agent: "Caderninho",
    agentId: "9",
    seasonSlug: "linguagens",
  },
  {
    label: "Embeddings",
    description: "Tradução de significado. Entende o que você quer dizer.",
    agent: "Tradutor Universal",
    agentId: "7",
    seasonSlug: "linguagens",
  },
  {
    label: "Inferencia",
    description: "Predição de respostas. O oráculo das probabilidades.",
    agent: "Oraculo",
    agentId: "12",
    seasonSlug: "criacao",
  },
  {
    label: "Raciocinio",
    description: "Conexão de pistas. O detetive das ideias.",
    agent: "Detetive",
    agentId: "13",
    seasonSlug: "criacao",
  },
  {
    label: "Atencao",
    description: "Foco no essencial. A lanterna mental que guia a leitura.",
    agent: "Lanterna Mental",
    agentId: "10",
    seasonSlug: "linguagens",
  },
  {
    label: "Vetores",
    description: "Posição das ideias. O GPS mental da navegação.",
    agent: "GPS Mental",
    agentId: "19",
    seasonSlug: "inovacao",
  },
];

type ParticleFieldProps = {
  interactive?: boolean;
  count?: number;
};

export default function ParticleField({
  interactive = false,
  count = 50,
}: ParticleFieldProps) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const concept = PARTICLE_CONCEPTS[i % PARTICLE_CONCEPTS.length];
        const jitterX = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
        const jitterY = Math.abs(Math.sin(i * 78.233) * 12345.6789) % 1;
        return {
          id: i,
          concept,
          left: (6 + jitterX * 88).toFixed(4),
          top: (8 + jitterY * 82).toFixed(4),
          size: 8 + (i % 4),
          delay: (i % 9) * 0.3,
          duration: 6 + (i % 5) * 0.5,
          color: i % 2 === 0 ? "#9333ea" : "#06b6d4",
        };
      }),
    [count],
  );

  const navigateToConcept = (concept: ParticleConcept) => {
    if (!interactive) {
      return;
    }

    router.push(
      `/laboratorio/biblioteca?season=${concept.seasonSlug}&agent=${concept.agentId}`,
    );
  };

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.button
          key={particle.id}
          type="button"
          onMouseEnter={() => interactive && setHoveredIndex(particle.id)}
          onMouseLeave={() => interactive && setHoveredIndex(null)}
          onClick={(event) => {
            event.stopPropagation();
            navigateToConcept(particle.concept);
          }}
          className="particle pointer-events-auto absolute rounded-full z-[60]"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${Math.max(12, particle.size + 4)}px`,
            height: `${Math.max(12, particle.size + 4)}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 15px ${particle.color}`,
            cursor: interactive ? "pointer" : "default",
          }}
          animate={{ y: [0, -10, 0], opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
          whileHover={{ scale: 1.5, opacity: 1, transition: { duration: 0.2 } }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          aria-label={interactive ? `Explorar ${particle.concept.label}` : "Particula"}
        >
          {interactive && hoveredIndex === particle.id ? (
            <div className="absolute -top-3 left-1/2 z-[70] w-48 -translate-x-1/2 -translate-y-full rounded-lg border border-cyan-400/35 bg-[#0b1020]/95 p-2 text-left shadow-[0_12px_30px_rgba(6,182,212,0.35)]">
              <p className="text-xs font-semibold text-cyan-300">{particle.concept.label}</p>
              <p className="mt-1 text-[11px] text-gray-300">{particle.concept.description}</p>
              <p className="mt-1 text-[11px] text-purple-300">
                Guia: {particle.concept.agent}
              </p>
              <p className="mt-1 text-[10px] text-gray-500">Clique para explorar</p>
            </div>
          ) : null}
        </motion.button>
      ))}
    </div>
  );
}

