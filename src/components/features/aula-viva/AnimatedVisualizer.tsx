"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { useMemo } from "react";
import { NexusScene } from "@/components/universe/NexusScene";
import { VoltScene } from "@/components/scenes/VoltScene";
import { StratosScene } from "@/components/scenes/StratosScene";
import { KaosScene } from "@/components/scenes/KaosScene";
import { EthosScene } from "@/components/scenes/EthosScene";
import { LyraScene } from "@/components/scenes/LyraScene";
import { AuroraScene } from "@/components/scenes/AuroraScene";
import { TerraScene } from "@/components/scenes/TerraScene";
import { AxiomScene } from "@/components/scenes/AxiomScene";
import { CipherScene } from "@/components/scenes/CipherScene";
import { JanusScene } from "@/components/scenes/JanusScene";
import { PrismScene } from "@/components/scenes/PrismScene";

export type UniverseId =
  | "NEXUS"
  | "VOLT"
  | "STRATOS"
  | "KAOS"
  | "ETHOS"
  | "LYRA"
  | "AURORA"
  | "TERRA"
  | "AXIOM"
  | "CIPHER"
  | "JANUS"
  | "PRISM";

// Kept for backward compatibility with existing callers.
export interface VisualizerBlock {
  id: string;
  title: string;
  concept: string;
  type: "network" | "flow" | "layers" | "particles" | "spiral" | "connections";
  data?: unknown;
  universe?: UniverseId;
}

interface AnimatedVisualizerProps {
  block: VisualizerBlock;
  isActive: boolean;
  activeUniverse?: UniverseId;
  fillContainer?: boolean;
  showHud?: boolean;
}

const DEFAULT_UNIVERSE: UniverseId = "NEXUS";

const universeDescriptors: Record<UniverseId, { title: string; tint: string }> = {
  NEXUS: { title: "Cosmic data particles", tint: "linear-gradient(to bottom right, rgba(59,130,246,0.3), rgba(139,92,246,0.2))" },
  VOLT: { title: "Electric arena", tint: "linear-gradient(to bottom right, rgba(251,191,36,0.3), rgba(249,115,22,0.2))" },
  STRATOS: { title: "Infinite chess tower", tint: "linear-gradient(to bottom right, rgba(52,211,153,0.25), rgba(14,165,233,0.2))" },
  KAOS: { title: "Collapsing fragmented space", tint: "linear-gradient(to bottom right, rgba(244,63,94,0.25), rgba(217,70,239,0.2))" },
  ETHOS: { title: "Infinite floating library", tint: "linear-gradient(to bottom right, rgba(6,182,212,0.25), rgba(99,102,241,0.2))" },
  LYRA: { title: "Synesthesia color flow", tint: "linear-gradient(to bottom right, rgba(236,72,153,0.25), rgba(168,85,247,0.2))" },
  AURORA: { title: "Perpetual horizon skybox", tint: "linear-gradient(to bottom right, rgba(56,189,248,0.25), rgba(20,184,166,0.2))" },
  TERRA: { title: "Organic growing forest", tint: "linear-gradient(to bottom right, rgba(163,230,53,0.25), rgba(34,197,94,0.2))" },
  AXIOM: { title: "Holographic data lab", tint: "linear-gradient(to bottom right, rgba(34,211,238,0.25), rgba(59,130,246,0.2))" },
  CIPHER: { title: "Procedural code maze", tint: "linear-gradient(to bottom right, rgba(129,140,248,0.25), rgba(139,92,246,0.2))" },
  JANUS: { title: "Situational humor visuals", tint: "linear-gradient(to bottom right, rgba(253,224,71,0.25), rgba(236,72,153,0.2))" },
  PRISM: { title: "Multi-viewport reality split", tint: "linear-gradient(to bottom right, rgba(139,92,246,0.25), rgba(34,211,238,0.2))" },
};

function UniverseScene({ universe }: { universe: UniverseId }) {
  switch (universe) {
    case "NEXUS":
      return <NexusScene />;
    case "VOLT":
      return <VoltScene />;
    case "STRATOS":
      return <StratosScene />;
    case "KAOS":
      return <KaosScene />;
    case "ETHOS":
      return <EthosScene />;
    case "LYRA":
      return <LyraScene />;
    case "AURORA":
      return <AuroraScene />;
    case "TERRA":
      return <TerraScene />;
    case "AXIOM":
      return <AxiomScene />;
    case "CIPHER":
      return <CipherScene />;
    case "JANUS":
      return <JanusScene />;
    case "PRISM":
      return <PrismScene />;
    default:
      return <NexusScene />;
  }
}

