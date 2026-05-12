import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

// NOTE (Phase 0): userProfiles and universeTransitions tables are planned for
// Era 1 / Phase 2 (Motor de Narrativa Adaptativa). Returning sensible defaults
// until those migrations are applied. Do NOT remove this comment.

const DESTINATIONS: Record<string, string[]> = {
  analytical: ['NEXUS', 'AXIOM'],
  rebel: ['KAOS', 'ETHOS'],
  paralyzed: ['VOLT'],
  empathetic: ['TERRA', 'LYRA'],
  strategic: ['STRATOS'],
  creative: ['PRISM', 'AURORA'],
};

export async function GET() {
  const session = await getSessionUser();

  // Return a default journey state until Phase 2 DB tables are available.
  const archetype = 'creative';
  const recommended = (DESTINATIONS[archetype]?.[0] ?? 'NEXUS').toUpperCase();

  return NextResponse.json({
    archetype,
    recommended,
    visited: [],
    userId: session?.userId ?? null,
    dimensions: { emotional: 0, intellectual: 0, moral: 0 },
  });
}
