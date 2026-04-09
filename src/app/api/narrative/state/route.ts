import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { globalNarrativeState } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const states = await db
      .select()
      .from(globalNarrativeState)
      .where(eq(globalNarrativeState.isActive, 1))
      .orderBy(desc(globalNarrativeState.percentage))
      .limit(10);

    const dominant = states.find((s) => s.dominantChoice);

    return NextResponse.json({
      states: states.map((s) => ({
        episodeId: s.episodeId,
        choiceId: s.choiceId,
        choiceLabel: s.choiceLabel,
        totalVotes: s.totalVotes,
        percentage: s.percentage,
        isActive: s.isActive === 1,
      })),
      dominantChoice: dominant
        ? {
            choiceId: dominant.dominantChoice,
            label: dominant.choiceLabel,
            percentage: dominant.percentage,
          }
        : null,
    });
  } catch (error) {
    console.error('[narrative/state] Error:', error);
    return NextResponse.json({ states: [], dominantChoice: null }, { status: 200 });
  }
}