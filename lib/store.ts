import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, Actor, AuditEvent, Link, Team, Task } from "./types";
import { INITIAL_TASKS, INITIAL_TEAMS } from "./seed";
import { generateId } from "./utils";

interface StoreState extends AppState {
  // Actions
  toggleTask: (teamId: string, taskIndex: number, actor: Actor) => void;
  setNotes: (teamId: string, notes: string, actor: Actor) => void;
  setTeamName: (teamId: string, name: string, actor: Actor) => void;
  setTeamIcon: (teamId: string, icon: string, actor: Actor) => void;
  addLink: (teamId: string, link: Link, actor: Actor) => void;
  removeLink: (teamId: string, linkId: string, actor: Actor) => void;
  lockTask: (taskId: number, locked: boolean, actor: Actor) => void;
  resetTeam: (teamId: string, actor: Actor) => void;
  undoLast: (teamId: string, actor: Actor) => void;
  initializeStore: () => void;
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

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      tasks: INITIAL_TASKS,
      teams: INITIAL_TEAMS,
      auditLog: [],

      initializeStore: () => {
        const state = get();
        if (state.teams.length === 0) {
          set({
            tasks: INITIAL_TASKS,
            teams: INITIAL_TEAMS,
            auditLog: [],
          });
        }
      },

      toggleTask: (teamId: string, taskIndex: number, actor: Actor) => {
        set((state) => {
          const team = state.teams.find((t) => t.id === teamId);
          if (!team) return state;

          const task = state.tasks[taskIndex];
          // If task is locked and actor is not admin, don't allow toggle
          if (task?.locked && actor.type !== "admin") {
            return state;
          }

          const newProgress = [...team.progress];
          const oldValue = newProgress[taskIndex];
          newProgress[taskIndex] = !oldValue;

          const updatedTeam: Team = {
            ...team,
            progress: newProgress,
            updatedAt: new Date().toISOString(),
            lastUpdatedBy: actor.type === "admin" ? "Admin" : team.name,
          };

          const auditEvent = createAuditEvent(
            "TOGGLE_TASK",
            actor,
            teamId,
            { taskIndex, from: oldValue, to: !oldValue }
          );

          return {
            teams: state.teams.map((t) => (t.id === teamId ? updatedTeam : t)),
            auditLog: [auditEvent, ...state.auditLog],
          };
        });
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

      setTeamName: (teamId: string, name: string, actor: Actor) => {
        set((state) => {
          const team = state.teams.find((t) => t.id === teamId);
          if (!team) return state;

          // Validate name is not empty
          const trimmedName = name.trim();
          if (!trimmedName) return state;

          const updatedTeam: Team = {
            ...team,
            name: trimmedName,
            updatedAt: new Date().toISOString(),
            lastUpdatedBy: actor.type === "admin" ? "Admin" : trimmedName,
          };

          const auditEvent = createAuditEvent(
            "EDIT_NOTES", // Reusing EDIT_NOTES action type for simplicity
            actor,
            teamId,
            { from: team.name, to: trimmedName, field: "name" }
          );

          return {
            teams: state.teams.map((t) => (t.id === teamId ? updatedTeam : t)),
            auditLog: [auditEvent, ...state.auditLog],
          };
        });
      },

      setTeamIcon: (teamId: string, icon: string, actor: Actor) => {
        set((state) => {
          const team = state.teams.find((t) => t.id === teamId);
          if (!team) return state;

          // Validate icon is not empty
          if (!icon.trim()) return state;

          const updatedTeam: Team = {
            ...team,
            horseIcon: icon,
            updatedAt: new Date().toISOString(),
            lastUpdatedBy: actor.type === "admin" ? "Admin" : team.name,
          };

          const auditEvent = createAuditEvent(
            "EDIT_NOTES", // Reusing EDIT_NOTES action type for simplicity
            actor,
            teamId,
            { from: team.horseIcon, to: icon, field: "icon" }
          );

          return {
            teams: state.teams.map((t) => (t.id === teamId ? updatedTeam : t)),
            auditLog: [auditEvent, ...state.auditLog],
          };
        });
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

          // Create audit event for first team (representative)
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
          // Find the last mutable action for this team
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

          // Revert the action
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
    }),
    {
      name: "hackathon-racetrack-storage",
      // TODO: Replace with real database persistence when scaling
    }
  )
);

