import { NextResponse } from 'next/server';
import { getRubric, updateRubric } from '@/lib/memory-db';

export async function GET() {
  try {
    const rubric = await getRubric();
    return NextResponse.json(rubric);
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
