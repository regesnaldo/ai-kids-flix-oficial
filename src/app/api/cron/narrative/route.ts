import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { globalNarrativeState, collectiveVotes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST() {
  try {
    const episodes = await db
      .selectDistinct({ episodeId: collectiveVotes.episodeId })
      .from(collectiveVotes);

    for (const { episodeId } of episodes) {
      const votes = await db
        .select()
        .from(collectiveVotes)
        .where(eq(collectiveVotes.episodeId, episodeId));

      const choiceMap = new Map<string, { label: string; count: number }>();
      
      for (const vote of votes) {
        const existing = choiceMap.get(vote.choiceId) || { label: vote.choiceLabel, count: 0 };
        existing.count++;
        choiceMap.set(vote.choiceId, existing);
      }

      const totalVotes = votes.length;
      let maxCount = 0;
      let dominant = '';

      await db.delete(globalNarrativeState).where(eq(globalNarrativeState.episodeId, episodeId));

      for (const [choiceId, data] of choiceMap.entries()) {
        const percentage = Math.round((data.count / totalVotes) * 100);
        
        if (data.count > maxCount) {
          maxCount = data.count;
          dominant = choiceId;
        }

        await db.insert(globalNarrativeState).values({
          id: crypto.randomUUID(),
          episodeId,
          choiceId,
          choiceLabel: data.label,
          totalVotes: data.count,
          percentage,
          dominantChoice: choiceId === dominant ? choiceId : null,
          isActive: 1,
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Narrative state recalculated' });
  } catch (error) {
    console.error('[cron/narrative] Error:', error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}