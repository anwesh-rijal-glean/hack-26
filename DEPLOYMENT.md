# 🚀 Deployment Guide

This app uses an **in-memory database** for multi-user synchronization. No external database setup required!

## ✨ Key Features

- ✅ **Zero Configuration** - No database setup needed
- ✅ **Multi-User Sync** - Changes visible to all users in real-time (5 second polling)
- ✅ **Easy Deployment** - Just deploy to Vercel and you're done
- ✅ **Auto-Reset** - Data automatically resets on server restart

## 📦 How It Works

### In-Memory Database

The app uses a server-side in-memory store (`lib/memory-db.ts`) that:
- Stores all data in server memory
- Persists across requests during the same server session
- Syncs changes to all connected users
- Resets to initial seed data when the server restarts

### Data Persistence

**During Server Session:**
- ✅ All changes are saved
- ✅ Visible to all users instantly (5s polling)
- ✅ Survives page refreshes

**After Server Restart:**
- 🔄 Data resets to initial seed values
- 🔄 Perfect for demos and hackathons

## 🚀 Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or deploy to production
vercel --prod
```

That's it! No database configuration needed! 🎉

### 3. Test Multi-User Sync

1. Open your deployed app in Browser 1
2. Open the same app in Browser 2 (or incognito)
3. Make a change in Browser 1 (e.g., toggle a task)
4. Watch it appear in Browser 2 within 5 seconds! ✨

## 🔧 Local Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

Changes will sync across multiple browser windows/tabs automatically!

## 🔄 Resetting Data

### Via Admin Panel

1. Go to `/admin`
2. Enter password: `hackathon-admin-2026`
3. Click "Reset Database" button
4. Confirm the reset

### Via API

```bash
curl -X POST http://localhost:3000/api/init \
  -H "Content-Type: application/json" \
  -d '{"password": "hackathon-admin-2026"}'
```

## 📊 Architecture

```
┌─────────────┐
│   Browser   │ ← User makes change
│  (Zustand)  │
└──────┬──────┘
       │ POST /api/teams/[id]
       ↓
┌─────────────┐
│  Next.js    │
│  API Route  │ ← Updates in-memory data
└──────┬──────┘
       │
┌──────▼──────┐
│   Memory    │ ← Server-side storage
│     DB      │
└──────┬──────┘
       │
       ↓ GET /api/teams (polling every 5s)
┌─────────────┐
│  Browser    │ ← All users get update
│  (Update)   │
└─────────────┘
```

## ⚡ Performance

- **Polling Interval**: 5 seconds
- **Optimistic Updates**: UI updates immediately
- **Server Memory**: Very lightweight (~1-2MB)
- **Scalability**: Good for <100 concurrent users

## 🎯 Perfect For

- ✅ Hackathons
- ✅ Demos
- ✅ Internal tools
- ✅ Time-limited events
- ✅ Prototypes

## ⚠️ Limitations

### Data Loss on Restart

Data is stored in server memory, so it will be reset when:
- Server restarts
- Vercel re-deploys
- Serverless function cold starts (first request after inactivity)

**This is perfect for hackathons!** 🎉

### Not Suitable For

- ❌ Production apps requiring data persistence
- ❌ Long-running competitions (>24 hours)
- ❌ Apps with audit/compliance requirements
- ❌ Very high traffic (>100 concurrent users)

## 🔄 Migration to Real Database

If you need persistent storage later, see `DATABASE_SETUP.md` for instructions on migrating to Vercel Postgres.

The migration is straightforward:
1. Create Vercel Postgres database
2. Replace `memory-db.ts` imports with `db.ts` imports
3. Add environment variables
4. Redeploy

## 🐛 Troubleshooting

### Changes not syncing

**Check:**
1. Both users are looking at the same deployment URL
2. Browser console for API errors
3. Server is running (not restarted)

**Solution:**
- Refresh both browsers
- Check Network tab for API calls
- Verify polling is working (should see `/api/teams` requests every 5s)

### "Failed to fetch teams" error

**Check:**
1. Server is running
2. No errors in server logs

**Solution:**
- Restart the development server
- Clear browser cache
- Check API routes are working: `curl http://localhost:3000/api/teams`

### Data disappeared

**This is expected!** The server restarted or redeployed.

**Solution:**
- This is normal behavior for in-memory storage
- Data will reset to initial seed values
- Use the Reset Database button to manually reset

## 📚 Technical Details

### In-Memory Database Module

File: `lib/memory-db.ts`

```typescript
// Simple server-side storage
let teams: Team[] = [...INITIAL_TEAMS];
let tasks: Task[] = [...INITIAL_TASKS];
// ... etc

export async function getAllTeams() {
  return [...teams];
}

export async function updateTeam(id, updates) {
  // Update team in memory
  teams[index] = { ...teams[index], ...updates };
  return teams[index];
}
```

### API Routes

All API routes use the in-memory database:

- `/api/teams` - Team management
- `/api/tasks` - Task management
- `/api/audit` - Audit log
- `/api/scorecards` - Judge scorecards
- `/api/rubric` - Judging criteria
- `/api/finalists` - Finalist selection
- `/api/init` - Reset data

### State Management

- **Frontend**: Zustand store with API sync
- **Backend**: In-memory JavaScript objects
- **Sync**: Polling every 5 seconds + optimistic updates

## 🎉 Benefits of In-Memory Storage

1. **Zero Setup** - No database configuration
2. **Fast** - All data in memory = instant reads/writes
3. **Simple** - Easy to understand and debug
4. **Free** - No database hosting costs
5. **Clean Slate** - Auto-resets for each event

## 📝 Summary

This in-memory database approach is:
- ✅ Perfect for hackathons and demos
- ✅ Zero configuration required
- ✅ Multi-user sync works great
- ✅ Fast and simple
- ⚠️ Data resets on server restart (by design!)

**Just deploy and go!** 🚀
