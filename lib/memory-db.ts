/**
 * In-Memory Database
 * Simple server-side storage that persists data across requests
 * but resets when the server restarts.
 */

import { Task, Team, AuditEvent, Scorecard, RubricCriterion } from './types';
import { INITIAL_TASKS, INITIAL_TEAMS, INITIAL_RUBRIC, FINALIST_TEAM_IDS } from './seed';

// In-memory storage
let teams: Team[] = [...INITIAL_TEAMS];
let tasks: Task[] = [...INITIAL_TASKS];
let auditLog: AuditEvent[] = [];
let scorecards: Scorecard[] = [];
let rubric: RubricCriterion[] = [...INITIAL_RUBRIC];
let finalistTeamIds: string[] = [...FINALIST_TEAM_IDS];

// Teams
export async function getAllTeams(): Promise<Team[]> {
  return [...teams];
}

export async function getTeam(id: string): Promise<Team | null> {
  return teams.find(t => t.id === id) || null;
}

export async function updateTeam(id: string, updates: Partial<Team>): Promise<Team> {
  const index = teams.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Team not found');
  }
  
  teams[index] = {
    ...teams[index],
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date().toISOString(),
  };
  
  return teams[index];
}

// Tasks
export async function getAllTasks(): Promise<Task[]> {
  return [...tasks];
}

export async function updateTask(id: number, updates: Partial<Task>): Promise<Task> {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Task not found');
  }
  
  tasks[index] = {
    ...tasks[index],
    ...updates,
    id, // Ensure ID doesn't change
  };
  
  return tasks[index];
}

// Audit Log
export async function addAuditLog(event: AuditEvent): Promise<void> {
  auditLog.unshift(event); // Add to beginning
  
  // Keep only last 1000 events
  if (auditLog.length > 1000) {
    auditLog = auditLog.slice(0, 1000);
  }
}

export async function getAuditLog(): Promise<AuditEvent[]> {
  return [...auditLog];
}

// Scorecards
export async function getScorecard(teamId: string, judgeId: string): Promise<Scorecard | null> {
  return scorecards.find(s => s.teamId === teamId && s.judgeId === judgeId) || null;
}

export async function getAllScorecards(): Promise<Scorecard[]> {
  return [...scorecards];
}

export async function saveScorecard(scorecard: Scorecard): Promise<void> {
  const index = scorecards.findIndex(
    s => s.teamId === scorecard.teamId && s.judgeId === scorecard.judgeId
  );
  
  const updatedScorecard = {
    ...scorecard,
    updatedAt: new Date().toISOString(),
  };
  
  if (index >= 0) {
    scorecards[index] = updatedScorecard;
  } else {
    scorecards.push(updatedScorecard);
  }
}

// Rubric
export async function getRubric(): Promise<RubricCriterion[]> {
  return [...rubric];
}

export async function updateRubric(criteria: RubricCriterion[]): Promise<void> {
  rubric = [...criteria];
}

// Finalist Teams
export async function getFinalistTeamIds(): Promise<string[]> {
  return [...finalistTeamIds];
}

export async function updateFinalistTeamIds(teamIds: string[]): Promise<void> {
  finalistTeamIds = [...teamIds];
}

// Reset all data (for admin)
export async function resetAllData(): Promise<void> {
  teams = [...INITIAL_TEAMS];
  tasks = [...INITIAL_TASKS];
  auditLog = [];
  scorecards = [];
  rubric = [...INITIAL_RUBRIC];
  finalistTeamIds = [...FINALIST_TEAM_IDS];
}

// Initialize data (called on first import)
export async function initializeData(): Promise<void> {
  // Data is already initialized with the default values
  console.log('In-memory database initialized');
}
