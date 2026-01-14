export interface Task {
  id: number; // 1..10
  title: string;
  description?: string;
  dueDate?: string;
  locked?: boolean;
}

export interface Link {
  id: string;
  label: string;
  url: string;
}

export interface Team {
  id: string;
  name: string;
  horseIcon: string; // emoji
  color?: string;
  progress: boolean[]; // length 10
  notes: string;
  links: Link[];
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
  | "EDIT_NOTES"
  | "ADD_LINK"
  | "REMOVE_LINK"
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
}

