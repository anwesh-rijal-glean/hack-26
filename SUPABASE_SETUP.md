# Supabase PostgreSQL Setup Guide

## 🚀 Quick Overview

Your hackathon app now uses **Supabase PostgreSQL** for persistent, shared storage across all users. This provides:
- ✅ **Real database** with ACID compliance
- ✅ **Persistent storage** - data survives deployments
- ✅ **Shared state** - all users see the same data in real-time
- ✅ **Free tier** - 500MB database, perfect for hackathons
- ✅ **Works great with Vercel**

---

## 📋 Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click **Start your project** (free account)
3. Create a new project:
   - **Name:** `hackathon-2026` (or any name)
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free
4. Click **Create new project**
5. Wait 1-2 minutes for database to provision

---

## 📋 Step 2: Run Database Schema

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy the entire contents of `supabase/schema.sql` from this repo
4. Paste into the SQL editor
5. Click **Run** (or press Cmd+Enter / Ctrl+Enter)
6. You should see: "Success. No rows returned"

This creates all the tables needed for your hackathon app.

---

## 📋 Step 3: Get Your API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Find these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

---

## 📋 Step 4: Set Environment Variables

### For Local Development

Create `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### For Vercel Production

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
5. Click **Save**

---

## 📋 Step 5: Install & Test

```bash
# Install dependencies
npm install

# Test locally
npm run dev
```

Visit `http://localhost:3000` - the app will automatically initialize with seed data!

---

## 📋 Step 6: Deploy to Vercel

```bash
# Build to verify everything works
npm run build

# Commit and push
git add .
git commit -m "Switch to Supabase PostgreSQL"
git push origin main

# Deploy to Vercel
vercel --prod
```

Make sure your environment variables are set in Vercel before deploying!

---

## 🎯 How It Works

### Automatic Initialization
- First API call checks if database is empty
- If empty, seeds with initial teams, tasks, and rubric
- Subsequent calls use existing data

### Database Tables
- **teams** - Team info, progress, notes
- **tasks** - Hackathon milestones
- **audit_log** - Activity history
- **rubric** - Judging criteria
- **scorecards** - Judge scores
- **finalist_teams** - Selected finalists

### Real-time Updates
- Client polls every 5 seconds for updates
- All users see changes immediately
- No websockets needed - simple and reliable

---

## 💰 Costs

**Supabase Free Tier:**
- 500 MB database storage
- 50,000 monthly active users
- 500 MB bandwidth
- Social OAuth providers
- **Perfect for hackathons!** 🎉

Your hackathon (20 teams, 5 judges, ~50 users):
- Storage: ~1 MB
- Bandwidth: ~100 MB/day
- **Completely free!**

---

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env.local` exists and has both variables
- Restart dev server: `npm run dev`
- For production: verify environment variables in Vercel

### Error: "relation 'teams' does not exist"
- You need to run the schema SQL in Supabase
- Go to SQL Editor and run `supabase/schema.sql`

### Data not syncing between users
- Check that all users are accessing the same Vercel URL
- Verify environment variables are correct
- Check Supabase logs: Dashboard → Logs

### Want to reset all data?
1. Admin Dashboard → Reset Database button
2. Enter admin password
3. All data will be reset to seed values

### Want to view/edit data directly?
1. Supabase Dashboard → Table Editor
2. Select a table (teams, tasks, etc.)
3. View, edit, or delete rows

---

## 🔐 Security Notes

### Row Level Security (RLS)
- Currently set to allow all operations (good for hackathon)
- For production, you'd want to restrict access
- Supabase Dashboard → Authentication → Policies

### API Keys
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose (it's public)
- RLS policies control what users can access
- Never commit `.env.local` to git (already in `.gitignore`)

---

## 📊 Monitoring

### View Database Activity
1. Supabase Dashboard → Logs
2. See all queries, errors, and performance
3. Great for debugging!

### View Database Stats
1. Supabase Dashboard → Reports
2. See storage usage, query performance
3. Monitor active connections

---

## 🎉 You're All Set!

Your hackathon app now has:
- ✅ Persistent PostgreSQL database
- ✅ Shared state across all users
- ✅ Automatic initialization with seed data
- ✅ Free hosting with Supabase + Vercel
- ✅ Professional-grade reliability

**Need help?** Check the Supabase docs: [supabase.com/docs](https://supabase.com/docs)

---

## 🔄 Alternative: Quick Reset

If something goes wrong, you can always:

1. **Delete all data:**
   ```sql
   -- Run in Supabase SQL Editor
   DELETE FROM audit_log;
   DELETE FROM scorecards;
   DELETE FROM finalist_teams;
   DELETE FROM rubric;
   DELETE FROM tasks;
   DELETE FROM teams;
   ```

2. **Re-run schema:**
   - Copy/paste `supabase/schema.sql` again

3. **Restart your app:**
   - It will auto-initialize with fresh seed data!
