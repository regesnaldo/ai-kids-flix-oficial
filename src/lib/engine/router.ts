import type { Archetype, UserProfile } from "./profiler";

interface RouteResult {
  nextAgent: string;
  reason: string;
  confidence: number;
}

const ROUTE_MAP: Record<Archetype, { primary: string; secondary?: string }> = {
  analytical: { primary: "nexus", secondary: "axiom" },
  rebel: { primary: "kaos", secondary: "ethos" },
  paralyzed: { primary: "volt" },
  empathetic: { primary: "terra", secondary: "lyra" },
  strategic: { primary: "stratos" },
  creative: { primary: "prism", secondary: "aurora" },
};

export function routeUser(profile: UserProfile, userText?: string): RouteResult {
  const route = ROUTE_MAP[profile.archetype] ?? ROUTE_MAP.analytical;
  const keywordMatch = matchByKeywords(userText);
  if (keywordMatch) return keywordMatch;
  return {
    nextAgent: route.primary,
    reason: `Perfil ${profile.archetype} detectado — roteado para ${route.primary}`,
    confidence: 0.8,
  };
}

function matchByKeywords(text?: string): RouteResult | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  const keywords: Record<string, { nextAgent: string; reason: string; confidence: number }> = {
    "triste": { nextAgent: "terra", reason: "Palavra-chave: tristeza", confidence: 0.7 },
    "ansioso": { nextAgent: "terra", reason: "Palavra-chave: ansiedade", confidence: 0.7 },
    "com raiva": { nextAgent: "kaos", reason: "Palavra-chave: raiva", confidence: 0.7 },
    "feliz": { nextAgent: "lyra", reason: "Palavra-chave: felicidade", confidence: 0.7 },
    "nao entendo": { nextAgent: "nexus", reason: "Palavra-chave: dúvida", confidence: 0.8 },
    "como funciona": { nextAgent: "axiom", reason: "Palavra-chave: explicação", confidence: 0.8 },
    "quero criar": { nextAgent: "aurora", reason: "Palavra-chave: criação", confidence: 0.7 },
    "preciso decidir": { nextAgent: "stratos", reason: "Palavra-chave: decisão", confidence: 0.7 },
    "engracado": { nextAgent: "janus", reason: "Palavra-chave: humor", confidence: 0.7 },
    "ética": { nextAgent: "ethos", reason: "Palavra-chave: ética", confidence: 0.9 },
    "moral": { nextAgent: "ethos", reason: "Palavra-chave: moral", confidence: 0.8 },
    "segredo": { nextAgent: "cipher", reason: "Palavra-chave: segredo", confidence: 0.7 },
    "padrão": { nextAgent: "cipher", reason: "Palavra-chave: padrão", confidence: 0.7 },
    "energia": { nextAgent: "volt", reason: "Palavra-chave: energia", confidence: 0.7 },
    "motivacao": { nextAgent: "volt", reason: "Palavra-chave: motivação", confidence: 0.7 },
  };
  for (const [key, value] of Object.entries(keywords)) {
    if (lower.includes(key)) return value;
  }
  return null;
}
