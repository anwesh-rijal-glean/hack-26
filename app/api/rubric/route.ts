import { NextResponse } from 'next/server';
import { getRubric, updateRubric } from '@/lib/db';

export async function GET() {
  try {
    const rubric = await getRubric();
    return NextResponse.json(rubric, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching rubric:', error);
    return NextResponse.json({ error: 'Failed to fetch rubric' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const criteria = await request.json();
    await updateRubric(criteria);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating rubric:', error);
    return NextResponse.json({ error: 'Failed to update rubric' }, { status: 500 });
  }
}
