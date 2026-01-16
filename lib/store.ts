import { create } from "zustand";
import { AppState, Actor, AuditEvent, Link, Team, Task, Scorecard, RubricCriterion } from "./types";
import { INITIAL_TASKS, INITIAL_TEAMS, INITIAL_RUBRIC, FINALIST_TEAM_IDS } from "./seed";
import { generateId } from "./utils";

interface StoreState extends AppState {
  // Loading state
  isLoading: boolean;
  // Actions
  fetchAllData: () => Promise<void>;
  toggleTask: (teamId: string, taskIndex: number, actor: Actor) => Promise<void>;
  setNotes: (teamId: string, notes: string, actor: Actor) => void;
  setTeamName: (teamId: string, name: string, actor: Actor) => Promise<void>;
  setTeamIcon: (teamId: string, icon: string, actor: Actor) => Promise<void>;
  updateTask: (taskId: number, updates: Partial<Task>, actor: Actor) => Promise<void>;
  addLink: (teamId: string, link: Link, actor: Actor) => void;
  removeLink: (teamId: string, linkId: string, actor: Actor) => void;
  lockTask: (taskId: number, locked: boolean, actor: Actor) => void;
  resetTeam: (teamId: string, actor: Actor) => void;
  undoLast: (teamId: string, actor: Actor) => void;
  initializeStore: () => void;
  // Scorecard actions
  saveScorecard: (scorecard: Scorecard) => Promise<void>;
  submitScorecard: (scorecardId: string) => void;
  updateRubric: (rubric: RubricCriterion[]) => Promise<void>;
  getScorecard: (judgeId: string, teamId: string) => Scorecard | undefined;
  // Finalist management
  setFinalistTeamIds: (teamIds: string[]) => Promise<void>;
  toggleFinalist: (teamId: string) => Promise<void>;
  // Database reset
  resetAllData: (password: string) => Promise<void>;
}

const createAuditEvent = (
  action: AuditEvent["action"],
  actor: Actor,
  teamId: string,
  payload?: any
): AuditEvent => ({
  id: generateId(),
  ts: new Date().toISOString(),
  actor,
  action,
  teamId,
  payload,
});

// Helper function to safely make API calls
async function apiCall<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      console.error(`API call failed: ${url}`, response.statusText);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`API call error: ${url}`, error);
    return null;
  }
}

