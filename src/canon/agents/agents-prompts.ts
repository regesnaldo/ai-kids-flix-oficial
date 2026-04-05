import type { AgentDefinition } from "./types.ts";
import { ALL_AGENTS } from "./all-agents.ts";

export interface VisualPrompt {
  agentId: string;
  prompt: string;
  negativePrompt?: string;
  style: string;
  aspectRatio: string;
}

const styleByDimension: Record<AgentDefinition["dimension"], string> = {
  philosophical: "mystical philosopher, ethereal glow, ancient wisdom symbols, cosmic background",
  emotional: "flowing energy, heart motifs, soft gradients, dreamy atmosphere",
  creative: "vibrant colors, abstract shapes, artistic brushstrokes, imaginative composition",
  ethical: "balanced scales, golden light, temple architecture, serene expression",
  social: "interconnected nodes, warm tones, community symbols, harmonious layout",
  spiritual: "meditation pose, lotus flowers, aura effects, transcendent lighting",
  intellectual: "geometric patterns, book motifs, scholarly atmosphere, structured composition",
  practical: "tool symbols, earthy tones, grounded posture, functional design",
  aesthetic: "artistic elegance, refined details, museum-quality lighting, sophisticated palette",
  political: "power symbols, bold contrasts, authoritative stance, dramatic shadows",
  scientific: "molecular structures, laboratory elements, precise details, analytical composition",
  mystical: "arcane symbols, magical effects, otherworldly glow, mysterious atmosphere",
};

function compact(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

export function generateVisualPrompt(agent: AgentDefinition): VisualPrompt {
  const baseStyle = styleByDimension[agent.dimension] || "cinematic digital art";
  const mainPrompt = compact(
    `Portrait of ${agent.name}. ${agent.visualPrompt}. ${baseStyle}. digital art, cinematic lighting, high detail, professional illustration, mystical atmosphere, masterpiece, 8k.`
  );
  const negativePrompt = "blurry, low quality, distorted, watermark, text, signature, ugly, deformed";

  return {
    agentId: agent.id,
    prompt: mainPrompt,
    negativePrompt,
    style: "cinematic-digital-art",
    aspectRatio: "1:1",
  };
}

export const AGENTS_PROMPTS: VisualPrompt[] = ALL_AGENTS.map(generateVisualPrompt);

export function getPromptByAgentId(agentId: string): VisualPrompt | undefined {
  return AGENTS_PROMPTS.find((p) => p.agentId === agentId);
}

