import { TEAM_USERS } from "./seed";

export interface AuthenticatedUser {
  username: string;
  teamId: string;
  type: "team" | "admin";
}

// Team authentication
export function authenticateTeam(
  username: string,
  password: string
): AuthenticatedUser | null {
  const user = TEAM_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    return {
      username: user.username,
      teamId: user.teamId,
      type: "team",
    };
  }

  return null;
}

// Admin authentication
const ADMIN_PASSWORD = "hackathon2026";

export function authenticateAdmin(password: string): AuthenticatedUser | null {
  if (password === ADMIN_PASSWORD) {
    return {
      username: "admin",
      teamId: "admin",
      type: "admin",
    };
  }
  return null;
}

// Session management
const TEAM_AUTH_KEY = "team-auth";
const ADMIN_AUTH_KEY = "admin-authed";

export function saveTeamAuth(user: AuthenticatedUser): void {
  sessionStorage.setItem(TEAM_AUTH_KEY, JSON.stringify(user));
}

export function getTeamAuth(): AuthenticatedUser | null {
  const data = sessionStorage.getItem(TEAM_AUTH_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }
  return null;
}

export function clearTeamAuth(): void {
  sessionStorage.removeItem(TEAM_AUTH_KEY);
}

export function saveAdminAuth(): void {
  sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
}

export function isAdminAuthed(): boolean {
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function clearAdminAuth(): void {
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
}
