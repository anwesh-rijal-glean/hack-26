# 🏁 Hackathon Race Track

A real-time progress tracking application for hackathon competitions. Track 20 teams as they compete to complete 10 milestones, visualized as horses racing on a track!

## 🚀 Features

### Team View
- **Progress Tracking**: Teams can check off completed milestones
- **Notes Management**: Add and edit team notes
- **Evidence Links**: Submit links to demos, repos, and documentation
- **Live Leaderboard**: See your position relative to other teams
- **Task Locking**: Respects admin-locked tasks
- **Confetti Celebration**: Automatic celebration when all tasks are completed!

### Admin View
- **Full Oversight**: Monitor all 20 teams simultaneously
- **Task Management**: Lock/unlock tasks globally
- **Team Controls**: Undo last changes or reset teams completely
- **Audit Trail**: Complete history of all actions with timestamps
- **Override Permissions**: Edit any team's progress, notes, and links
- **Password Protection**: Simple password gate (v1)

### Visual Race Track
- **20 Lanes**: One lane per team with smooth animations
- **Progress Indicators**: Visual checkpoints from start (0) to finish (10)
- **Live Rankings**: Real-time leaderboard with top 10 teams
- **Team Indicators**: Emoji horses with team colors
- **Responsive Design**: Works on desktop and tablet

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand with localStorage persistence
- **Authentication**: Client-side with sessionStorage (v1)
- **Animations**: CSS transitions + canvas-confetti
- **Icons**: Lucide React

## 📦 Installation

### Prerequisites
- Node.js 18+ or compatible package manager (npm, pnpm, yarn)

### Setup Steps

1. **Install dependencies**:
```bash
npm install
# or
pnpm install
# or
yarn install
```

2. **Run development server**:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

3. **Open in browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### For Teams

1. Go to **Team View** from the homepage
2. Login with your team credentials:
   - Username: `team1` to `team20` (e.g., `team5`)
   - Password: `hackathon2026-1` to `hackathon2026-20` (e.g., `hackathon2026-5`)
3. You'll only see your own team's dashboard (cannot view other teams)
4. Check off tasks as you complete them (locked tasks can't be modified)
5. Add notes about your progress
6. Submit evidence links (GitHub repo, demo video, etc.)
7. Watch your horse advance on the race track!
8. Logout when done to protect your team's data

**Important**: Each team can only edit their own progress. You cannot modify other teams' data.

### For Admins

1. Go to **Admin View** from the homepage
2. Enter password: `hackathon2026`
3. Monitor all teams on the dashboard
4. Lock/unlock tasks to control the competition flow
5. Click "View" on any team to see full details and audit log
6. Use "Undo" to revert the last change for a team
7. Use "Reset" to completely reset a team (requires confirmation)

## 📊 Data Model

### Team Structure
```typescript
{
  id: string,
  name: string,
  horseIcon: string, // emoji
  color: string,
  progress: boolean[10], // 10 milestones
  notes: string,
  links: { id, label, url }[],
  updatedAt: string,
  lastUpdatedBy: string
}
```

### Task Structure
```typescript
{
  id: number, // 1-10
  title: string,
  description?: string,
  dueDate?: string,
  locked?: boolean
}
```

### Audit Event Structure
```typescript
{
  id: string,
  ts: string,
  actor: { type: "team" | "admin", id: string },
  action: "TOGGLE_TASK" | "EDIT_NOTES" | etc.,
  teamId: string,
  payload?: any
}
```

## 🎯 Ranking Logic

Teams are ranked by:
1. **Primary**: Number of completed tasks (descending)
2. **Tiebreaker**: Last updated timestamp (ascending - earlier is better)

This means if two teams have the same progress, the one who reached that milestone first ranks higher.

## 🏗️ Project Structure

```
hackathon/
├── app/
│   ├── page.tsx           # Landing page
│   ├── team/
│   │   └── page.tsx       # Team view
│   ├── admin/
│   │   └── page.tsx       # Admin view
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                # Basic UI components
│   ├── Racetrack.tsx      # Main race visualization
│   ├── TeamSelector.tsx   # Team dropdown
│   ├── TaskChecklist.tsx  # Task list with checkboxes
│   ├── LinksManager.tsx   # Evidence links manager
│   ├── AdminTable.tsx     # Teams overview table
│   ├── TaskLockControls.tsx
│   ├── TeamDetailDrawer.tsx
│   ├── AuditLog.tsx
│   └── AdminPasswordGate.tsx
├── lib/
│   ├── store.ts           # Zustand store
│   ├── types.ts           # TypeScript definitions
│   ├── seed.ts            # Initial data
│   └── utils.ts           # Helper functions
└── package.json
```

## 🔄 State Management

The app uses **Zustand** for state management with localStorage persistence:

- State is automatically saved to `localStorage`
- Data persists across page refreshes
- All changes trigger audit log entries
- Admin actions are clearly marked in the audit trail

## 🚧 TODO: Production Readiness

This is a v1 implementation for quick deployment. For production, consider:

### Authentication & Authorization
- [ ] Replace simple password gate with real authentication (Auth0, NextAuth, etc.)
- [ ] Implement proper team-based authentication
- [ ] Add role-based access control (RBAC)
- [ ] Use JWTs or session tokens

### Backend & Database
- [ ] Replace localStorage with a real database (PostgreSQL, MongoDB, etc.)
- [ ] Create API routes for CRUD operations
- [ ] Implement real-time updates (WebSockets, Server-Sent Events, or Pusher)
- [ ] Add data validation and sanitization
- [ ] Implement rate limiting

### Features
- [ ] Email/Slack notifications for milestone completions
- [ ] Export data to CSV/JSON
- [ ] Team chat/messaging
- [ ] File upload for evidence (not just links)
- [ ] Multi-event support (multiple hackathons)
- [ ] Custom milestone configuration per event

### DevOps
- [ ] Set up CI/CD pipeline
- [ ] Add comprehensive testing (unit, integration, e2e)
- [ ] Implement proper error handling and logging
- [ ] Add monitoring and analytics
- [ ] Set up staging environment

### Performance
- [ ] Optimize for 100+ teams
- [ ] Implement pagination for large datasets
- [ ] Add caching strategies
- [ ] Optimize bundle size

## 🎨 Customization

### Adding More Teams
Edit `lib/seed.ts` and add team names, icons, and colors to the arrays.

### Modifying Tasks
Edit `INITIAL_TASKS` in `lib/seed.ts` to change milestone titles, descriptions, and due dates.

### Changing Team/Admin Passwords
- **Team passwords**: Edit `TEAM_USERS` array in `lib/seed.ts`
- **Admin password**: Edit `ADMIN_PASSWORD` in `lib/auth.ts`
- **Note**: These are temporary client-side solutions - use real authentication in production

### Styling
The app uses Tailwind CSS. Edit `tailwind.config.ts` for theme customization or modify component styles directly.

## 🐛 Troubleshooting

### State not persisting
- Clear browser localStorage and refresh
- Check browser console for errors
- Ensure you're using a modern browser with localStorage support

### Tasks not updating
- Check if the task is locked (admin can unlock)
- Ensure you've selected a team in Team View
- Check the audit log for recent changes

### Admin view not loading
- Verify password is correct: `hackathon2026`
- Clear sessionStorage and try again
- Check browser console for errors

## 📝 License

MIT License - feel free to use this for your hackathon!

## 🤝 Contributing

This is a hackathon project, but PRs are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🎉 Credits

Built with ❤️ for hackathon organizers and participants.

---

**Happy Hacking! May the best team win! 🏆**

