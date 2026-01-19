export interface Task {
  id: number; // 1..10
  title: string;
  description?: string;
  dueDate?: string;
  locked?: boolean;
  points?: number;
}

export interface Team {
  id: string;
  name: string;
  horseIcon: string; // emoji
  color?: string;
  progress: boolean[]; // length 10
  updatedAt: string;
  lastUpdatedBy: string;
}

export type ActorType = "team" | "admin";

export interface Actor {
  type: ActorType;
  id: string; // team id or "admin"
}

export type ActionType =
  | "TOGGLE_TASK"
  | "ADMIN_OVERRIDE"
  | "RESET_TEAM"
  | "LOCK_TASK"
  | "UNLOCK_TASK"
  | "UNDO";

export interface AuditEvent {
  id: string;
  ts: string; // ISO timestamp
  actor: Actor;
  action: ActionType;
  teamId: string;
  payload?: any;
}

export interface RubricCriterion {
  id: string;
  title: string;
  description: string;
  maxPoints: number;
}

export interface TeamScore {
  criterionId: string;
  score: number; // 0 to maxPoints
  comments?: string;
}

export interface Scorecard {
  id: string;
  judgeId: string;
  judgeName: string;
  teamId: string;
  scores: TeamScore[];
  totalScore: number;
  submittedAt?: string; // ISO timestamp, undefined if draft
  updatedAt: string;
}

export interface AppState {
  tasks: Task[];
  teams: Team[];
  auditLog: AuditEvent[];
  rubric: RubricCriterion[];
  scorecards: Scorecard[];
  finalistTeamIds: string[]; // Dynamic list of finalist teams
  lastFetchTimestamp?: number; // Timestamp of last data fetch to force re-renders
}

