import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { universePresence } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: universeId } = await params;
    
    const result = await db
      .select()
      .from(universePresence)
      .where(eq(universePresence.universeId, universeId))
      .limit(1);

    const presence = result[0];

    return NextResponse.json({
      universeId,
      activeCount: presence?.activeCount ?? 0,
      updatedAt: presence?.updatedAt ?? null,
    });
  } catch (error) {
    console.error('[universe/presence] Error:', error);
    return NextResponse.json({ universeId: '', activeCount: 0, updatedAt: null }, { status: 200 });
  }
}