export const translations = {
  dimensions: {
    philosophical: "Filosófica",
    emotional: "Emocional",
    creative: "Criativa",
    ethical: "Ética",
    social: "Social",
    spiritual: "Espiritual",
    intellectual: "Intelectual",
    practical: "Prática",
    aesthetic: "Estética",
    political: "Política",
    scientific: "Científica",
    mystical: "Mística",
  },
  levels: {
    primordial: "Primordial",
    mythic: "Mítico",
    archetypal: "Arquetípico",
    human: "Humano",
  },
  factions: {
    order: "Ordem",
    chaos: "Caos",
    balance: "Equilíbrio",
  },
  ui: {
    home: "Início",
    agents: "Agentes",
    laboratory: "Laboratório",
    explore: "Explorar",
    search: "Buscar agente por nome ou abordagem...",
    allDimensions: "Todas Dimensões",
    allLevels: "Todos Níveis",
    allFactions: "Todas Facções",
    showing: "Mostrando",
    of: "de",
    agentsCountLabel: "agentes",
  },
  badges: {
    "Mente Analítica": "Mente Analítica",
    "Coração Aberto": "Coração Aberto",
  },
} as const;

export function t(key: string): string {
  const keys = key.split(".");
  let value: any = translations;

  for (const k of keys) {
    value = value?.[k];
    if (!value) return key;
  }

  return String(value);
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

