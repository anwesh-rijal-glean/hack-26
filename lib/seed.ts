import { Task, Team } from "./types";

// Team user credentials
export interface TeamUser {
  username: string;
  password: string;
  teamId: string;
}

export const TEAM_USERS: TeamUser[] = Array.from({ length: 20 }, (_, i) => ({
  username: `team${i + 1}`,
  password: `hackathon2026-${i + 1}`,
  teamId: `team-${i + 1}`,
}));

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Team Registration",
    description: "Register your team and submit project idea",
    dueDate: "2026-01-13T18:00:00Z",
    locked: false,
  },
  {
    id: 2,
    title: "Project Proposal",
    description: "Submit detailed project proposal and tech stack",
    dueDate: "2026-01-13T20:00:00Z",
    locked: false,
  },
  {
    id: 3,
    title: "Initial Prototype",
    description: "Create basic working prototype",
    dueDate: "2026-01-14T00:00:00Z",
    locked: false,
  },
  {
    id: 4,
    title: "Core Features",
    description: "Implement main features of the project",
    dueDate: "2026-01-14T06:00:00Z",
    locked: false,
  },
  {
    id: 5,
    title: "UI/UX Polish",
    description: "Improve design and user experience",
    dueDate: "2026-01-14T10:00:00Z",
    locked: false,
  },
  {
    id: 6,
    title: "Testing & Debugging",
    description: "Test all features and fix bugs",
    dueDate: "2026-01-14T14:00:00Z",
    locked: false,
  },
  {
    id: 7,
    title: "Documentation",
    description: "Write README and setup instructions",
    dueDate: "2026-01-14T16:00:00Z",
    locked: false,
  },
  {
    id: 8,
    title: "Demo Video",
    description: "Record demo video of the project",
    dueDate: "2026-01-14T18:00:00Z",
    locked: false,
  },
  {
    id: 9,
    title: "Presentation Slides",
    description: "Prepare final presentation",
    dueDate: "2026-01-14T20:00:00Z",
    locked: false,
  },
  {
    id: 10,
    title: "Final Submission",
    description: "Submit project and all deliverables",
    dueDate: "2026-01-14T22:00:00Z",
    locked: false,
  },
];

const TEAM_NAMES = [
  "Team 1 - Code Ninjas",
  "Team 2 - Bug Busters",
  "Team 3 - Syntax Samurai",
  "Team 4 - Pixel Pioneers",
  "Team 5 - Data Dragons",
  "Team 6 - Cloud Crusaders",
  "Team 7 - Binary Bandits",
  "Team 8 - Algorithm Avengers",
  "Team 9 - Dev Dynamos",
  "Team 10 - Hack Heroes",
  "Team 11 - Stack Smashers",
  "Team 12 - Logic Legends",
  "Team 13 - Byte Brawlers",
  "Team 14 - Script Soldiers",
  "Team 15 - Tech Titans",
  "Team 16 - Cyber Cyclones",
  "Team 17 - Digital Dreamers",
  "Team 18 - Quantum Questers",
  "Team 19 - Code Commanders",
  "Team 20 - Hacking Wizards",
];

const HORSE_ICONS = [
  "🐎", "🏇", "🦄", "🐴", "🎠",
  "🐎", "🏇", "🦄", "🐴", "🎠",
  "🐎", "🏇", "🦄", "🐴", "🎠",
  "🐎", "🏇", "🦄", "🐴", "🎠",
];

const COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#fb923c", "#fbbf24", "#a3e635",
];

export const INITIAL_TEAMS: Team[] = TEAM_NAMES.map((name, index) => ({
  id: `team-${index + 1}`,
  name,
  horseIcon: HORSE_ICONS[index],
  color: COLORS[index],
  progress: Array(10).fill(false),
  notes: "",
  links: [],
  updatedAt: new Date().toISOString(),
  lastUpdatedBy: "",
}));

