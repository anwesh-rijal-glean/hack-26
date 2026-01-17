/**
 * Supabase PostgreSQL Database Client
 * Provides database operations for the hackathon app
 */

import { createClient } from '@supabase/supabase-js';
import { Task, Team, AuditEvent, Scorecard, RubricCriterion } from './types';
import { INITIAL_TASKS, INITIAL_TEAMS, INITIAL_RUBRIC, FINALIST_TEAM_IDS } from './seed';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

if (!isSupabaseConfigured) {
  console.error('⚠️ Supabase not configured! Please set up environment variables.');
  console.error('See SUPABASE_SETUP.md for instructions.');
}

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey)
  : null as any; // Fallback to prevent crashes

// Debug mode - only in development
const DEBUG_SQL = process.env.NODE_ENV === 'development';

/**
 * Log SQL-like debug information for database operations
 */
function logSQL(operation: string, table: string, details?: any) {
  if (!DEBUG_SQL) return;
  
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  console.log(`\n🔷 [${timestamp}] SQL Debug:`);
  console.log(`📋 Operation: ${operation}`);
  console.log(`📊 Table: ${table}`);
  
  if (details) {
    if (details.filters) console.log(`🔍 Filters:`, details.filters);
    if (details.data) console.log(`📝 Data:`, details.data);
    if (details.updates) console.log(`✏️ Updates:`, details.updates);
    if (details.result) console.log(`✅ Result:`, details.result);
    if (details.error) console.log(`❌ Error:`, details.error);
  }
  
  // Generate SQL-like equivalent
  let sqlEquivalent = '';
  switch (operation) {
    case 'SELECT':
      sqlEquivalent = `SELECT * FROM ${table}`;
      if (details?.filters) {
        const conditions = Object.entries(details.filters)
          .map(([key, val]) => `${key} = '${val}'`)
          .join(' AND ');
        sqlEquivalent += ` WHERE ${conditions}`;
      }
      if (details?.order) sqlEquivalent += ` ORDER BY ${details.order}`;
      if (details?.limit) sqlEquivalent += ` LIMIT ${details.limit}`;
      break;
    case 'INSERT':
      const columns = Object.keys(details?.data || {}).join(', ');
      sqlEquivalent = `INSERT INTO ${table} (${columns}) VALUES (...)`;
      break;
    case 'UPDATE':
      const updates = Object.keys(details?.updates || {})
        .map(key => `${key} = ...`)
        .join(', ');
      sqlEquivalent = `UPDATE ${table} SET ${updates}`;
      if (details?.filters) {
        const conditions = Object.entries(details.filters)
          .map(([key, val]) => `${key} = '${val}'`)
          .join(' AND ');
        sqlEquivalent += ` WHERE ${conditions}`;
      }
      break;
    case 'DELETE':
      sqlEquivalent = `DELETE FROM ${table}`;
      if (details?.filters) {
        const conditions = Object.entries(details.filters)
          .map(([key, val]) => `${key} = '${val}'`)
          .join(' AND ');
        sqlEquivalent += ` WHERE ${conditions}`;
      }
      break;
  }
  
  console.log(`💾 SQL Equivalent: ${sqlEquivalent}`);
  console.log(`─────────────────────────────────────────\n`);
}

// Database initialization flag and promise for handling concurrent calls
let isInitialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Map database row (snake_case) to TypeScript Team (camelCase)
 */
function mapDbRowToTeam(row: any): Team {
  return {
    id: row.id,
    name: row.name,
    horseIcon: row.icon,
    progress: row.progress || [],
    notes: row.notes || '',
    links: row.links || [],
    updatedAt: row.updated_at,
    lastUpdatedBy: row.last_updated_by || '',
    color: row.color,
  };
}

/**
 * Map TypeScript Team updates to database fields (snake_case)
 */
