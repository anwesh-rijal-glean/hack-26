import { create } from "zustand";
import { AppState, Actor, AuditEvent, Team, Task, Scorecard, RubricCriterion } from "./types";
import { INITIAL_TASKS, INITIAL_TEAMS, INITIAL_RUBRIC, FINALIST_TEAM_IDS } from "./seed";
import { generateId } from "./utils";

interface StoreState extends AppState {
  // Loading state
  isLoading: boolean;
  // Actions
  fetchAllData: () => Promise<void>;
  toggleTask: (teamId: string, taskIndex: number, actor: Actor) => Promise<void>;
  setTeamName: (teamId: string, name: string, actor: Actor) => Promise<void>;
  setTeamIcon: (teamId: string, icon: string, actor: Actor) => Promise<void>;
  updateTask: (taskId: number, updates: Partial<Task>, actor: Actor) => Promise<void>;
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
// Forces fresh data from database, no caching at any level
async function apiCall<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const fetchOptions: RequestInit = {
      ...options,
      cache: 'no-store', // Next.js: don't cache
      headers: {
        ...options?.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    };
    
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      console.error(`❌ API call failed: ${url}`, response.statusText);
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error(`❌ API call error: ${url}`, error);
    return null;
  }
}

export const useStore = create<StoreState>((set, get) => {
  return {
    // Start with empty arrays - will be populated from database
    tasks: [],
    teams: [],
    auditLog: [],
    rubric: [],
    scorecards: [],
    finalistTeamIds: [],
    lastFetchTimestamp: 0,
    isLoading: false,

  // Fetch all data from API - always fresh from database, no caching
  fetchAllData: async () => {
    set({ isLoading: true });
    try {
      // Add cache-busting timestamp + random to ensure absolutely no caching
      const cacheBust = `${Date.now()}-${Math.random()}`;
      
      const [teams, tasks, auditLog, scorecards, rubric, finalistIds] = await Promise.all([
        apiCall<Team[]>(`/api/teams?_=${cacheBust}`),
        apiCall<Task[]>(`/api/tasks?_=${cacheBust}`),
        apiCall<AuditEvent[]>(`/api/audit?_=${cacheBust}`),
        apiCall<Scorecard[]>(`/api/scorecards?_=${cacheBust}`),
        apiCall<RubricCriterion[]>(`/api/rubric?_=${cacheBust}`),
        apiCall<string[]>(`/api/finalists?_=${cacheBust}`),
      ]);

      // Always update with fresh data from database
      // Deep clone to ensure new object references for React re-renders
      const fetchTimestamp = Date.now();
      const newState = {
        teams: teams ? teams.map(t => ({ ...t, progress: [...t.progress] })) : [],
        tasks: tasks ? tasks.map(t => ({ ...t })) : [],
        auditLog: auditLog ? auditLog.map(a => ({ ...a })) : [],
        scorecards: scorecards ? scorecards.map(s => ({ ...s })) : [],
        rubric: rubric ? rubric.map(r => ({ ...r })) : [],
        finalistTeamIds: finalistIds ? [...finalistIds] : [],
        lastFetchTimestamp: fetchTimestamp,
        isLoading: false,
      };

      set(newState);
    } catch (error) {
      console.error('❌ Error fetching data from database:', error);
      set({ isLoading: false });
    }
  },

  initializeStore: async () => {
    const state = get();
    if (state.teams.length === 0) {
      console.log('📦 Initializing store from database...');
      await get().fetchAllData();
    }
  },

  toggleTask: async (teamId: string, taskIndex: number, actor: Actor) => {
    const state = get();
    const team = state.teams.find((t) => t.id === teamId);
    if (!team) return;

    const task = state.tasks[taskIndex];
    // If task is locked and actor is not admin, don't allow toggle
    if (task?.locked && actor.type !== "admin") return;

    const oldProgress = [...team.progress];
    const newProgress = [...team.progress];
    newProgress[taskIndex] = !newProgress[taskIndex];
    
    const lastUpdatedBy = actor.type === "admin" ? "Admin" : team.name;

    // Optimistically update UI
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId ? { 
          ...t, 
          progress: newProgress,
          lastUpdatedBy,
          updatedAt: new Date().toISOString(),
        } : t
      ),
    }));

    // Sync with API
    const result = await apiCall(`/api/teams/${teamId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: { 
          progress: newProgress,
          lastUpdatedBy,
        },
        actor,
      }),
    });

    // If API call failed, revert the optimistic update
    if (!result) {
      console.error('Failed to toggle task - reverting change');
      set((state) => ({
        teams: state.teams.map((t) =>
          t.id === teamId ? { ...t, progress: oldProgress } : t
        ),
      }));
      return;
    }

    // Don't refresh - optimistic update is already correct
  },


  setTeamName: async (teamId: string, name: string, actor: Actor) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Store old name for potential revert
    const state = get();
    const team = state.teams.find((t) => t.id === teamId);
    const oldName = team?.name || '';
    
    const lastUpdatedBy = actor.type === "admin" ? "Admin" : team?.name || "Unknown";

    // Optimistically update UI
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId ? { 
          ...t, 
          name: trimmedName,
          lastUpdatedBy,
          updatedAt: new Date().toISOString(),
        } : t
      ),
    }));

    // Sync with API
    const result = await apiCall(`/api/teams/${teamId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: { 
          name: trimmedName,
          lastUpdatedBy,
        },
        actor,
      }),
    });

    // If API call failed, revert the optimistic update
    if (!result) {
      console.error('Failed to save team name - reverting change');
      set((state) => ({
        teams: state.teams.map((t) =>
          t.id === teamId ? { ...t, name: oldName } : t
        ),
      }));
      throw new Error('Failed to save team name');
    }

    // Don't refresh - optimistic update is already correct
  },

  setTeamIcon: async (teamId: string, icon: string, actor: Actor) => {
    if (!icon.trim()) return;

    // Store old icon for potential revert
    const state = get();
    const team = state.teams.find((t) => t.id === teamId);
    const oldIcon = team?.horseIcon || '🐴';
    
    const lastUpdatedBy = actor.type === "admin" ? "Admin" : team?.name || "Unknown";

    // Optimistically update UI
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId ? { 
          ...t, 
          horseIcon: icon,
          lastUpdatedBy,
          updatedAt: new Date().toISOString(),
        } : t
      ),
    }));

    // Sync with API
    const result = await apiCall(`/api/teams/${teamId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: { 
          horseIcon: icon,
          lastUpdatedBy,
        },
        actor,
      }),
    });

    // If API call failed, revert the optimistic update
    if (!result) {
      console.error('Failed to save team icon - reverting change');
      set((state) => ({
        teams: state.teams.map((t) =>
          t.id === teamId ? { ...t, horseIcon: oldIcon } : t
        ),
      }));
      throw new Error('Failed to save team icon');
    }

    // Don't refresh - optimistic update is already correct
  },

  updateTask: async (taskId: number, updates: Partial<Task>, actor: Actor) => {
    // Store old task state for potential revert
    const state = get();
    const oldTask = state.tasks.find((t) => t.id === taskId);
    if (!oldTask) return;

    // Optimistically update UI
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates, id: taskId } : t
      ),
    }));

    // Sync with API
    const result = await apiCall(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates, actor }),
    });

    // If API call failed, revert the optimistic update
    if (!result) {
      console.error('Failed to update task - reverting change');
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? oldTask : t
        ),
      }));
      throw new Error('Failed to update task');
    }

    // Don't refresh - optimistic update is already correct
  },

  lockTask: async (taskId: number, locked: boolean, actor: Actor) => {
    // Store old lock state for potential revert
    const state = get();
    const task = state.tasks.find((t) => t.id === taskId);
    const oldLocked = task?.locked || false;

    // Optimistically update UI
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, locked } : t
      ),
    }));

    // Sync with API
    const result = await apiCall(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates: { locked },
        actor,
      }),
    });

    // If API call failed, revert the optimistic update
    if (!result) {
      console.error('Failed to lock/unlock task - reverting change');
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? { ...t, locked: oldLocked } : t
        ),
      }));
      throw new Error('Failed to lock/unlock task');
    }

    // Don't refresh - optimistic update is already correct
  },

  resetTeam: async (teamId: string, actor: Actor) => {
    const state = get();
    const team = state.teams.find((t) => t.id === teamId);
    if (!team) return;

    // Store old state for potential revert
    const oldProgress = [...team.progress];

    const updates = {
      progress: Array(10).fill(false),
      lastUpdatedBy: "Admin",
    };

    // Optimistically update UI
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    }));

    // Sync with API
    const result = await apiCall(`/api/teams/${teamId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates,
        actor,
      }),
    });

    // If API call failed, revert the optimistic update
    if (!result) {
      console.error('Failed to reset team - reverting change');
      set((state) => ({
        teams: state.teams.map((t) =>
          t.id === teamId
            ? {
                ...t,
                progress: oldProgress,
              }
            : t
        ),
      }));
      throw new Error('Failed to reset team');
    }

    // Don't refresh - optimistic update is already correct
  },

  undoLast: async (teamId: string, actor: Actor) => {
    const state = get();
    const lastEvent = state.auditLog.find(
      (event) =>
        event.teamId === teamId &&
        ["TOGGLE_TASK"].includes(event.action)
    );

    if (!lastEvent) return;

    const team = state.teams.find((t) => t.id === teamId);
    if (!team) return;

    // Store old state for potential revert
    const oldProgress = [...team.progress];

    let updates: Partial<Team> = {};

    switch (lastEvent.action) {
      case "TOGGLE_TASK": {
        const { taskIndex, from } = lastEvent.payload;
        const newProgress = [...team.progress];
        newProgress[taskIndex] = from;
        updates.progress = newProgress;
        break;
      }
    }

    updates.lastUpdatedBy = "Admin (Undo)";

    // Optimistically update UI
    set((state) => ({
      teams: state.teams.map((t) =>
        t.id === teamId
          ? {
              ...t,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    }));

    // Sync with API
    const result = await apiCall(`/api/teams/${teamId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        updates,
        actor,
      }),
    });

    // If API call failed, revert the optimistic update
    if (!result) {
      console.error('Failed to undo - reverting change');
      set((state) => ({
        teams: state.teams.map((t) =>
          t.id === teamId
            ? {
                ...t,
                progress: oldProgress,
              }
            : t
        ),
      }));
      throw new Error('Failed to undo last action');
    }

    // Don't refresh - optimistic update is already correct
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

    // Don't refresh - optimistic update is already correct
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

    // Don't refresh - optimistic update is already correct
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

    // Don't refresh - optimistic update is already correct
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
}});

// Add debug utility (client-side only)
if (typeof window !== 'undefined') {
  (window as any).debugStorage = () => {
    console.log('🔍 STORAGE DEBUG:');
    console.log('localStorage keys:', Object.keys(localStorage));
    console.log('sessionStorage keys:', Object.keys(sessionStorage));
    console.log('Current Zustand store state:', useStore.getState());
  };
  
  console.log('💡 TIP: Run debugStorage() in console to check store state');
}
