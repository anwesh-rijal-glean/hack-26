# 🔄 Migration to Shared Database

This app has been migrated from localStorage to Vercel Postgres for **real-time multi-user synchronization**!

## 🎯 What Changed

### Before (localStorage)
- ❌ Data stored only in individual browsers
- ❌ Changes only visible to one user
- ❌ Required manual refresh to see others' changes
- ❌ Not suitable for shared deployment

### After (Vercel Postgres)
- ✅ Data stored in central database
- ✅ Changes visible to all users instantly
- ✅ Auto-refresh every 5 seconds
- ✅ Perfect for shared Vercel deployment

## 📦 What Was Added

### New Files

1. **`lib/db.ts`** - Database access layer
   - Functions for querying/updating teams, tasks, scorecards, etc.
   - Converts between database format and TypeScript types

2. **`app/api/teams/route.ts`** - Team API endpoints
   - `GET /api/teams` - Fetch all teams
   - `PATCH /api/teams/[id]` - Update a team

3. **`app/api/tasks/route.ts`** - Task API endpoints
   - `GET /api/tasks` - Fetch all tasks
   - `PATCH /api/tasks/[id]` - Update a task

4. **`app/api/audit/route.ts`** - Audit log API
   - `GET /api/audit` - Fetch audit log
   - `POST /api/audit` - Add audit event

5. **`app/api/scorecards/route.ts`** - Scorecard API
   - `GET /api/scorecards` - Fetch all scorecards
   - `POST /api/scorecards` - Save a scorecard
   - `GET /api/scorecards/[teamId]/[judgeId]` - Get specific scorecard

6. **`app/api/rubric/route.ts`** - Rubric API
   - `GET /api/rubric` - Fetch rubric criteria
   - `POST /api/rubric` - Update rubric

7. **`app/api/finalists/route.ts`** - Finalists API
   - `GET /api/finalists` - Fetch finalist team IDs
   - `POST /api/finalists` - Update finalists

8. **`app/api/init/route.ts`** - Database initialization
   - `POST /api/init` - Create tables and seed data
   - Requires admin password for security

9. **`DATABASE_SETUP.md`** - Complete setup guide
10. **`.env.example`** - Environment variable template

### Modified Files

1. **`lib/store.ts`** - Complete rewrite
   - Removed Zustand `persist` middleware
   - Added `fetchAllData()` method for API calls
   - All mutations now sync with API
   - Auto-polling every 5 seconds
   - Optimistic updates for better UX

2. **`package.json`** - Added dependency
   - `@vercel/postgres` for database access

3. **`SETUP.md`** - Updated instructions
   - Database configuration steps
   - New API initialization process
   - Updated admin password references

## 🚀 Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

This installs `@vercel/postgres` and other packages.

### 2. Deploy to Vercel

```bash
# First time
vercel

# Production
vercel --prod
```

### 3. Create Postgres Database

1. Go to your Vercel project dashboard
2. Click **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a region
6. Click **Create**

Vercel will automatically add environment variables to your project.

### 4. Initialize Database

After deployment, run:

```bash
curl -X POST https://your-app.vercel.app/api/init \
  -H "Content-Type: application/json" \
  -d '{"password": "hackathon-admin-2026"}'
```

Or use the Admin Panel:
1. Go to https://your-app.vercel.app/admin
2. Login with password: `hackathon-admin-2026`
3. Click "Reset Database" button

### 5. Test Multi-User Sync

1. Open the app in two different browsers/devices
2. Make a change in one (e.g., toggle a task)
3. Watch it appear in the other within 5 seconds! ✨

## 🔧 Local Development

### Setup

```bash
# Pull environment variables from Vercel
npm i -g vercel
vercel env pull .env.local

# Start dev server
npm run dev

# Initialize database (one time)
curl -X POST http://localhost:3000/api/init \
  -H "Content-Type: application/json" \
  -d '{"password": "hackathon-admin-2026"}'
```

### Without Database

If you haven't set up the database yet, the app will fall back to using the initial seed data in memory. Changes won't persist across page refreshes.

## 🗄️ Database Schema

### Teams Table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (e.g., "team-1") |
| name | TEXT | Team name |
| horse_icon | TEXT | Team emoji icon |
| progress | BOOLEAN[] | Array of 10 booleans for task completion |
| notes | TEXT | Team notes |
| links | JSONB | Evidence links |
| last_updated_by | TEXT | Who made the last update |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | When last updated |

### Tasks Table

| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER | Primary key (1-10) |
| title | TEXT | Task title |
| description | TEXT | Task description |
| due_date | TEXT | Due date (ISO string) |
| locked | BOOLEAN | Whether task is locked |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | When last updated |

### Audit Log Table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (UUID) |
| timestamp | BIGINT | Unix timestamp |
| actor_type | TEXT | "team" or "admin" |
| actor_id | TEXT | Team ID or "admin" |
| action | TEXT | Action type |
| target_type | TEXT | "team" or "task" |
| target_id | TEXT | Target ID |
| details | JSONB | Additional details |

### Scorecards Table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key (UUID) |
| team_id | TEXT | Team being judged |
| judge_id | TEXT | Judge's ID |
| scores | JSONB | Array of criterion scores |
| notes | TEXT | Judge's notes |
| submitted | BOOLEAN | Whether submitted |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | When last updated |

### Rubric Table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key ("default") |
| criteria | JSONB | Array of rubric criteria |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | When last updated |

### Finalist Teams Table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key ("default") |
| team_ids | TEXT[] | Array of finalist team IDs |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | When last updated |

## 🔐 Security Notes

1. **Admin Password**: Change `hackathon-admin-2026` in production
   - Update `components/AdminPasswordGate.tsx`
   - Update `app/api/init/route.ts`

2. **Environment Variables**: Never commit `.env.local`
   - It's already in `.gitignore`

3. **API Security**: Consider adding:
   - Rate limiting
   - Authentication middleware
   - CORS configuration

## 📊 Data Flow

```
┌─────────────┐
│   Browser   │
│  (Zustand)  │
└──────┬──────┘
       │ API Call
       ↓
┌─────────────┐
│  Next.js    │
│  API Route  │
└──────┬──────┘
       │ SQL Query
       ↓
┌─────────────┐
│  Vercel     │
│  Postgres   │
└─────────────┘
       │
       ↓ Polling (5s)
┌─────────────┐
│  Browser    │
│  (Update)   │
└─────────────┘
```

## ⚡ Performance

- **Polling Interval**: 5 seconds
- **Optimistic Updates**: UI updates immediately, then syncs
- **Connection Pooling**: Built into Vercel Postgres
- **Auto-scaling**: Vercel handles traffic spikes

## 🐛 Troubleshooting

### "Failed to fetch teams"

Check:
1. Environment variables are set
2. Database is created in Vercel
3. `/api/init` was called

### Changes not syncing

Check:
1. Multiple browser windows/devices
2. Browser console for errors
3. Vercel deployment logs

### Database connection errors

Check:
1. `POSTGRES_URL` is correct
2. Database is running in Vercel
3. No firewall blocking connections

## 📚 Resources

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Zustand Store](https://github.com/pmndrs/zustand)

## 🎉 You're All Set!

Your hackathon app now supports **real-time collaboration** with:
- ✅ Shared state across all users
- ✅ Persistent storage
- ✅ Live updates every 5 seconds
- ✅ Production-ready on Vercel

Happy hacking! 🚀
