import { Task, Team, RubricCriterion } from "./types";

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

// Judge user credentials
export interface JudgeUser {
  id: string;
  name: string;
  username: string;
  password: string;
}

export const JUDGE_USERS: JudgeUser[] = [
  { id: "judge-1", name: "Judge 1", username: "judge1", password: "hackathon2026-j1" },
  { id: "judge-2", name: "Judge 2", username: "judge2", password: "hackathon2026-j2" },
  { id: "judge-3", name: "Judge 3", username: "judge3", password: "hackathon2026-j3" },
  { id: "judge-4", name: "Judge 4", username: "judge4", password: "hackathon2026-j4" },
  { id: "judge-5", name: "Judge 5", username: "judge5", password: "hackathon2026-j5" },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: "Name your team 🏷️",
    description: "Pick a memorable name for your team and update team details.",
    dueDate: "2026-01-20T20:00:00Z",
    locked: false,
  },
  {
    id: 2,
    title: "Define your winning idea 💡",
    description: "Submit details of your problem statement. What pain are you solving and why it matters",
    dueDate: "2026-01-20T20:00:00Z",
    locked: false,
  },
  {
    id: 3,
    title: "Share the Vibe 🎨",
    description: "Create a graphics or visual that captures the problem, pain or the vibe of your team and post it to #gko-fy2027-se-hackathon",
    dueDate: "2026-01-20T20:00:00Z",
    locked: false,
  },
  {
    id: 4,
    title: "Progress Ping 📢",
    description: "Post a quick progress. Keep the momentum visible and the hype alive",
    dueDate: "2026-02-01T20:00:00Z",
    locked: false,
  },
  {
    id: 5,
    title: "Make it Real! ⚙️",
    description: "Build a functional prototype (rough edges are fine!)",
    dueDate: "2026-02-10T20:00:00Z",
    locked: false,
  },
  {
    id: 6,
    title: "Cross-Team Jam 🤝",
    description: "Collaborate or get feedback from at least one x-functional partner (product, eng)",
    dueDate: "2026-02-10T20:00:00Z",
    locked: false,
  },
  {
    id: 7,
    title: "Learning Drop 📘",
    description: "Share one new thing you learned in the channel. Bonus points if it helps others.",
    dueDate: "2026-02-10T20:00:00Z",
    locked: false,
  },
  {
    id: 8,
    title: "How-To Guide 📖",
    description: "Create some documentation: what it is, when to use it, how it works etc.",
    dueDate: "2026-02-20T20:00:00Z",
    locked: false,
  },
  {
    id: 9,
    title: "Audition Demo Video 🎥",
    description: "Submit a short pitch video of your project to qualify for finals. Clear, crisp and compelling.",
    dueDate: "2026-02-20T20:00:00Z",
    locked: false,
  },
  {
    id: 10,
    title: "Ready for the spotlight 🏆",
    description: "Turn in your final presentation deck - this is what you'll use if you present live at GKO",
    dueDate: "2026-02-20T20:00:00Z",
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
  "🐎", "🏇", "🐎", "🏇", "🎠", 
  "🐎", "🏇", "🐎", "🏇", "🎠",
  "🐎", "🏇", "🐎", "🏇", "🎠",
  "🐎", "🏇", "🐎", "🏇", "🎠",
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

// Judging Rubric
export const INITIAL_RUBRIC: RubricCriterion[] = [
  {
    id: "criterion-1",
    title: "Problem Relevance",
    description: "How relevant and meaningful is the problem to Glean and/or customers?",
    maxPoints: 20,
  },
  {
    id: "criterion-2",
    title: "Use of Glean",
    description: "Is Glean used meaningfully and creatively?",
    maxPoints: 20,
  },
  {
    id: "criterion-3",
    title: "Innovation",
    description: "Is the solution bold, creative, or original?",
    maxPoints: 20,
  },
  {
    id: "criterion-4",
    title: "Functionality",
    description: "Does the demo work (real or mock data)?",
    maxPoints: 10,
  },
  {
    id: "criterion-5",
    title: "Team Participation",
    description: "Does each team member have a role in the project?",
    maxPoints: 10,
  },
  {
    id: "criterion-6",
    title: "Value Demonstrated",
    description: "Does it clearly solve a problem or add value?",
    maxPoints: 20,
  },
];

// List of finalist team IDs (top 10 teams that will be judged)
export const FINALIST_TEAM_IDS: string[] = [
  "team-1", "team-2", "team-3", "team-4", "team-5",
  "team-6", "team-7", "team-8", "team-9", "team-10",
];
