export const UNIVERSE_IDS = {
  NEXUS: 'nexus-central',
  VOLT: 'volt-energy',
  AURORA: 'aurora-dream',
  ETHOS: 'ethos-ethics',
} as const;

export function getUniverseId(zone: string): string {
  const map: Record<string, string> = {
    transformers: UNIVERSE_IDS.NEXUS,
    redes: UNIVERSE_IDS.VOLT,
    criativa: UNIVERSE_IDS.AURORA,
    etica: UNIVERSE_IDS.ETHOS,
  };
  return map[zone] || zone;
}

export async function updatePresence(universeId: string, increment: boolean = true) {
  try {
    await fetch('/api/presence/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ universeId, increment }),
    });
  } catch (error) {
    console.error('[presence] Failed to update:', error);
  }
}