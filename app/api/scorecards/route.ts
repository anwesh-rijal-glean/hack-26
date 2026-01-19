import { NextResponse } from 'next/server';
import { getAllScorecards, saveScorecard } from '@/lib/db';

// Force dynamic rendering - disable Next.js caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const scorecards = await getAllScorecards();
    return NextResponse.json(scorecards, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching scorecards:', error);
    return NextResponse.json({ error: 'Failed to fetch scorecards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const scorecard = await request.json();
    await saveScorecard(scorecard);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving scorecard:', error);
    return NextResponse.json({ error: 'Failed to save scorecard' }, { status: 500 });
  }
}
