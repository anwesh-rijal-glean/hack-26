import { NextResponse } from 'next/server';
import { getAllTasks } from '@/lib/db';

export async function GET() {
  try {
    const tasks = await getAllTasks();
    return NextResponse.json(tasks, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}
