import { NextResponse } from 'next/server';
import { getTeam, updateTeam, addAuditLog } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { AuditEvent, ActionType } from '@/lib/types';

// Force dynamic rendering - disable Next.js caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    
    const existingTeam = await getTeam(params.id);
    if (!existingTeam) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const updatedTeam = await updateTeam(params.id, updates);
    
    // Log the change
    if (actor) {
      let action: ActionType = "ADMIN_OVERRIDE";
      let payload: Record<string, unknown> = { updates };

      if (Array.isArray(updates?.progress)) {
        const previousProgress = existingTeam.progress || [];
        const taskIndex = updates.progress.findIndex(
          (value: boolean, index: number) => value !== previousProgress[index]
        );

        if (taskIndex !== -1) {
          action = "TOGGLE_TASK";
          payload = {
            taskIndex,
            from: previousProgress[taskIndex],
            to: updates.progress[taskIndex],
          };
        }
      }

      const auditEvent: AuditEvent = {
        id: generateId(),
        ts: new Date().toISOString(),
        actor,
        action,
        teamId: params.id,
        payload,
      };
      await addAuditLog(auditEvent);
    }
    
    return NextResponse.json(updatedTeam);
  } catch (error) {
    console.error('Error updating team:', error);
    return NextResponse.json({ error: 'Failed to update team' }, { status: 500 });
  }
}