function mapTeamUpdatesToDb(updates: Partial<Team>): any {
  const dbUpdates: any = {};
  
  if ('name' in updates) dbUpdates.name = updates.name;
  if ('horseIcon' in updates) dbUpdates.icon = updates.horseIcon;
  if ('progress' in updates) dbUpdates.progress = updates.progress;
  if ('notes' in updates) dbUpdates.notes = updates.notes;
  if ('links' in updates) dbUpdates.links = updates.links;
  if ('lastUpdatedBy' in updates) dbUpdates.last_updated_by = updates.lastUpdatedBy;
  if ('color' in updates) dbUpdates.color = updates.color;
  
  return dbUpdates;
}

/**
 * Map database row (snake_case) to TypeScript Task (camelCase)
 */
function mapDbRowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    dueDate: row.due_date,
    locked: row.locked,
    points: row.points,
  };
}

/**
 * Map TypeScript Task updates to database fields (snake_case)
 */
function mapTaskUpdatesToDb(updates: Partial<Task>): any {
  const dbUpdates: any = {};
  
  if ('title' in updates) dbUpdates.title = updates.title;
  if ('description' in updates) dbUpdates.description = updates.description;
  if ('dueDate' in updates) dbUpdates.due_date = updates.dueDate;
  if ('locked' in updates) dbUpdates.locked = updates.locked;
  if ('points' in updates) dbUpdates.points = updates.points;
  
  return dbUpdates;
}

/**
 * Check if Supabase is configured
 */
function checkSupabaseConfig(): void {
  if (!isSupabaseConfigured) {
    throw new Error(
      '❌ Supabase database not configured!\n\n' +
      'Please follow these steps:\n' +
      '1. See SUPABASE_SETUP.md or QUICK_START.md\n' +
      '2. Create a Supabase account at https://supabase.com\n' +
      '3. Set up your database and get API keys\n' +
      '4. Create .env.local with your credentials\n' +
      '5. Restart the dev server\n\n' +
      'The app cannot function without a database connection.'
    );
  }
}

/**
 * Initialize database with seed data if empty
 */
export async function initializeDatabase(): Promise<void> {
  checkSupabaseConfig();
  
  // If already initialized, return immediately
  if (isInitialized) return;
  
  // If initialization is in progress, wait for it
  if (initPromise) return initPromise;

  // Start initialization
  initPromise = (async () => {
    try {
      // Check if teams exist
      const { data: teams, error: teamsError } = await supabase
        .from('teams')
        .select('id')
        .limit(1);

      // If error checking teams, assume database exists
      if (teamsError) {
        console.warn('Error checking for teams, assuming database exists:', teamsError);
        isInitialized = true;
        return;
      }

      // If teams exist, we're done
      if (teams && teams.length > 0) {
        console.log('Database already initialized');
        isInitialized = true;
        return;
      }

      // If no teams exist, seed the database
      console.log('Initializing database with seed data...');

      // Insert teams
      const teamsToInsert = INITIAL_TEAMS.map(t => ({
        id: t.id,
        name: t.name,
        icon: t.horseIcon,
        color: t.color,
        progress: t.progress,
        notes: t.notes,
        links: t.links,
        last_updated_by: t.lastUpdatedBy || '',
      }));
      
      console.log('Inserting teams with seed data:', {
        count: teamsToInsert.length,
        sampleProgress: teamsToInsert[0].progress,
        allProgressReset: teamsToInsert.every(t => t.progress.every((p: boolean) => p === false)),
      });
      
      const { error: insertTeamsError } = await supabase
        .from('teams')
        .insert(teamsToInsert);
      
      // If duplicate key error, that's okay - data already exists
      if (insertTeamsError) {
        if (insertTeamsError.code === '23505') {
          console.log('Teams already exist, skipping initialization');
          isInitialized = true;
          return;
        }
        throw insertTeamsError;
      }
      
      logSQL('INSERT', 'teams', { data: `${teamsToInsert.length} rows` });

      // Insert tasks
      const { error: insertTasksError } = await supabase
        .from('tasks')
        .insert(INITIAL_TASKS.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          due_date: t.dueDate,
          locked: t.locked,
          points: t.points,
        })));
      
      if (insertTasksError && insertTasksError.code !== '23505') {
        throw insertTasksError;
      }

      // Insert rubric
      const { error: insertRubricError } = await supabase
        .from('rubric')
        .insert(INITIAL_RUBRIC.map((r, index) => ({
          id: r.id,
          title: r.title,
          description: r.description,
          max_points: r.maxPoints,
          sort_order: index,
        })));
      
      if (insertRubricError && insertRubricError.code !== '23505') {
        throw insertRubricError;
      }

      // Insert finalist teams
      const { error: insertFinalistsError } = await supabase
        .from('finalist_teams')
        .insert(FINALIST_TEAM_IDS.map(id => ({ team_id: id })));
      
      if (insertFinalistsError && insertFinalistsError.code !== '23505') {
        throw insertFinalistsError;
      }

      console.log('Database initialized successfully!');
      isInitialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      // Mark as initialized even on error to prevent infinite retry loops
      isInitialized = true;
      throw error;
    } finally {
      // Clear the promise so future calls can check isInitialized
      initPromise = null;
    }
  })();

  return initPromise;
}

