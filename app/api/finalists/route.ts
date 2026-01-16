import { NextResponse } from 'next/server';
import { getFinalistTeamIds, updateFinalistTeamIds } from '@/lib/memory-db';

export async function GET() {
  try {
    const finalistIds = await getFinalistTeamIds();
    return NextResponse.json(finalistIds);
  } catch (error) {
    console.error('Error fetching finalist teams:', error);
    return NextResponse.json({ error: 'Failed to fetch finalist teams' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const teamIds = await request.json();
    await updateFinalistTeamIds(teamIds);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating finalist teams:', error);
    return NextResponse.json({ error: 'Failed to update finalist teams' }, { status: 500 });
  }
}
