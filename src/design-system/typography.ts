/**
 * ─── DESIGN SYSTEM — Typography System ────────────────────────────────────────
 *
 * Type hierarchy with sci-fi nomenclature mapped to clearance levels.
 * Higher clearance = higher information density = smaller, tighter, more data.
 *
 * Usage:
 *   import { typography } from "@/design-system/typography";
 *   <span style={typography.broadcast.style}>TRANSMISSÃO PÚBLICA</span>
 *   <code style={typography.restricted.style}>SYS:ERR_0x7F</code>
 */

// ─── FONT FAMILIES ────────────────────────────────────────────────────────────

const fontFamily = {
  display: '"Space Grotesk", "Plus Jakarta Sans", system-ui, sans-serif',
  body: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
} as const;

// ─── TYPE LEVELS ──────────────────────────────────────────────────────────────

interface TypeLevel {
  clearance: string;           // Portuguese clearance label
  density: "baixa" | "média" | "alta" | "crítica";
  family: string;
  size: string;
  weight: string;
  lineHeight: string;
  letterSpacing: string;
  textTransform?: string;
  usage: string;               // Where this level is used
}

const broadcast: TypeLevel = {
  clearance: "SUPERFÍCIE",
  density: "baixa",
  family: fontFamily.display,
  size: "clamp(1.5rem, 4vw, 2.5rem)",
  weight: "700",
  lineHeight: "1.2",
  letterSpacing: "-0.02em",
  usage: "Títulos de seção, headers de missão, nomes de agentes",
};

const operational: TypeLevel = {
  clearance: "OPERACIONAL",
  density: "média",
  family: fontFamily.body,
  size: "1rem",
  weight: "400",
  lineHeight: "1.7",
  letterSpacing: "0",
  usage: "Corpo de texto, respostas de agentes, conteúdo de artigo",
};

const operationalMono: TypeLevel = {
  clearance: "OPERACIONAL",
  density: "média",
  family: fontFamily.mono,
  size: "0.875rem",
  weight: "400",
  lineHeight: "1.6",
  letterSpacing: "0.01em",
  usage: "Logs do sistema, dados de scan, blocos de código",
};

const classified: TypeLevel = {
  clearance: "PROFUNDO",
  density: "alta",
  family: fontFamily.display,
  size: "0.9375rem",
  weight: "600",
  lineHeight: "1.4",
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  usage: "Rótulos de sistema, headers de card, tags de classificação",
};

const classifiedLabel: TypeLevel = {
  clearance: "PROFUNDO",
  density: "alta",
  family: fontFamily.mono,
  size: "0.75rem",
  weight: "500",
  lineHeight: "1.3",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  usage: "Labels de clearance, status HUD, timestamps",
};

const restricted: TypeLevel = {
  clearance: "RESTRITO",
  density: "crítica",
  family: fontFamily.mono,
  size: "0.6875rem",
  weight: "500",
  lineHeight: "1.2",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  usage: "Alertas críticos, códigos de erro, dados de diagnóstico",
};

const signal: TypeLevel = {
  clearance: "SINAL",
  density: "alta",
  family: fontFamily.mono,
  size: "0.8125rem",
  weight: "400",
  lineHeight: "1.4",
  letterSpacing: "0.04em",
  usage: "Mensagens de estado do sistema: SCANNING..., PROCESSANDO..., SÍNTESE CONCLUÍDA",
};

const micro: TypeLevel = {
  clearance: "SUPERFÍCIE",
  density: "alta",
  family: fontFamily.mono,
  size: "0.625rem",
  weight: "400",
  lineHeight: "1.2",
  letterSpacing: "0.05em",
  usage: "Metadados, contadores, informação auxiliar mínima",
};

// ─── TYPE LEVEL MAP ───────────────────────────────────────────────────────────

export const typography = {
  broadcast,
  operational,
  operationalMono,
  classified,
  classifiedLabel,
  restricted,
  signal,
  micro,
  fontFamily,
} as const;

// ─── HELPER: CSS-IN-JS STYLE GENERATION ───────────────────────────────────────

/**
 * Converte um TypeLevel em objeto de estilo React.
 * Uso: <span style={toStyle(typography.classified)}>PROFUNDO</span>
 */
export function toStyle(level: TypeLevel): React.CSSProperties {
  return {
    fontFamily: level.family,
    fontSize: level.size,
    fontWeight: level.weight as React.CSSProperties["fontWeight"],
    lineHeight: level.lineHeight,
    letterSpacing: level.letterSpacing,
    textTransform: level.textTransform as React.CSSProperties["textTransform"],
  };
}

/**
 * Converte um TypeLevel em string de classe CSS customizada.
 * Útil para integração com Tailwind ou CSS Modules.
 */
export function toClassName(level: TypeLevel): string {
  return `type-${level.clearance.toLowerCase()}-${level.density}`;
}

// ─── RESPONSIVE SCALING ───────────────────────────────────────────────────────

/**
 * Regras de escala responsiva para cada nível tipográfico.
 * Broadcast escala mais agressivamente em telas grandes.
 * Restricted permanece fixo (informação crítica não pode encolher).
 */
export const responsiveRules = {
  broadcast: {
    minWidth: "320px",
    maxWidth: "1440px",
    minSize: "1.25rem",
    maxSize: "2.5rem",
  },
  operational: {
    minWidth: "320px",
    maxWidth: "1440px",
    minSize: "0.9375rem",
    maxSize: "1rem",
  },
  classified: {
    minWidth: "320px",
    maxWidth: "1440px",
    minSize: "0.8125rem",
    maxSize: "0.9375rem",
  },
  restricted: {
    fixed: "0.6875rem", // Nunca escala — dados críticos não mudam
  },
} as const;

// ─── CLEARANCE → TYPE LEVEL MAPPING ───────────────────────────────────────────

/**
 * Mapeia um clearance level (de tokens.access) para o TypeLevel apropriado.
 */
export function clearanceToTypeLevel(
  clearance: "surface" | "deep" | "core" | "restricted"
): TypeLevel {
  switch (clearance) {
    case "surface":
      return operational;
    case "deep":
      return classified;
    case "core":
      return classifiedLabel;
    case "restricted":
      return restricted;
  }
}

export type TypeLevelName =
  | "broadcast"
  | "operational"
  | "operationalMono"
  | "classified"
  | "classifiedLabel"
  | "restricted"
  | "signal"
  | "micro";
