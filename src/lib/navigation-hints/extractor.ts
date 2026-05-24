/**
 * ─── NAVIGATION HINTS — Extraction Engine ─────────────────────────────────────
 *
 * Parses raw AI response text to extract [NAV:...] tags and fallback
 * natural-language mentions of platform sections.
 *
 * The primary extraction path is the structured [NAV:section:reason:priority]
 * tag format. This is stripped from the visible response before reaching
 * the user. The fallback path scans for natural references to sections
 * using weighted keyword matching.
 */

import type { NavigationHint, NavigationHintBundle, PlatformSection, UnlockType } from "./types";
import {
  PLATFORM_SECTIONS,
  UNLOCK_TYPES,
  NavigationHintSchema,
  NavigationHintBundleSchema,
} from "./types";

// ─── SECTION ROUTE MAP ────────────────────────────────────────────────────────

const SECTION_ROUTES: Record<PlatformSection, string> = {
  home: "/home",
  series: "/series",
  blog: "/blog",
  explore: "/explore",
  lab: "/lab",
};

// ─── NAV TAG PARSER ───────────────────────────────────────────────────────────

const NAV_TAG_REGEX = /\[NAV:(home|series|blog|explore|lab):([^\]]+?):(\d+(?:\.\d+)?)\]/gi;

interface RawNavMatch {
  section: PlatformSection;
  reason: string;
  priority: number;
}

/**
 * Extract all [NAV:...] tags from AI response text.
 * Returns the cleaned text (tags removed) and parsed hints.
 */
function parseNavTags(rawResponse: string): {
  cleanedText: string;
  rawHints: RawNavMatch[];
} {
  try {
    const rawHints: RawNavMatch[] = [];
    const cleanedText = rawResponse.replace(NAV_TAG_REGEX, (_match, section, reason, priority) => {
      const parsedSection = section.toLowerCase() as PlatformSection;
      if (!PLATFORM_SECTIONS.includes(parsedSection)) return "";

      const parsedPriority = Math.min(1, Math.max(0, parseFloat(priority) || 0.5));
      const cleanedReason = reason.trim().slice(0, 120);

      rawHints.push({
        section: parsedSection,
        reason: cleanedReason,
        priority: parsedPriority,
      });

      return ""; // Remove tag from visible text
    });

    // Clean up any double spaces or empty lines left by tag removal
    return {
      cleanedText: cleanedText.replace(/\n{3,}/g, "\n\n").replace(/  +/g, " ").trim(),
      rawHints,
    };
  } catch (regexError) {
    // Regex failure (e.g., catastrophic backtracking on pathological input)
    // Fall back to returning the raw text unchanged
    console.warn(
      "[NavigationHints] NAV tag parsing failed — returning raw text:",
      regexError instanceof Error ? regexError.message : String(regexError)
    );
    return { cleanedText: rawResponse, rawHints: [] };
  }
}

// ─── NATURAL LANGUAGE FALLBACK ────────────────────────────────────────────────

interface KeywordWeight {
  keywords: RegExp[];
  section: PlatformSection;
  basePriority: number;
}

const SECTION_KEYWORDS: KeywordWeight[] = [
  {
    keywords: [
      /\b(missão|missões|episódio|episódios|módulo|módulos|série|séries)\b/gi,
      /\b(assistir|maratonar|temporada|capítulo)\b/gi,
    ],
    section: "series",
    basePriority: 0.5,
  },
  {
    keywords: [
      /\b(artigo|artigos|leitura|documentação|documentaçao|guia|tutorial|análise|analise)\b/gi,
      /\b(arquivo|arquivos|registro|registros|referência|referencia)\b/gi,
    ],
    section: "blog",
    basePriority: 0.4,
  },
  {
    keywords: [
      /\b(explorar|descobrir|território|territorio|mapa|cartografia|navegar)\b/gi,
      /\b(relacionado|conectado|similar|parecido|próximo|proximo)\b/gi,
    ],
    section: "explore",
    basePriority: 0.35,
  },
  {
    keywords: [
      /\b(experimentar|experimento|prática|pratica|testar|simular|simulação|simulacao)\b/gi,
      /\b(laboratório|laboratorio|pipeline|agentes|pronto para)\b/gi,
    ],
    section: "lab",
    basePriority: 0.6,
  },
];

/**
 * Fallback extraction: scan response for natural mentions of sections.
 * Only runs when structured [NAV:...] tags are absent.
 * Returns lower-confidence hints with conservative priority.
 */
function extractNaturalHints(response: string): NavigationHint[] {
  const hints: NavigationHint[] = [];
  const usedSections = new Set<PlatformSection>();

  for (const { keywords, section, basePriority } of SECTION_KEYWORDS) {
    if (usedSections.has(section)) continue;

    // Score by keyword match count and density
    let matchCount = 0;
    for (const kw of keywords) {
      const matches = response.match(kw);
      if (matches) matchCount += matches.length;
    }

    if (matchCount === 0) continue;

    // Priority scales with match density (capped)
    const responseLength = response.length || 1;
    const density = matchCount / (responseLength / 100);
    const scaledPriority = Math.min(0.65, basePriority + density * 0.05);

    hints.push({
      section,
      reason: buildNaturalReason(section),
      priority: scaledPriority,
      unlockType: sectionToUnlockType(section),
      triggerContext: { sourceSection: undefined },
    });

    usedSections.add(section);
  }

  return hints.sort((a, b) => b.priority - a.priority).slice(0, 2);
}

function buildNaturalReason(section: PlatformSection): string {
  const reasons: Record<PlatformSection, string> = {
    home: "Retornar ao núcleo do sistema",
    series: "Conteúdo relacionado em missões",
    blog: "Análise detalhada nos arquivos",
    explore: "Territórios conectados a esta descoberta",
    lab: "Conceito pronto para experimentação",
  };
  return reasons[section];
}

