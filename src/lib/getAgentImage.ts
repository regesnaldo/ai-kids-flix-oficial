/**
 * Canonical agent image resolver — single source of truth.
 *
 * All agent images should use this function instead of
 * hardcoding paths. It handles both canonical agents (PNG)
 * and educational concept agents (SVG).
 */

const CANONICAL = new Set([
  'nexus', 'volt', 'aurora', 'ethos', 'kaos',
  'cipher', 'lyra', 'axiom', 'stratos', 'terra',
  'prism', 'janus',
]);

const FALLBACK = '/images/agentes/nexus.png';

/**
 * Returns the correct image path for an agent by ID.
 * Canonical agents → /images/agentes/<id>.png
 * Educational concept agents → /images/agents/<id>.svg
 *
 * @param id - Agent ID (e.g. 'nexus', 'agent-01')
 * @returns Image path relative to /public
 */
export function getAgentImage(id: string): string {
  if (CANONICAL.has(id)) {
    return `/images/agentes/${id}.png`;
  }
  // Educational concept agents (1-20) or any other format
  if (/^agent-\d{2}$/.test(id)) {
    return `/images/agents/${id}.svg`;
  }
  // Numeric IDs used by agents.ts
  if (/^\d+$/.test(id)) {
    const num = id.padStart(2, '0');
    return `/images/agents/agent-${num}.svg`;
  }
  // Fallback for unknown IDs
  return FALLBACK;
}

export { FALLBACK as AGENT_IMAGE_FALLBACK };