export function extractConceptFromPrompt(prompt: string): string | null {
  const match = prompt.match(/\bshow me\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export function isShowMePrompt(prompt: string): boolean {
  return /\bshow me\s+.+/i.test(prompt);
}

const conceptVisualizers: Record<string, VisualizerBlock["type"]> = {
  neuron: "network",
  rede: "layers",
  network: "network",
  learn: "flow",
  aprend: "flow",
  gerar: "spiral",
  generate: "spiral",
  conectar: "connections",
  connect: "connections",
  dados: "particles",
  data: "particles",
};

export function getVisualizerForConcept(concept: string): VisualizerBlock["type"] {
  const lowerConcept = concept.toLowerCase();
  for (const [key, value] of Object.entries(conceptVisualizers)) {
    if (lowerConcept.includes(key)) return value;
  }
  return "network";
}

export function inferUniverseForConcept(concept: string): UniverseId {
  const input = concept.toLowerCase();
  if (/(raio|energia|eletric|lightning|power)/.test(input)) return "VOLT";
  if (/(xadrez|estrateg|strategy|tower)/.test(input)) return "STRATOS";
  if (/(caos|fragment|colapso|entropy)/.test(input)) return "KAOS";
  if (/(etica|ethic|biblioteca|library)/.test(input)) return "ETHOS";
  if (/(musica|audio|som|synesthesia|sinestesia)/.test(input)) return "LYRA";
  if (/(aurora|sky|horizon|clima)/.test(input)) return "AURORA";
  if (/(natureza|floresta|plant|terra)/.test(input)) return "TERRA";
  if (/(lab|dados|hologra|axiom|analytics)/.test(input)) return "AXIOM";
  if (/(codigo|code|maze|cipher|algoritmo)/.test(input)) return "CIPHER";
  if (/(humor|comedia|janus|ironia)/.test(input)) return "JANUS";
  if (/(prism|viewport|reality|multiverso)/.test(input)) return "PRISM";
  return DEFAULT_UNIVERSE;
}

export function AnimatedVisualizer({
  block,
  isActive,
  activeUniverse,
  fillContainer = false,
  showHud = true,
}: AnimatedVisualizerProps) {
  const universe = block.universe ?? activeUniverse ?? DEFAULT_UNIVERSE;
  const universeMeta = universeDescriptors[universe];

  const lyraTintStyle = useMemo(() => {
    const pulse = Date.now() % 10000;
    const hue = (pulse / 10000) * 360;
    return universe === "LYRA" ? { filter: `hue-rotate(${hue}deg)` } : undefined;
  }, [universe]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key={block.id}
          initial={{ opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.985 }}
          transition={{ duration: 0.45 }}
          className={`relative w-full overflow-hidden bg-transparent ${fillContainer ? "h-full rounded-none border-0" : "h-64 md:h-96 rounded-2xl border border-white/10"}`}
          style={lyraTintStyle}
        >
          <div className="absolute inset-0 pointer-events-none z-0"
               style={{ backgroundImage: universeMeta.tint }} />

          <Canvas
            camera={{ position: [0, 0, 18], fov: 45 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1,
              pointerEvents: "none",
              background: "transparent",
            }}
          >
            <UniverseScene universe={universe} />
            {universe === "LYRA" && (
              <Sparkles count={160} scale={24} size={3} speed={0.8} color="#EC4899" />
            )}
          </Canvas>

          {showHud && (
            <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between gap-2 rounded-xl border border-white/15 bg-black/45 px-4 py-2 backdrop-blur-md">
              <div className="min-w-0">
                <p className="truncate text-xs uppercase tracking-wider text-cyan-300/90">{universe} Universe</p>
                <p className="truncate text-sm text-white/90">{universeMeta.title}</p>
              </div>
              <span className="max-w-[45%] truncate rounded-full border border-white/20 px-3 py-1 text-xs text-white/80">
                {block.concept}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AnimatedVisualizer;
