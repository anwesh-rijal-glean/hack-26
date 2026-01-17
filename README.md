# 🏁 Hackathon Race Track

A real-time progress tracking application for hackathon competitions. Track 20 teams as they compete to complete 10 milestones, visualized as horses racing on a track!

## 🚀 Features

### Live Dashboard (Home Screen)
- **Full-Screen Race Track**: View all 20 teams competing in real-time without login
- **Live Statistics**: Total teams, finished teams, average progress, and milestones
- **1920x1080 Optimized**: Perfect for displaying on venue screens
- **Public View**: Anyone can watch the competition unfold
- **Refresh to Update**: Reload the page to see latest progress

### Team View
- **Team Customization**: Edit your team name and choose from 60+ icons to personalize your identity
- **Progress Tracking**: Teams can check off completed milestones
- **Current Ranking**: See your rank among all teams at a glance
- **Notes Management**: Add and edit team notes
- **Evidence Links**: Submit links to demos, repos, and documentation
- **Task Locking**: Respects admin-locked tasks
- **Confetti Celebration**: Automatic celebration when all tasks are completed!
- **Clean Interface**: Focused view showing only your team's data

### Admin View
- **Full Oversight**: Monitor all 20 teams simultaneously
- **Task Management**: Lock/unlock tasks globally + Edit task names, descriptions, and due dates
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
- **State Management**: Zustand with API sync
- **Database**: Supabase PostgreSQL (persistent, shared state)
- **Authentication**: Client-side with sessionStorage (v1)
- **Animations**: CSS transitions + canvas-confetti
- **Icons**: Lucide React

## 📦 Installation

**⚠️ Important:** You need to set up Supabase first! See **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** for detailed instructions.

### Prerequisites
- Node.js 18+ or compatible package manager (npm, pnpm, yarn)
- **Supabase account** (free tier is perfect!)

### Setup Steps

1. **Set up Supabase database**:
   - Follow the detailed guide: **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**
   - Creates your PostgreSQL database (takes ~5 minutes)
   - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`

2. **Create `.env.local`** file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. **Install dependencies**:
```bash
npm install
```

4. **Run development server**:
```bash
npm run dev
```

5. **Open in browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

**That's it!** The app will automatically initialize the database with seed data on first run.

💡 **Multi-User Testing**: Open multiple browser windows or share your URL - all users see the same data in real-time!

📚 **Learn More**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed setup and [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel deployment.

## 🎮 Usage

### For Spectators / Venue Display

1. Open the **Home Page** (http://localhost:3000)
2. View the live race track with all 20 teams competing
3. Press **F11** for fullscreen mode (recommended for venue displays)
4. Refresh the page to see latest updates
5. No login required - perfect for public display screens!

**Display Tips:**
- Optimized for 1920x1080 resolution
- Refresh page to show latest progress
- Shows top statistics and full leaderboard
- Can be projected on big screens at the venue

### For Teams

1. Click **"Team Login"** button on the homepage (or go to /team)
2. Login with your team credentials:
   - Username: `team1` to `team20` (e.g., `team5`)
   - Password: `hackathon2026-1` to `hackathon2026-20` (e.g., `hackathon2026-5`)
3. You'll only see your own team's dashboard (cannot view other teams)
4. **Customize your team**:
   - Click your team icon to choose from 60+ emojis (animals, objects, symbols, and more!)
   - Click the edit icon next to your name to rename your team
5. Check off tasks as you complete them (locked tasks can't be modified)
6. Add notes about your progress
7. Submit evidence links (GitHub repo, demo video, etc.)
8. See your current ranking displayed prominently
9. Visit the Live Dashboard (home page) to watch all teams racing!
10. Logout when done to protect your team's data

**Important**: Each team can only edit their own progress. You cannot modify other teams' data. To see the full race track, visit the home page.

### For Admins

1. Click **"Admin Login"** button on the homepage (or go to /admin)
2. Enter password: `************`
3. Monitor all teams on the dashboard
4. **Edit tasks**: Update task names, descriptions, and due dates
5. Lock/unlock tasks to control the competition flow
6. Click "View" on any team to see full details and audit log
7. Use "Undo" to revert the last change for a team
8. Use "Reset" to completely reset a team (requires confirmation)

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

### Changes not visible to other users
- Both users must be on the same URL (localhost or deployed URL)
- Refresh the browser to see latest changes
- Check browser console for API errors
- Verify database is properly configured

### Data disappeared
- **This is normal!** The server restarted, which resets the in-memory database
- Data automatically resets to initial seed values
- Perfect for hackathons - fresh start each session!

### Tasks not updating
- Check if the task is locked (admin can unlock)
- Ensure you're logged in as a team
- Refresh the page to see updates
- Check browser console for errors
- Check the audit log for recent changes

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

# hack-26
