import { NextResponse } from 'next/server';
import { getAuditLog, addAuditLog } from '@/lib/db';

export async function GET() {
  try {
    const auditLog = await getAuditLog();
    return NextResponse.json(auditLog, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching audit log:', error);
    return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const event = await request.json();
    await addAuditLog(event);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding audit log:', error);
    return NextResponse.json({ error: 'Failed to add audit log' }, { status: 500 });
  }
}
