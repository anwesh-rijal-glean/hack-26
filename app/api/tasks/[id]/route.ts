import { NextResponse } from 'next/server';
import { updateTask, addAuditLog } from '@/lib/db';
import { generateId } from '@/lib/utils';
import { AuditEvent, ActionType } from '@/lib/types';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { updates, actor } = body;
    
    const taskId = parseInt(params.id);
    const updatedTask = await updateTask(taskId, updates);
    
    // Log the change
    if (actor) {
      let action: ActionType = "ADMIN_OVERRIDE";
      let payload: Record<string, unknown> = { taskId, updates };

      if (typeof updates?.locked === "boolean") {
        action = updates.locked ? "LOCK_TASK" : "UNLOCK_TASK";
        payload = { taskId, locked: updates.locked };
      }

      const auditEvent: AuditEvent = {
        id: generateId(),
        ts: new Date().toISOString(),
        actor,
        action,
        teamId: "global",
        payload,
      };
      await addAuditLog(auditEvent);
    }
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