// ============================================================================
// TEAMS
// ============================================================================

export async function getAllTeams(): Promise<Team[]> {
  checkSupabaseConfig();
  await initializeDatabase();
  
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .order('id');

  if (error) {
    console.error('❌ Error fetching teams:', error);
    throw error;
  }
  
  // Map database fields to TypeScript fields
  const mappedTeams = (data || []).map(mapDbRowToTeam);
  
  return mappedTeams;
}

export async function getTeam(id: string): Promise<Team | null> {
  checkSupabaseConfig();
  await initializeDatabase();
  
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    console.error('❌ Error fetching team:', error);
    throw error;
  }
  
  return data ? mapDbRowToTeam(data) : null;
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
  checkSupabaseConfig();
  
  // Map TypeScript fields to database fields
  const dbUpdates = mapTeamUpdatesToDb(updates);
  
  logSQL('UPDATE', 'teams', { 
    filters: { id }, 
    updates: { ...dbUpdates, updated_at: 'NOW()' } 
  });
  
  const { data, error } = await supabase
    .from('teams')
    .update({
      ...dbUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logSQL('UPDATE', 'teams', { error });
    throw error;
  }
  
  logSQL('UPDATE', 'teams', { result: 'Updated 1 row' });
  
  return mapDbRowToTeam(data);
}

// ============================================================================
// TASKS
// ============================================================================

export async function getAllTasks(): Promise<Task[]> {
  checkSupabaseConfig();
  await initializeDatabase();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('id');

  if (error) {
    console.error('❌ Error fetching tasks:', error);
    throw error;
  }
  
  return (data || []).map(mapDbRowToTask);
}

export async function getTask(id: number): Promise<Task | null> {
  checkSupabaseConfig();
  await initializeDatabase();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('❌ Error fetching task:', error);
    throw error;
  }
  
  return data ? mapDbRowToTask(data) : null;
}

export async function updateTask(id: number, updates: Partial<Task>): Promise<Task> {
  checkSupabaseConfig();
  
  const dbUpdates = mapTaskUpdatesToDb(updates);
  
  logSQL('UPDATE', 'tasks', { 
    filters: { id }, 
    updates: { ...dbUpdates, updated_at: 'NOW()' } 
  });
  
  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...dbUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logSQL('UPDATE', 'tasks', { error });
    throw error;
  }
  
  logSQL('UPDATE', 'tasks', { result: 'Updated 1 row' });
  
  return mapDbRowToTask(data);
}

// ============================================================================
// AUDIT LOG
// ============================================================================

export async function getAuditLog(): Promise<AuditEvent[]> {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .order('ts', { ascending: false })
    .limit(100);

  if (error) {
    console.error('❌ Error fetching audit log:', error);
    throw error;
  }
  
  return data || [];
}

export async function addAuditLog(event: AuditEvent): Promise<void> {
  const insertData = {
    id: event.id,
    ts: event.ts,
    actor: event.actor,
    action: event.action,
    team_id: event.teamId,
    payload: event.payload,
  };
  
  logSQL('INSERT', 'audit_log', { data: insertData });
  
  const { error } = await supabase
    .from('audit_log')
    .insert(insertData);

  if (error) {
    logSQL('INSERT', 'audit_log', { error });
    throw error;
  }
  
  logSQL('INSERT', 'audit_log', { result: 'Inserted 1 row' });
}

