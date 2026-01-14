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
    title: "Name your team",
    description: "Pick a memorable name for your team and update team details.",
    dueDate: "2026-01-20T18:00:00Z",
    locked: false,
  },
  {
    id: 2,
    title: "Define your winning idea",
    description: "Submit details of your problem statement. What pain are you solving and why it matters",
    dueDate: "2026-01-20T20:00:00Z",
    locked: false,
  },
  {
    id: 3,
    title: "Share the Vibe",
    description: "Create a graphics or visual that captures the problem, pain or the vibe of your team and post it to #gko-fy2027-se-hackathon",
    dueDate: "2026-01-20T00:00:00Z",
    locked: false,
  },
  {
    id: 4,
    title: "Progress Ping",
    description: "Post a quick progress. Keep the momentum visible and the hype alive",
    dueDate: "2026-02-01T14:00:00Z",
    locked: false,
  },
  {
    id: 5,
    title: "Make it Real!",
    description: "Build a functional prototype (rough edges are fine!)",
    dueDate: "2026-02-10T06:00:00Z",
    locked: false,
  },
  {
    id: 6,
    title: "Cross-Team Jam",
    description: "Collaborate or get feedback from at least one x-functional partner (product, eng)",
    dueDate: "2026-02-10T10:00:00Z",
    locked: false,
  },
  {
    id: 7,
    title: "Learning Drop 💡",
    description: "Share one new thing you learned in the channel. Bonus points if it helps others.",
    dueDate: "2026-02-10T16:00:00Z",
    locked: false,
  },
  {
    id: 8,
    title: "How-To Guide 📖",
    description: "Create some documentation: what it is, when to use it, how it works etc.",
    dueDate: "2026-02-20T18:00:00Z",
    locked: false,
  },
  {
    id: 9,
    title: "Audition Video 🎥",
    description: "Submit a short pitch video to qualify for finals. Clear, crisp and compelling.",
    dueDate: "2026-02-20T20:00:00Z",
    locked: false,
  },
  {
    id: 10,
    title: "Ready for the spotlight 🏆",
    description: "Turn in your final presentation deck - this is what you'll use if you present live at GKO",
    dueDate: "2026-02-20T22:00:00Z",
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

