import { NextResponse } from 'next/server';
import { getAllScorecards, saveScorecard } from '@/lib/memory-db';

export async function GET() {
  try {
    const scorecards = await getAllScorecards();
    return NextResponse.json(scorecards);
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
