import { NextResponse } from 'next/server';
import { resetAllData } from '@/lib/db';
import { ADMIN_PASSWORD } from '@/lib/seed';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Validate admin password (must match the one in lib/seed.ts)
    if (password !== ADMIN_PASSWORD) {
      console.warn('⚠️ Reset database attempt with incorrect password');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Starting database reset...');
    
    // Reset all data to initial seed values
    await resetAllData();

    console.log('✅ Database reset completed successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Database reset successfully. All data has been restored to initial state.' 
    });
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    return NextResponse.json({ 
      error: 'Failed to reset database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
