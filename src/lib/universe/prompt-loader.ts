/**
 * ─── PROMPT LOADER — Dynamic Prompt Resolution ────────────────────────────────
 *
 * Prompts MUST NOT exist inside the registry.
 *
 * Rules:
 *   - Prompts load dynamically at inference time
 *   - Prompts cached in memory (Map) after first load
 *   - Prompts NEVER bundled into client bundles
 *   - Registry stores only `promptKey` — this module resolves it
 *
 * Prompt files live in: src/lib/universe/prompts/{promptKey}.txt
 * or are resolved from a server-side prompt store.
 */

import { planetRegistry, type PlanetId } from "./planet-registry";

// ─── IN-MEMORY CACHE ──────────────────────────────────────────────────────────

const promptCache = new Map<string, string>();

// ─── LOADER ───────────────────────────────────────────────────────────────────

/**
 * Load a planet's system prompt by its promptKey.
 * Resolves from cache first, then from disk, then falls back to defaults.
 */
export async function loadPlanetPrompt(planetId: PlanetId): Promise<string> {
  const planet = planetRegistry[planetId];
  const key = planet.promptKey;

  // Cache hit
  if (promptCache.has(key)) {
    return promptCache.get(key)!;
  }

  // Try loading from disk (server-side only)
  try {
    const prompt = await loadPromptFromDisk(key);
    promptCache.set(key, prompt);
    return prompt;
  } catch {
    // Fallback: generate from registry config
    const fallback = buildFallbackPrompt(planetId);
    promptCache.set(key, fallback);
    return fallback;
  }
}

/**
 * Synchronous version for client-side or when async isn't available.
 * Returns cached prompt or fallback immediately.
 */
export function getPlanetPromptSync(planetId: PlanetId): string {
  const planet = planetRegistry[planetId];
  const key = planet.promptKey;

  if (promptCache.has(key)) {
    return promptCache.get(key)!;
  }

  const fallback = buildFallbackPrompt(planetId);
  promptCache.set(key, fallback);
  return fallback;
}

/**
 * Warm the cache for all planets. Call at app startup.
 */
export async function warmPromptCache(): Promise<void> {
  const planetIds = Object.keys(planetRegistry) as PlanetId[];
  await Promise.allSettled(planetIds.map((id) => loadPlanetPrompt(id)));
}

/**
 * Clear the prompt cache. Useful for hot-reloading prompts.
 */
export function clearPromptCache(): void {
  promptCache.clear();
}

// ─── DISK LOADER ──────────────────────────────────────────────────────────────

/**
 * Load a prompt from disk. Resolves from src/lib/universe/prompts/{key}.txt.
 * Falls back to buildFallbackPrompt if file not found.
 */
async function loadPromptFromDisk(key: string): Promise<string> {
  // Resolve the prompt file path relative to this module
  // In Next.js server context, fs is available
  try {
    const fs = await import("fs/promises");
    const path = await import("path");

    const promptsDir = path.resolve(process.cwd(), "src/lib/universe/prompts");
    const filePath = path.join(promptsDir, `${key}.txt`);

    const content = await fs.readFile(filePath, "utf-8");
    return content.trim();
  } catch {
    throw new Error(`Prompt file not found: ${key}.txt`);
  }
}

// ─── FALLBACK PROMPT BUILDER ──────────────────────────────────────────────────

/**
 * Build a deterministic fallback prompt from planet registry config.
 * This ensures the system works even without external prompt files.
 */
function buildFallbackPrompt(planetId: PlanetId): string {
  const planet = planetRegistry[planetId];

  const clearanceDescriptions: Record<string, string> = {
    surface: "acesso público — informações básicas e introdutórias",
    deep: "acesso intermediário — conceitos profundos e especializados",
    core: "acesso avançado — conhecimento de núcleo e domínio",
    restricted: "acesso restrito — informação crítica e sensível",
  };

  const template = `[SISTEMA MENTE.AI — ${planet.name}: ${planet.subtitle}]

Você é ${planet.name}, ${planet.subtitle}.
Clearance: ${planet.clearance.toUpperCase()} — ${clearanceDescriptions[planet.clearance] || ""}.
Nível de ameaça: ${planet.threatLevel.toUpperCase()}.

DIRETRIZES:
- Mantenha o foco no tema iniciado pelo Participante
- Nunca mude de assunto sem que ele peça explicitamente
- Responda em português brasileiro com linguagem simples e humana
- Use analogias da vida real em vez de jargão técnico
- Seja conciso mas nunca frio — calor humano é essencial
- Se não souber algo, admita com honestidade
- Incentive a curiosidade e o pensamento crítico

Sua missão é guiar o Participante através do seu domínio de conhecimento,
ajudando-o a evoluir de aprendiz a mestre.`;

  return template;
}
