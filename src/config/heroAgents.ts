import { getAgentImage } from "@/lib/getAgentImage";

export type HeroAgentPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface HeroAgentEntry {
  id: string;
  name: string;
  image: string;
  accentColor: string;
  position: HeroAgentPosition;
}

export const heroAgents: HeroAgentEntry[] = [
  { id: "nexus",  name: "NEXUS",  image: getAgentImage("nexus"),  accentColor: "#00D9FF", position: "top-left" },
  { id: "axiom",  name: "AXIOM",  image: getAgentImage("axiom"),  accentColor: "#3B82F6", position: "top-right" },
  { id: "kaos",   name: "KAOS",   image: getAgentImage("kaos"),   accentColor: "#EF4444", position: "bottom-left" },
  { id: "cipher", name: "CIPHER", image: getAgentImage("cipher"), accentColor: "#10B981", position: "bottom-right" },
];
