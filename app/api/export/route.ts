import { NextResponse } from 'next/server';
import { 
  getAllTeams, 
  getAllTasks, 
  getAuditLog, 
  getAllScorecards, 
  getRubric, 
  getFinalistTeamIds 
} from '@/lib/memory-db';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Validate admin password
    if (password !== 'hackathon-admin-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all data
    const [teams, tasks, auditLog, scorecards, rubric, finalistTeamIds] = await Promise.all([
      getAllTeams(),
      getAllTasks(),
      getAuditLog(),
      getAllScorecards(),
      getRubric(),
      getFinalistTeamIds(),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: {
        teams,
        tasks,
        auditLog,
        scorecards,
        rubric,
        finalistTeamIds,
      },
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json({ 
      error: 'Failed to export data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