// ============================================================================
// SCORECARDS
// ============================================================================

export async function getAllScorecards(): Promise<Scorecard[]> {
  const { data, error } = await supabase
    .from('scorecards')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching scorecards:', error);
    throw error;
  }
  
  return (data || []).map((row: any) => ({
    id: row.id,
    judgeId: row.judge_id,
    judgeName: row.judge_name,
    teamId: row.team_id,
    scores: row.scores,
    totalScore: parseFloat(row.total_score),
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
  }));
}

export async function getScorecard(judgeId: string, teamId: string): Promise<Scorecard | null> {
  const { data, error } = await supabase
    .from('scorecards')
    .select('*')
    .eq('judge_id', judgeId)
    .eq('team_id', teamId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    id: data.id,
    judgeId: data.judge_id,
    judgeName: data.judge_name,
    teamId: data.team_id,
    scores: data.scores,
    totalScore: parseFloat(data.total_score),
    submittedAt: data.submitted_at,
    updatedAt: data.updated_at,
  };
}

export async function saveScorecard(scorecard: Scorecard): Promise<Scorecard> {
  const upsertData = {
    id: scorecard.id,
    judge_id: scorecard.judgeId,
    judge_name: scorecard.judgeName,
    team_id: scorecard.teamId,
    scores: scorecard.scores,
    total_score: scorecard.totalScore,
    submitted_at: scorecard.submittedAt,
    updated_at: new Date().toISOString(),
  };
  
  logSQL('INSERT/UPDATE', 'scorecards', { data: upsertData });
  
  const { data, error } = await supabase
    .from('scorecards')
    .upsert(upsertData, {
      onConflict: 'judge_id,team_id'
    })
    .select()
    .single();

  if (error) {
    logSQL('INSERT/UPDATE', 'scorecards', { error });
    throw error;
  }
  
  logSQL('INSERT/UPDATE', 'scorecards', { result: 'Upserted 1 row' });

  return {
    id: data.id,
    judgeId: data.judge_id,
    judgeName: data.judge_name,
    teamId: data.team_id,
    scores: data.scores,
    totalScore: parseFloat(data.total_score),
    submittedAt: data.submitted_at,
    updatedAt: data.updated_at,
  };
}

// ============================================================================
// RUBRIC
// ============================================================================

export async function getRubric(): Promise<RubricCriterion[]> {
  await initializeDatabase();
  
  const { data, error } = await supabase
    .from('rubric')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('❌ Error fetching rubric:', error);
    throw error;
  }
  
  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    maxPoints: row.max_points,
  }));
}

export async function updateRubric(rubric: RubricCriterion[]): Promise<RubricCriterion[]> {
  // Delete existing rubric
  logSQL('DELETE', 'rubric', { filters: { 'id !=': '' } });
  
  const { error: deleteError } = await supabase
    .from('rubric')
    .delete()
    .neq('id', '');

  if (deleteError) {
    logSQL('DELETE', 'rubric', { error: deleteError });
    throw deleteError;
  }
  
  logSQL('DELETE', 'rubric', { result: 'Deleted all rows' });

  // Insert new rubric
  const insertData = rubric.map((r, index) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    max_points: r.maxPoints,
    sort_order: index,
  }));
  
  logSQL('INSERT', 'rubric', { data: `${insertData.length} rows` });
  
  const { data, error: insertError } = await supabase
    .from('rubric')
    .insert(insertData)
    .select();

  if (insertError) {
    logSQL('INSERT', 'rubric', { error: insertError });
    throw insertError;
  }
  
  logSQL('INSERT', 'rubric', { result: `Inserted ${data?.length || 0} rows` });

  return (data || []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    maxPoints: row.max_points,
  }));
}

// ============================================================================
// FINALISTS
// ============================================================================

