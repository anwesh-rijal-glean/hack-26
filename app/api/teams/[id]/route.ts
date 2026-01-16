import { NextResponse } from 'next/server';
import { getTeam, updateTeam, addAuditLog } from '@/lib/memory-db';
import { generateId } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const team = await getTeam(params.id);
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }
    return NextResponse.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json({ error: 'Failed to fetch team' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { updates, actor } = body;
    
    const updatedTeam = await updateTeam(params.id, updates);
    
    // Log the change
    if (actor) {
      const auditEvent = {
        id: generateId(),
        timestamp: Date.now(),
        actor,
        action: updates.name ? 'update_name' : updates.horseIcon ? 'update_icon' : 'update_tasks',
        target: { type: 'team' as const, id: params.id },
        details: updates
      };
      await addAuditLog(auditEvent);
    }
    
    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
}