export const useStore = create<StoreState>((set, get) => ({
  tasks: INITIAL_TASKS,
  teams: INITIAL_TEAMS,
  auditLog: [],
  rubric: INITIAL_RUBRIC,
  scorecards: [],
  finalistTeamIds: FINALIST_TEAM_IDS,
  isLoading: false,

  // Fetch all data from API
  fetchAllData: async () => {
    set({ isLoading: true });
    try {
      const [teams, tasks, auditLog, scorecards, rubric, finalistIds] = await Promise.all([
        apiCall<Team[]>('/api/teams'),
        apiCall<Task[]>('/api/tasks'),
        apiCall<AuditEvent[]>('/api/audit'),
        apiCall<Scorecard[]>('/api/scorecards'),
        apiCall<RubricCriterion[]>('/api/rubric'),
        apiCall<string[]>('/api/finalists'),
      ]);

      set({
        teams: teams || INITIAL_TEAMS,
        tasks: tasks || INITIAL_TASKS,
        auditLog: auditLog || [],
        scorecards: scorecards || [],
        rubric: rubric || INITIAL_RUBRIC,
        finalistTeamIds: finalistIds || FINALIST_TEAM_IDS,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      set({ isLoading: false });
    }
  },

  initializeStore: () => {
    const state = get();
    if (state.teams.length === 0) {
      get().fetchAllData();
    }
  },

  toggleTask: async (teamId: string, taskIndex: number, actor: Actor) => {
    const state = get();
    const team = state.teams.find((t) => t.id === teamId);
    if (!team) return;

    const task = state.tasks[taskIndex];
    // If task is locked and actor is not admin, don't allow toggle
    if (task?.locked && actor.type !== "admin") return;

    const newProgress = [...team.progress];
    newProgress[taskIndex] = !newProgress[taskIndex];

    // Optimistically update UI
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId ? { ...t, progress: newProgress } : t
      ),
    }));

    // Sync with API
    await apiCall(`/api/teams/${teamId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: { progress: newProgress },
        actor,
      }),
    });

    // Refresh data to get latest state
    get().fetchAllData();
  },

  setNotes: (teamId: string, notes: string, actor: Actor) => {
    set((state) => {
      const team = state.teams.find((t) => t.id === teamId);
      if (!team) return state;

      const updatedTeam: Team = {
        ...team,
        notes,
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: actor.type === "admin" ? "Admin" : team.name,
      };

      const auditEvent = createAuditEvent(
        "EDIT_NOTES",
        actor,
        teamId,
        { from: team.notes, to: notes }
      );

      return {
        teams: state.teams.map((t) => (t.id === teamId ? updatedTeam : t)),
        auditLog: [auditEvent, ...state.auditLog],
      };
    });
  },

  setTeamName: async (teamId: string, name: string, actor: Actor) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Optimistically update UI
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId ? { ...t, name: trimmedName } : t
      ),
    }));

    // Sync with API
    await apiCall(`/api/teams/${teamId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: { name: trimmedName },
        actor,
      }),
    });

    // Refresh data
    get().fetchAllData();
  },

  setTeamIcon: async (teamId: string, icon: string, actor: Actor) => {
    if (!icon.trim()) return;

    // Optimistically update UI
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId ? { ...t, horseIcon: icon } : t
      ),
    }));

    // Sync with API
    await apiCall(`/api/teams/${teamId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: { horseIcon: icon },
        actor,
      }),
    });

    // Refresh data
    get().fetchAllData();
  },

  updateTask: async (taskId: number, updates: Partial<Task>, actor: Actor) => {
    // Optimistically update UI
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates, id: taskId } : t
      ),
    }));

    // Sync with API
    await apiCall(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates, actor }),
    });

    // Refresh data
    get().fetchAllData();
  },

  addLink: (teamId: string, link: Link, actor: Actor) => {
    set((state) => {
      const team = state.teams.find((t) => t.id === teamId);
      if (!team) return state;

      const updatedTeam: Team = {
        ...team,
        links: [...team.links, link],
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: actor.type === "admin" ? "Admin" : team.name,
      };

      const auditEvent = createAuditEvent(
        "ADD_LINK",
        actor,
        teamId,
        { link }
      );

      return {
        teams: state.teams.map((t) => (t.id === teamId ? updatedTeam : t)),
        auditLog: [auditEvent, ...state.auditLog],
      };
    });
  },

  removeLink: (teamId: string, linkId: string, actor: Actor) => {
    set((state) => {
      const team = state.teams.find((t) => t.id === teamId);
      if (!team) return state;

      const removedLink = team.links.find((l) => l.id === linkId);
      const updatedTeam: Team = {
        ...team,
        links: team.links.filter((l) => l.id !== linkId),
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: actor.type === "admin" ? "Admin" : team.name,
      };

      const auditEvent = createAuditEvent(
        "REMOVE_LINK",
        actor,
        teamId,
        { link: removedLink }
      );

      return {
        teams: state.teams.map((t) => (t.id === teamId ? updatedTeam : t)),
        auditLog: [auditEvent, ...state.auditLog],
      };
    });
  },

  lockTask: (taskId: number, locked: boolean, actor: Actor) => {
    set((state) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (!task) return state;

      const updatedTask: Task = { ...task, locked };

      const auditEvent = createAuditEvent(
        locked ? "LOCK_TASK" : "UNLOCK_TASK",
        actor,
        "global",
        { taskId, locked }
      );

      return {
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        auditLog: [auditEvent, ...state.auditLog],
      };
    });
  },

  resetTeam: (teamId: string, actor: Actor) => {
    set((state) => {
      const team = state.teams.find((t) => t.id === teamId);
      if (!team) return state;

      const oldState = {
        progress: team.progress,
        notes: team.notes,
        links: team.links,
      };

      const updatedTeam: Team = {
        ...team,
        progress: Array(10).fill(false),
        notes: "",
        links: [],
        updatedAt: new Date().toISOString(),
        lastUpdatedBy: "Admin",
      };

      const auditEvent = createAuditEvent(
        "RESET_TEAM",
        actor,
        teamId,
        { oldState }
      );

      return {
        teams: state.teams.map((t) => (t.id === teamId ? updatedTeam : t)),
        auditLog: [auditEvent, ...state.auditLog],
      };
    });
  },

  undoLast: (teamId: string, actor: Actor) => {
    set((state) => {
      const lastEvent = state.auditLog.find(
        (event) =>
          event.teamId === teamId &&
          ["TOGGLE_TASK", "EDIT_NOTES", "ADD_LINK", "REMOVE_LINK"].includes(
            event.action
          )
      );

      if (!lastEvent) return state;

      const team = state.teams.find((t) => t.id === teamId);
      if (!team) return state;

      let updatedTeam = { ...team };

      switch (lastEvent.action) {
        case "TOGGLE_TASK": {
          const { taskIndex, from } = lastEvent.payload;
          updatedTeam.progress = [...team.progress];
          updatedTeam.progress[taskIndex] = from;
          break;
        }
        case "EDIT_NOTES": {
          const { from } = lastEvent.payload;
          updatedTeam.notes = from;
          break;
        }
        case "ADD_LINK": {
          const { link } = lastEvent.payload;
          updatedTeam.links = team.links.filter((l) => l.id !== link.id);
          break;
        }
        case "REMOVE_LINK": {
          const { link } = lastEvent.payload;
          updatedTeam.links = [...team.links, link];
          break;
        }
      }

      updatedTeam.updatedAt = new Date().toISOString();
      updatedTeam.lastUpdatedBy = "Admin (Undo)";

      const undoEvent = createAuditEvent("UNDO", actor, teamId, {
        undoneEvent: lastEvent,
      });

      return {
        teams: state.teams.map((t) => (t.id === teamId ? updatedTeam : t)),
        auditLog: [undoEvent, ...state.auditLog],
      };
    });
  },

  // Scorecard actions
  saveScorecard: async (scorecard: Scorecard) => {
    // Optimistically update UI
    set((state) => {
      const existingIndex = state.scorecards.findIndex(
        (s) => s.judgeId === scorecard.judgeId && s.teamId === scorecard.teamId
      );

      if (existingIndex >= 0) {
        const updatedScorecards = [...state.scorecards];
        updatedScorecards[existingIndex] = scorecard;
        return { scorecards: updatedScorecards };
      } else {
        return { scorecards: [...state.scorecards, scorecard] };
      }
    });

    // Sync with API
    await apiCall('/api/scorecards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scorecard),
    });

    // Refresh data
    get().fetchAllData();
  },

  submitScorecard: (scorecardId: string) => {
    set((state) => {
      const scorecardIndex = state.scorecards.findIndex((s) => s.id === scorecardId);
      if (scorecardIndex < 0) return state;

      const updatedScorecards = [...state.scorecards];
      updatedScorecards[scorecardIndex] = {
        ...updatedScorecards[scorecardIndex],
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { scorecards: updatedScorecards };
    });
  },

  updateRubric: async (rubric: RubricCriterion[]) => {
    // Optimistically update UI
    set({ rubric });

    // Sync with API
    await apiCall('/api/rubric', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rubric),
    });

    // Refresh data
    get().fetchAllData();
  },

  getScorecard: (judgeId: string, teamId: string) => {
    const state = get();
    return state.scorecards.find(
      (s) => s.judgeId === judgeId && s.teamId === teamId
    );
  },

  // Finalist management
  setFinalistTeamIds: async (teamIds: string[]) => {
    // Optimistically update UI
    set({ finalistTeamIds: teamIds });

    // Sync with API
    await apiCall('/api/finalists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamIds),
    });

    // Refresh data
    get().fetchAllData();
  },

  toggleFinalist: async (teamId: string) => {
    const state = get();
    const isFinalist = state.finalistTeamIds.includes(teamId);
    const newFinalistIds = isFinalist
      ? state.finalistTeamIds.filter((id) => id !== teamId)
      : [...state.finalistTeamIds, teamId];

    await get().setFinalistTeamIds(newFinalistIds);
  },

  // Reset all data to initial seed values via API
  resetAllData: async (password: string) => {
    const result = await apiCall<{ success: boolean; message: string }>('/api/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (result?.success) {
      // Refresh all data from API
      await get().fetchAllData();
    }
  },
}));

// Auto-fetch data on store creation
if (typeof window !== 'undefined') {
  useStore.getState().fetchAllData();
  
  // Poll for updates every 5 seconds
  setInterval(() => {
    useStore.getState().fetchAllData();
  }, 5000);
}