export async function getFinalistTeamIds(): Promise<string[]> {
  await initializeDatabase();
  
  const { data, error } = await supabase
    .from('finalist_teams')
    .select('team_id')
    .order('team_id');

  if (error) {
    console.error('❌ Error fetching finalist teams:', error);
    throw error;
  }
  
  return (data || []).map((row: any) => row.team_id);
}

export async function updateFinalistTeamIds(teamIds: string[]): Promise<void> {
  // Delete all existing finalists
  logSQL('DELETE', 'finalist_teams', { filters: { 'team_id !=': '' } });
  
  const { error: deleteError } = await supabase
    .from('finalist_teams')
    .delete()
    .neq('team_id', '');

  if (deleteError) {
    logSQL('DELETE', 'finalist_teams', { error: deleteError });
    throw deleteError;
  }
  
  logSQL('DELETE', 'finalist_teams', { result: 'Deleted all rows' });

  // Insert new finalists
  if (teamIds.length > 0) {
    const insertData = teamIds.map(id => ({ team_id: id }));
    
    logSQL('INSERT', 'finalist_teams', { data: `${teamIds.length} rows` });
    
    const { error: insertError } = await supabase
      .from('finalist_teams')
      .insert(insertData);

    if (insertError) {
      logSQL('INSERT', 'finalist_teams', { error: insertError });
      throw insertError;
    }
    
    logSQL('INSERT', 'finalist_teams', { result: `Inserted ${teamIds.length} rows` });
  }
}

// ============================================================================
// DATABASE RESET
// ============================================================================

export async function resetAllData(): Promise<void> {
  checkSupabaseConfig();
  
  console.log('🔄 Resetting database - deleting all existing data...');
  
  try {
    // Delete all data in reverse dependency order
    // NOTE: Rubric is NOT deleted - it should persist and only be changed via admin edit
    console.log('  - Deleting audit logs...');
    const { error: auditError } = await supabase.from('audit_log').delete().neq('id', '');
    if (auditError) console.error('Error deleting audit logs:', auditError);
    
    console.log('  - Deleting scorecards...');
    const { error: scError } = await supabase.from('scorecards').delete().neq('id', '');
    if (scError) console.error('Error deleting scorecards:', scError);
    
    console.log('  - Deleting tasks...');
    const { error: tasksError } = await supabase.from('tasks').delete().neq('id', '');
    if (tasksError) console.error('Error deleting tasks:', tasksError);
    
    console.log('  - Deleting teams...');
    const { error: teamsError } = await supabase.from('teams').delete().neq('id', '');
    if (teamsError) console.error('Error deleting teams:', teamsError);
    
    console.log('  - Resetting finalist teams to defaults...');
    const { error: ftError } = await supabase.from('finalist_teams').delete().neq('team_id', '');
    if (ftError) console.error('Error deleting finalist teams:', ftError);
    
    console.log('✅ All data deleted successfully (rubric preserved)');
    
    // Verify teams were deleted
    const { data: remainingTeams } = await supabase.from('teams').select('id');
    console.log(`  - Teams remaining after delete: ${remainingTeams?.length || 0}`);
    
    // Reset initialization flag so it will re-seed
    isInitialized = false;
    initPromise = null; // Clear the promise too
    
    console.log('🌱 Re-initializing database with seed data...');
    console.log(`  - Will insert ${INITIAL_TEAMS.length} teams with progress reset to all false`);
    
    // Re-initialize with seed data
    await initializeDatabase();
    
    // Verify teams were re-inserted with reset progress
    const { data: newTeams } = await supabase.from('teams').select('id, name, progress');
    console.log(`  - Teams inserted: ${newTeams?.length || 0}`);
    if (newTeams && newTeams.length > 0) {
      const allReset = newTeams.every((t: any) => t.progress.every((p: boolean) => p === false));
      console.log(`  - All team progress reset: ${allReset}`);
      console.log(`  - Sample team progress:`, newTeams[0].progress);
    }
    
    console.log('✅ Database reset complete - all data restored to initial state');
  } catch (error) {
    console.error('❌ Error during database reset:', error);
    throw error;
  }
}
