import { NextResponse } from 'next/server';
import { getAllTeams } from '@/lib/db';

export async function GET() {
  try {
    const teams = await getAllTeams();
    return NextResponse.json(teams, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
}