function sectionToUnlockType(section: PlatformSection): UnlockType {
  const map: Record<PlatformSection, UnlockType> = {
    home: "continuation",
    series: "mission",
    blog: "archive",
    explore: "territory",
    lab: "experiment",
  };
  return map[section];
}

// ─── HINT DEDUPLICATION & SCORING ─────────────────────────────────────────────

/**
 * Merge structured and natural hints, deduplicate by section,
 * keep highest priority for each section.
 */
function deduplicateHints(hints: NavigationHint[]): NavigationHint[] {
  const seen = new Map<PlatformSection, NavigationHint>();

  for (const hint of hints) {
    const existing = seen.get(hint.section);
    if (!existing || hint.priority > existing.priority) {
      seen.set(hint.section, hint);
    }
  }

  return Array.from(seen.values())
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3); // Maximum 3 hints per response
}

// ─── MAIN EXTRACTION FUNCTION ─────────────────────────────────────────────────

/**
 * Extract navigation hints from an AI response.
 *
 * Primary: Parses structured [NAV:section:reason:priority] tags.
 * Fallback: Scans for natural language mentions of platform sections.
 *
 * @param rawResponse - Full AI response text (may contain NAV tags)
 * @param metadata - Optional context for hint enrichment
 * @returns Bundle with cleaned text and validated hints
 */
export function extractNavigationHints(
  rawResponse: string,
  metadata?: {
    sourceSection?: PlatformSection;
    sourceAgentId?: string;
    discoveryTag?: string;
  }
): { cleanedText: string; bundle: NavigationHintBundle } {
  // ─── Defensive: survive unexpected input ─────────────────────────────────
  if (rawResponse == null || typeof rawResponse !== "string") {
    const safeBundle: NavigationHintBundle = {
      hints: [],
      extractedAt: Date.now(),
      sourceResponseLength: 0,
    };
    return { cleanedText: "", bundle: safeBundle };
  }

  try {
    return _extractNavigationHints(rawResponse, metadata);
  } catch (extractionError) {
    console.error(
      "[NavigationHints] Extraction failed — returning empty bundle:",
      extractionError instanceof Error ? extractionError.message : String(extractionError)
    );
    // Fail open: return cleaned text + empty bundle so chat still works
    const safeBundle: NavigationHintBundle = {
      hints: [],
      extractedAt: Date.now(),
      sourceResponseLength: rawResponse.length,
    };
    return {
      cleanedText: rawResponse, // Show raw text — better than crashing
      bundle: safeBundle,
    };
  }
}

/**
 * Internal extraction logic. Wrapped by extractNavigationHints for safety.
 * Never call this directly — always use extractNavigationHints.
 */
function _extractNavigationHints(
  rawResponse: string,
  metadata?: {
    sourceSection?: PlatformSection;
    sourceAgentId?: string;
    discoveryTag?: string;
  }
): { cleanedText: string; bundle: NavigationHintBundle } {
  const { cleanedText, rawHints } = parseNavTags(rawResponse);

  // Build hints from structured tags
  const structuredHints: NavigationHint[] = rawHints.map((raw) => ({
    section: raw.section,
    reason: raw.reason,
    priority: raw.priority,
    unlockType: sectionToUnlockType(raw.section),
    triggerContext: {
      sourceSection: metadata?.sourceSection,
      sourceAgentId: metadata?.sourceAgentId,
      discoveryTag: metadata?.discoveryTag,
    },
  }));

  // Fallback: natural language extraction (only if no structured tags found)
  let naturalHints: NavigationHint[] = [];
  if (structuredHints.length === 0) {
    naturalHints = extractNaturalHints(cleanedText).map((h) => ({
      ...h,
      triggerContext: {
        sourceSection: metadata?.sourceSection,
        sourceAgentId: metadata?.sourceAgentId,
        discoveryTag: metadata?.discoveryTag,
      },
    }));
  }

  // Merge and deduplicate
  const allHints = deduplicateHints([...structuredHints, ...naturalHints]);

  // Determine dominant section (highest priority hint's section)
  const dominantSection =
    allHints.length > 0 ? allHints[0].section : undefined;

  const bundle: NavigationHintBundle = {
    hints: allHints,
    extractedAt: Date.now(),
    sourceResponseLength: cleanedText.length,
    dominantSection,
  };

  // Validate against schema
  const parsed = NavigationHintBundleSchema.safeParse(bundle);
  if (!parsed.success) {
    console.warn(
      "[NavigationHints] Schema validation warning:",
      parsed.error.flatten()
    );
    // Return bundle anyway — schema is a guide, not a hard gate
  }

  return { cleanedText, bundle };
}

// ─── INLINE VALIDATION ────────────────────────────────────────────────────────

/**
 * Validate a single hint against the Zod schema.
 * Returns validated hint or null if invalid.
 */
export function validateHint(hint: unknown): NavigationHint | null {
  const result = NavigationHintSchema.safeParse(hint);
  return result.success ? result.data : null;
}

/**
 * Filter and validate an array of hints.
 */
export function validateHints(hints: unknown[]): NavigationHint[] {
  return hints
    .map((h) => validateHint(h))
    .filter((h): h is NavigationHint => h !== null);
}

// ─── UTILITY ──────────────────────────────────────────────────────────────────

export function getSectionRoute(section: PlatformSection): string {
  return SECTION_ROUTES[section];
}

export function getSectionLabel(section: PlatformSection): string {
  const labels: Record<PlatformSection, string> = {
    home: "Núcleo do Sistema",
    series: "Missões",
    blog: "Arquivos",
    explore: "Cartografia",
    lab: "Núcleo Quântico",
  };
  return labels[section];
}
