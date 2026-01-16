import { NextResponse } from 'next/server';
import { updateTask, addAuditLog } from '@/lib/memory-db';
import { generateId } from '@/lib/utils';

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
      const auditEvent = {
        id: generateId(),
        timestamp: Date.now(),
        actor,
        action: 'update_task',
        target: { type: 'task' as const, id: String(taskId) },
        details: updates
      };
      await addAuditLog(auditEvent);
    }
    
    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
