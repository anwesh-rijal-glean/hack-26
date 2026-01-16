# 🚀 Ready to Go - In-Memory Database Setup

Your hackathon app is now configured with an **in-memory database**! No external database setup required! 🎉

## ✅ What This Means

- ✅ **Zero Configuration** - No database credentials needed
- ✅ **Multi-User Sync** - Changes visible to all users in real-time (5 second polling)
- ✅ **Easy Deployment** - Just deploy to Vercel and it works
- ✅ **Fresh Start** - Data automatically resets on server restart (perfect for hackathons!)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open Your App

```bash
open http://localhost:3000
```

**That's it!** No database setup, no environment variables, no configuration! 🎉

## 🧪 Test Multi-User Sync

1. Open `http://localhost:3000` in Browser 1
2. Open `http://localhost:3000` in Browser 2 (or incognito)
3. Log in as different teams:
   - Browser 1: Login as `team1` / `hackathon2026-1`
   - Browser 2: Login as `team2` / `hackathon2026-2`
4. Toggle a task in Browser 1
5. Watch it appear in Browser 2 within 5 seconds! ✨

## 📊 How It Works

### In-Memory Database

Data is stored in **server memory** (`lib/memory-db.ts`):
- All users connect to the same server instance
- Changes sync via API calls (polling every 5 seconds)
- Data persists during server session
- **Resets on server restart** (by design!)

### Perfect For

- ✅ Hackathons (fresh start each day)
- ✅ Demos and presentations
- ✅ Internal tools
- ✅ Time-limited events
- ✅ Rapid prototyping

## 🎮 Usage

### For Teams

1. Go to `http://localhost:3000/team`
2. Login with credentials:
   - Username: `team1` to `team20`
   - Password: `hackathon2026-1` to `hackathon2026-20`
3. Customize your team name and icon
4. Check off tasks as you complete them
5. Submit evidence to shared Google Drive

### For Judges

1. Go to `http://localhost:3000/judge`
2. Login with credentials:
   - Username: `judge1` to `judge10`
   - Password: `hackathon2026-judge1` to `hackathon2026-judge10`
3. Score finalist teams
4. Submit your scorecard

### For Admins

1. Go to `http://localhost:3000/admin`
2. Enter password: `hackathon-admin-2026`
3. Monitor all teams
4. Edit tasks, lock/unlock, reset teams
5. View audit trail
6. Select finalist teams
7. Manage judging rubric

## 🔄 Resetting Data

If you need to reset all data back to initial values:

### Via Admin Panel (Easiest)
1. Go to `/admin`
2. Login with password: `hackathon-admin-2026`
3. Click "Reset Database" button
4. Confirm the reset

### Via API
```bash
curl -X POST http://localhost:3000/api/init \
  -H "Content-Type: application/json" \
  -d '{"password": "hackathon-admin-2026"}'
```

## 🚀 Deploy to Vercel

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel --prod
```

**No environment variables needed!** The in-memory database works out of the box on Vercel.

## ⚡ Features

### Live Dashboard
- Full-screen race track view
- 20 teams racing to complete 10 milestones
- Auto-refresh every 5 seconds
- Live statistics and leaderboard
- Optimized for 1920x1080 venue displays

### Team Customization
- Edit team name
- Choose from 100+ emoji icons (animals, tech, gaming, sci-fi themes)
- Track progress
- See current ranking

### Admin Controls
- Monitor all teams
- Edit task names, descriptions, due dates
- Lock/unlock tasks
- Reset teams
- View complete audit trail
- Select finalists
- Manage judging rubric

### Judge Portal
- Score finalist teams
- Use customizable rubric
- Save drafts
- Submit final scores
- View all submitted scores (admin)

## 📝 Data Persistence

### During Server Session
- ✅ All changes are saved
- ✅ Visible to all users
- ✅ Survives page refreshes

### After Server Restart
- 🔄 Data resets to initial seed values
- 🔄 Perfect for demos and hackathons
- 🔄 Clean slate for each event

**This is by design!** For a hackathon, you want a fresh start each time.

## 🐛 Troubleshooting

### Changes not syncing between users?

**Check:**
- Both users on the same URL (localhost or deployed URL)
- Wait 5 seconds for auto-sync
- Check browser console for errors

**Solution:**
- Refresh both browsers
- Check server is running
- Verify no errors in terminal

### Data disappeared?

**This is normal!** The server restarted, which resets the in-memory database.

**Solution:**
- This is expected behavior
- Data automatically resets to initial values
- Use the reset button to manually reset if needed

### Server errors on startup?

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide
- **[IN_MEMORY_DB.md](./IN_MEMORY_DB.md)** - How the in-memory database works
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[README.md](./README.md)** - Full project documentation

## 🎉 You're All Set!

Your hackathon app is ready to go with:
- ✅ Zero configuration
- ✅ Multi-user sync
- ✅ Easy deployment
- ✅ No database hassles

Just run:
```bash
npm install
npm run dev
```

And open `http://localhost:3000`!

Happy hacking! 🚀
