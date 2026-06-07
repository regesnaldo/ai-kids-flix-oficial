import { NextRequest, NextResponse } from 'next/server';
import { suggestNarrative } from '@/engine/adaptive-router';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json({ suggestions: [] }, { status: 400 });
  }
  try {
    const suggestions = await suggestNarrative({
      userId: Number(userId),
      currentAgent: 'nexus',
    });
    return NextResponse.json({ suggestions });
  } catch (error) {
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}
