import { NextResponse } from 'next/server';
import { getFinalistTeamIds, updateFinalistTeamIds } from '@/lib/db';

// Force dynamic rendering - disable Next.js caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const finalistIds = await getFinalistTeamIds();
    return NextResponse.json(finalistIds, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
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
