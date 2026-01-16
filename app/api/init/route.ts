import { NextResponse } from 'next/server';
import { resetAllData } from '@/lib/memory-db';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Validate admin password
    if (password !== 'hackathon-admin-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Reset all data to initial seed values
    await resetAllData();

    return NextResponse.json({ 
      success: true, 
      message: 'In-memory database reset successfully' 
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json({ 
      error: 'Failed to reset database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
