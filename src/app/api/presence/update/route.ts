import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { universePresence } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { universeId, increment } = await request.json();

    if (!universeId) {
      return NextResponse.json({ error: 'universeId required' }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(universePresence)
      .where(eq(universePresence.universeId, universeId))
      .limit(1);

    if (existing.length > 0) {
      const newCount = Math.max(0, existing[0].activeCount + (increment ? 1 : -1));
      await db
        .update(universePresence)
        .set({ activeCount: newCount, updatedAt: new Date() })
        .where(eq(universePresence.universeId, universeId));
    } else {
      await db.insert(universePresence).values({
        id: crypto.randomUUID(),
        universeId,
        activeCount: 1,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[presence/update] Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}