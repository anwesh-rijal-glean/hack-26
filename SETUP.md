# 🚀 Quick Setup Guide

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

or if you prefer pnpm:

```bash
pnpm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### 3. Access the Application

**No database setup required!** The app uses an in-memory database that automatically syncs changes across all users.

💡 **How it works:**
- Data is stored in server memory
- Changes sync to all users via API (polling every 5 seconds)
- Data resets when server restarts (perfect for hackathons!)

### 4. URLs

- **Live Dashboard** (Public): http://localhost:3000
- **Team View**: http://localhost:3000/team
- **Admin View**: http://localhost:3000/admin (password: `hackathon-admin-2026`)
- **Judge Portal**: http://localhost:3000/judge

### 5. Multi-User Testing

Open the app in multiple browsers/devices to see real-time sync:
1. Open http://localhost:3000 in Browser 1
2. Open http://localhost:3000 in Browser 2 (or incognito)
3. Make changes in one → see them in the other! ✨

### 6. Display Setup (Optional)

For venue displays:
1. Open http://localhost:3000 on any computer
2. Press **F11** for fullscreen mode
3. The dashboard auto-refreshes every 5 seconds
4. Optimized for 1920x1080 screens

## First Time Setup

### For Teams
1. Navigate to Team View
2. Login with your team credentials:
   - **Username**: `team1` to `team20` (e.g., `team5`)
   - **Password**: `hackathon2026-1` to `hackathon2026-20` (e.g., `hackathon2026-5`)
3. Customize your team:
   - Click your team icon to choose from 60+ emojis
   - Click the edit (✏️) icon to change your team name
4. Start checking off tasks as you complete them!

**Example Team Logins:**
- Team 1: username `team1`, password `hackathon2026-1`
- Team 5: username `team5`, password `hackathon2026-5`
- Team 20: username `team20`, password `hackathon2026-20`

### For Admins
1. Navigate to Admin View
2. Enter password: `hackathon-admin-2026`
3. You'll see the full dashboard with all team controls

### For Judges
1. Navigate to Judge Portal
2. Login with your judge credentials:
   - **Username**: `judge1` to `judge10`
   - **Password**: `hackathon2026-judge1` to `hackathon2026-judge10`
3. Select a finalist team and fill out the scorecard

## Data Persistence

**How it works:**
- Data is stored in server memory (not localStorage)
- All users see the same data
- Changes sync automatically every 5 seconds
- **Data resets when server restarts** (by design!)

**Perfect for:**
- ✅ Hackathons
- ✅ Demos
- ✅ Time-limited events
- ✅ Internal tools

**To reset data manually:**

Option 1: Admin Panel
1. Go to Admin View
2. Click "Reset Database" button
3. Enter admin password: `hackathon-admin-2026`
4. Confirm reset

Option 2: API Call
```bash
curl -X POST http://localhost:3000/api/init \
  -H "Content-Type: application/json" \
  -d '{"password": "hackathon-admin-2026"}'
```

💡 **Note:** If you need persistent storage that survives server restarts, see `DATABASE_SETUP.md` for Postgres setup.

## Pre-configured Data

### Teams (20)
- Code Ninjas 🐎
- Bug Busters 🏇
- Syntax Samurai 🦄
- Pixel Pioneers 🐴
- Data Dragons 🎠
- ... and 15 more!

### Tasks (10)
1. Team Registration
2. Project Proposal
3. Initial Prototype
4. Core Features
5. UI/UX Polish
6. Testing & Debugging
7. Documentation
8. Demo Video
9. Presentation Slides
10. Final Submission

## Customization

### Change Team Names
Edit `lib/seed.ts` - modify `TEAM_NAMES`, `HORSE_ICONS`, and `COLORS` arrays

### Modify Tasks
Edit `lib/seed.ts` - update `INITIAL_TASKS` array

### Change Admin Password
Edit `components/AdminPasswordGate.tsx` - change `ADMIN_PASSWORD` constant
Also update `app/api/init/route.ts` if you change the password

## Deploy to Production

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

That's it! No database setup needed. 🎉

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed deployment instructions.

## Troubleshooting

**Problem**: Can't login as team
- **Solution**: Make sure you're using the correct format: username `team1` (not Team1), password `hackathon2026-1`

**Problem**: Teams not loading
- **Solution**: Refresh the page. The server may have restarted.

**Problem**: Can't check off tasks
- **Solution**: Check if task is locked (admin can unlock)

**Problem**: Admin password not working
- **Solution**: Make sure you're using `hackathon-admin-2026` (all lowercase with hyphens)

**Problem**: Changes not visible to other users
- **Solution**: Check that both users are on the same URL. Wait 5 seconds for sync. Check browser console for errors.

**Problem**: Data disappeared
- **Solution**: This is normal! Server restarted. Data resets to initial values automatically.

## Support

Check the main README.md for detailed documentation and architecture information.

---

Happy Hacking! 🎉

