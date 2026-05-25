/**
 * ─── DESIGN SYSTEM — Semantic Token System ────────────────────────────────────
 *
 * Every color, spacing, radius, and shadow carries cognitive meaning.
 * No decoration. No generic "primary" / "secondary". Every value maps
 * to a SYSTEM STATE, ACCESS LEVEL, DISCOVERY TIER, or DANGER ZONE.
 *
 * Usage: import { tokens } from "@/design-system/tokens";
 *         tokens.color.system.scanning → usado no ScannerRing state="scanning"
 */

// ─── COLOR: SYSTEM STATES ─────────────────────────────────────────────────────

const system = {
  idle: "#0a0a1a",        // Cyber-black — vácuo, silêncio, espera
  scanning: "#0f0f2d",    // Deep-void com leve elevação — análise em curso
  processing: "#141432",  // Cyber-panel com tensão — pipeline ativo
  synthesis: "#1a1a3e",   // Cyber-surface — consolidando dados
  complete: "#162440",    // Tom azulado — missão concluída, estabilidade
  error: "#1a0f14",       // Tom avermelhado escuro — falha detectada
} as const;

// ─── COLOR: DISCOVERY TIERS ───────────────────────────────────────────────────

const discovery = {
  tier1: "#a855f7",  // Pulse-purple — descoberta nível 1 (básica, comum)
  tier2: "#7c3aed",  // Purple intenso — descoberta nível 2 (intermediária)
  tier3: "#6d28d9",  // Purple profundo — descoberta nível 3 (rara, avançada)
} as const;

// ─── COLOR: ACCESS CLEARANCE ──────────────────────────────────────────────────

const access = {
  surface: "#94a3b8",    // Slate-400 — acesso público, superfície
  deep: "#00f0ff",       // Neon-cyan — acesso intermediário, profundo
  core: "#a855f7",       // Pulse-purple — acesso avançado, núcleo
  restricted: "#ef4444", // Danger-red — acesso restrito, autorização necessária
} as const;

// ─── COLOR: DANGER LEVELS ─────────────────────────────────────────────────────

const danger = {
  low: "#f59e0b",      // Signal-amber — alerta baixo, atenção
  elevated: "#f97316",  // Orange — alerta elevado, cuidado
  critical: "#ef4444",  // Danger-red — alerta crítico, falha iminente
} as const;

// ─── COLOR: SIGNAL STRENGTH ───────────────────────────────────────────────────

const signal = {
  weak: "rgba(0, 240, 255, 0.25)",     // Cyan 25% — sinal fraco
  moderate: "rgba(0, 240, 255, 0.50)", // Cyan 50% — sinal moderado
  strong: "rgba(0, 240, 255, 0.75)",   // Cyan 75% — sinal forte
  urgent: "rgba(168, 85, 247, 0.85)",   // Purple 85% — sinal urgente
  lost: "rgba(239, 68, 68, 0.60)",      // Red 60% — sinal perdido
} as const;

// ─── COLOR: BASE & SURFACE ────────────────────────────────────────────────────

const surface_color = {
  background: "#0a0a1a",                              // Fundo universal
  panel: "rgba(20, 20, 50, 0.50)",                    // Glass panel padrão
  panelElevated: "rgba(20, 20, 50, 0.65)",            // Glass panel elevado
  panelDepressed: "rgba(15, 15, 35, 0.70)",           // Glass panel rebaixado
  border: "rgba(255, 255, 255, 0.06)",                // Borda sutil
  borderActive: "rgba(0, 240, 255, 0.30)",            // Borda ativa (cyan)
  borderDanger: "rgba(239, 68, 68, 0.40)",            // Borda de perigo
  overlay: "rgba(10, 10, 26, 0.85)",                  // Overlay modal
} as const;

// ─── COLOR: TEXT ──────────────────────────────────────────────────────────────

const text = {
  primary: "rgba(255, 255, 255, 0.92)",     // Texto principal
  secondary: "rgba(255, 255, 255, 0.60)",    // Texto secundário
  tertiary: "rgba(255, 255, 255, 0.35)",     // Texto terciário / hint
  inverse: "#0a0a1a",                        // Texto sobre fundo claro
  link: "#00f0ff",                           // Links / interativos
  linkHover: "#45f5ff",                      // Links hover
  danger: "#ef4444",                         // Texto de erro
  success: "#10b981",                        // Texto de sucesso
  warning: "#f59e0b",                        // Texto de aviso
} as const;

// ─── SPACING ──────────────────────────────────────────────────────────────────

const spacing = {
  micro: "4px",
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
  xxxl: "64px",
  section: "96px",
} as const;

// ─── RADII ────────────────────────────────────────────────────────────────────

const radius = {
  none: "0px",       // Sharp edges — HUD elements, tags, nodes
  minimal: "2px",    // Quase sharp — cantos de input, bordas internas
  card: "4px",       // Cards, painéis — sutil, quase imperceptível
  panel: "6px",      // Painéis maiores, modais
  // NOTA: nada acima de 6px. NADA arredondado corporativo.
} as const;

// ─── BORDERS ──────────────────────────────────────────────────────────────────

const border = {
  none: "none",
  hairline: "1px solid",
  subtle: "1px solid rgba(255, 255, 255, 0.06)",
  active: "1px solid rgba(0, 240, 255, 0.30)",
  danger: "1px solid rgba(239, 68, 68, 0.40)",
  scanner: "1px dashed rgba(0, 240, 255, 0.20)",
} as const;

// ─── SHADOWS ──────────────────────────────────────────────────────────────────

const shadow = {
  none: "none",
  subtle: "0 1px 3px rgba(0, 0, 0, 0.40)",
  elevated: "0 4px 12px rgba(0, 0, 0, 0.50)",
  modal: "0 8px 32px rgba(0, 0, 0, 0.60)",
  glowCyan: "0 0 8px rgba(0, 240, 255, 0.15)",
  glowPurple: "0 0 8px rgba(168, 85, 247, 0.15)",
  glowDanger: "0 0 8px rgba(239, 68, 68, 0.20)",
  innerGlow: "inset 0 0 12px rgba(0, 240, 255, 0.06)",
} as const;

// ─── Z-INDEX ──────────────────────────────────────────────────────────────────

const zIndex = {
  base: 0,
  grid: 1,       // GridOverlay
  content: 10,   // Conteúdo normal
  beacon: 20,    // PulseBeacon, elementos flutuantes
  scanner: 30,   // ScannerRing
  overlay: 40,   // Overlays, modais
  hud: 50,       // HUD fixo (top bar, status)
  notification: 60, // Notificações do sistema
} as const;

// ─── ANIMATION ────────────────────────────────────────────────────────────────

const animation = {
  duration: {
    instant: "100ms",
    fast: "200ms",
    normal: "300ms",
    slow: "500ms",
    scanner: "800ms",
    beacon: "1200ms",
  },
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    decelerate: "cubic-bezier(0.0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
    scanner: "linear",
  },
} as const;

// ─── EXPORT ───────────────────────────────────────────────────────────────────

export const tokens = {
  color: {
    system,
    discovery,
    access,
    danger,
    signal,
    surface: surface_color,
    text,
  },
  spacing,
  radius,
  border,
  shadow,
  zIndex,
  animation,
} as const;

export type DesignTokens = typeof tokens;
