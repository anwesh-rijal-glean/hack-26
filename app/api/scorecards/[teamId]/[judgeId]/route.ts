import { NextResponse } from 'next/server';
import { getScorecard } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { teamId: string; judgeId: string } }
) {
  try {
    const scorecard = await getScorecard(params.teamId, params.judgeId);
    return NextResponse.json(scorecard);
  } catch (error) {
    console.error('Error fetching scorecard:', error);
    return NextResponse.json({ error: 'Failed to fetch scorecard' }, { status: 500 });
  }
}
