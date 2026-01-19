# Database Setup Guide

This app now uses **Vercel Postgres** for shared state across all users. Follow these steps to set up the database.

## 📋 Prerequisites

- A Vercel account
- Your project deployed on Vercel

## 🚀 Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install `@vercel/postgres` and all other required packages.

### 2. Create Postgres Database on Vercel

1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose a region close to your users
6. Click **Create**

### 3. Configure Environment Variables

After creating the database, Vercel will automatically add the required environment variables to your project:

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

For local development:

1. In your Vercel project, go to **Settings** → **Environment Variables**
2. Copy all the Postgres variables
3. Create a `.env.local` file in your project root
4. Paste the environment variables

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel env pull .env.local
```

### 4. Initialize the Database

After deployment, initialize the database with seed data:

**Option A: Via API (Recommended)**

Make a POST request to your deployed app:

```bash
curl -X POST https://your-app.vercel.app/api/init \
  -H "Content-Type: application/json" \
  -d '{"password": "hackathon-admin-2026"}'
```

**Option B: Via Admin Panel**

1. Navigate to the Admin page: `https://your-app.vercel.app/admin`
2. Log in with admin password: `hackathon-admin-2026`
3. Click the **Reset Database** button
4. Confirm the reset

### 5. Verify Setup

1. Open your app: `https://your-app.vercel.app`
2. You should see the race track with 20 teams
3. Try logging in as a team (e.g., `team1` / `hackathon2026-1`)
4. Make a change (toggle a task)
5. Open the app in a different browser/incognito window
6. Verify the change is visible there too! ✅

## 🔄 How It Works

### Architecture

- **Frontend**: Next.js 14 with Zustand for state management
- **API**: Next.js API routes (serverless functions)
- **Database**: Vercel Postgres (PostgreSQL)
- **Real-time Updates**: Polling every 5 seconds

### Data Flow

```
User Action → Zustand Store → API Route → Postgres Database
                     ↑                           ↓
                     └────── Polling (5s) ───────┘
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/teams` | GET | Fetch all teams |
| `/api/teams/[id]` | GET, PATCH | Get/update a team |
| `/api/tasks` | GET | Fetch all tasks |
| `/api/tasks/[id]` | PATCH | Update a task |
| `/api/audit` | GET, POST | Audit log |
| `/api/scorecards` | GET, POST | Judge scorecards |
| `/api/scorecards/[teamId]/[judgeId]` | GET | Specific scorecard |
| `/api/rubric` | GET, POST | Judging rubric |
| `/api/finalists` | GET, POST | Finalist teams |
| `/api/init` | POST | Initialize/reset database |

## 🛠️ Development

### Local Development with Vercel Postgres

```bash
# Pull environment variables
vercel env pull .env.local

# Run development server
npm run dev

# Initialize database (one time)
curl -X POST http://localhost:3000/api/init \
  -H "Content-Type: application/json" \
  -d '{"password": "hackathon-admin-2026"}'
```

### Testing Database Connection

Create a test file `test-db.js`:

```javascript
const { sql } = require('@vercel/postgres');

async function testConnection() {
  try {
    const result = await sql`SELECT NOW()`;
    console.log('✅ Database connected:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
```

Run:

```bash
node test-db.js
```

## 🐛 Troubleshooting

### "Failed to fetch teams" error

- Check that environment variables are set correctly
- Verify database is created in Vercel dashboard
- Check API logs in Vercel deployment logs

### Changes not syncing between users

- Verify `/api/init` was called to create tables
- Check browser console for API errors
- Ensure polling is working (check Network tab)

### "Unauthorized" when resetting database

- Verify admin password is correct: `hackathon-admin-2026`
- Check API logs for more details

### Database tables not created

Run the initialization endpoint manually:

```bash
curl -X POST https://your-app.vercel.app/api/init \
  -H "Content-Type: application/json" \
  -d '{"password": "hackathon-admin-2026"}'
```

## 📚 Learn More

- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 🔐 Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- The admin password should be changed in production
- Consider adding rate limiting to API routes
- Add authentication middleware for sensitive operations

## 🎉 That's It!

Your hackathon app is now powered by a real database and changes are synced across all users in real-time!
