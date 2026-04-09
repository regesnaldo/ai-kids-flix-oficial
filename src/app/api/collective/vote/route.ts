import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { collectiveVotes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

interface VoteRequest {
  userId: number;
  episodeId: string;
  choiceId: string;
  choiceLabel: string;
}

export async function POST(request: Request) {
  try {
    const body: VoteRequest = await request.json();
    const { userId, episodeId, choiceId, choiceLabel } = body;

    if (!userId || !episodeId || !choiceId || !choiceLabel) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(collectiveVotes)
      .where(eq(collectiveVotes.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ error: 'User already voted in this episode' }, { status: 409 });
    }

    await db.insert(collectiveVotes).values({
      id: crypto.randomUUID(),
      userId,
      episodeId,
      choiceId,
      choiceLabel,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[collective/vote] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get('episodeId');

    if (!episodeId) {
      return NextResponse.json({ error: 'episodeId required' }, { status: 400 });
    }

    const votes = await db
      .select()
      .from(collectiveVotes)
      .where(eq(collectiveVotes.episodeId, episodeId));

    const totalVotes = votes.length;
    const choiceMap = new Map<string, { label: string; count: number }>();

    for (const vote of votes) {
      const existing = choiceMap.get(vote.choiceId) || { label: vote.choiceLabel, count: 0 };
      existing.count++;
      choiceMap.set(vote.choiceId, existing);
    }

    const results = Array.from(choiceMap.entries()).map(([choiceId, data]) => ({
      choiceId,
      label: data.label,
      count: data.count,
      percentage: totalVotes > 0 ? Math.round((data.count / totalVotes) * 100) : 0,
    }));

    return NextResponse.json({
      episodeId,
      totalVotes,
      results: results.sort((a, b) => b.count - a.count),
    });
  } catch (error) {
    console.error('[collective/votes] Error:', error);
    return NextResponse.json({ totalVotes: 0, results: [] }, { status: 200 });
  }
}