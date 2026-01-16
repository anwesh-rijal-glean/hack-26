import { NextResponse } from 'next/server';
import { 
  getAllTeams,
  updateTeam,
  updateTask,
  addAuditLog,
  saveScorecard,
  updateRubric,
  updateFinalistTeamIds,
  resetAllData
} from '@/lib/memory-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, data: importData } = body;
    
    // Validate admin password
    if (password !== 'hackathon-admin-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate import data structure
    if (!importData || !importData.data) {
      return NextResponse.json({ 
        error: 'Invalid import data format' 
      }, { status: 400 });
    }

    const { teams, tasks, auditLog, scorecards, rubric, finalistTeamIds } = importData.data;

    // First, reset to clear everything
    await resetAllData();

    // Import teams
    if (teams && Array.isArray(teams)) {
      for (const team of teams) {
        await updateTeam(team.id, team);
      }
    }

    // Import tasks
    if (tasks && Array.isArray(tasks)) {
      for (const task of tasks) {
        await updateTask(task.id, task);
      }
    }

    // Import audit log
    if (auditLog && Array.isArray(auditLog)) {
      for (const event of auditLog) {
        await addAuditLog(event);
      }
    }

    // Import scorecards
    if (scorecards && Array.isArray(scorecards)) {
      for (const scorecard of scorecards) {
        await saveScorecard(scorecard);
      }
    }

    // Import rubric
    if (rubric && Array.isArray(rubric)) {
      await updateRubric(rubric);
    }

    // Import finalist team IDs
    if (finalistTeamIds && Array.isArray(finalistTeamIds)) {
      await updateFinalistTeamIds(finalistTeamIds);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Data imported successfully',
      stats: {
        teams: teams?.length || 0,
        tasks: tasks?.length || 0,
        auditLog: auditLog?.length || 0,
        scorecards: scorecards?.length || 0,
        rubric: rubric?.length || 0,
        finalists: finalistTeamIds?.length || 0,
      }
    });
  } catch (error) {
    console.error('Error importing data:', error);
    return NextResponse.json({ 
      error: 'Failed to import data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
