# Local vs Production Database Setup

## Overview

You should have **TWO separate Supabase projects**:
- 🟦 **Local/Development** - For testing changes safely
- 🟥 **Production** - For your live hackathon event

This prevents you from accidentally breaking production data during development!

---

## 🔧 Step 1: Create Two Supabase Projects

### Create Development Database

1. Go to [supabase.com](https://supabase.com/dashboard)
2. Click **New Project**
3. Name it: `hackathon-dev` or `hackathon-local`
4. Choose any password (save it!)
5. Select your region
6. Wait for provisioning (~2 minutes)

### Create Production Database

1. Still in Supabase dashboard
2. Click **New Project** again
3. Name it: `hackathon-prod` or `hackathon-2026`
4. Choose a **different** strong password (save it!)
5. Select same region
6. Wait for provisioning (~2 minutes)

---

## 🗄️ Step 2: Set Up Both Databases

### For BOTH projects, run the schema:

1. Open project → **SQL Editor** → **New query**
2. Copy/paste entire `supabase/schema.sql`
3. Click **Run**
4. Verify: "Success. No rows returned"

Repeat this for both dev and prod!

---

## 🔑 Step 3: Get API Keys

### Development Project Keys

1. Open your `hackathon-dev` project
2. Go to **Settings** → **API**
3. Copy these values:
   - **Project URL** (e.g., `https://xxxdev.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### Production Project Keys

1. Open your `hackathon-prod` project  
2. Go to **Settings** → **API**
3. Copy these values:
   - **Project URL** (e.g., `https://xxxprod.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

---

## 💻 Step 4: Configure Local Environment

Create `.env.local` in your project root (this file is git-ignored):

```env
# LOCAL DEVELOPMENT DATABASE
# These are ONLY used on your local machine (npm run dev)
NEXT_PUBLIC_SUPABASE_URL=https://xxxdev.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...dev-key...
```

**Important:**
- Use your **DEV** database credentials here
- This file is automatically git-ignored (won't be committed)
- Each developer should have their own `.env.local`

---

## 🚀 Step 5: Configure Production Environment (Vercel)

### Set Production Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxprod.supabase.co` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...prod-key...` | Production |

**Important:**
- Use your **PROD** database credentials here
- Set environment to **Production** only
- Don't set Preview/Development (let those use your dev DB)

5. Click **Save**
6. Redeploy your app for changes to take effect

---

## ✅ Step 6: Verify Setup

### Test Local Environment

```bash
# Start dev server
npm run dev

# Open http://localhost:3000
# No red banner = connected successfully!
# Make a change (update team name)
# Check your DEV Supabase project → Table Editor → teams
# Verify the change appears there
```

### Test Production Environment

```bash
# Deploy to Vercel
git add .
git commit -m "Configure separate databases"
git push origin main

# Visit your production URL (e.g., yourapp.vercel.app)
# No red banner = connected successfully!
# Make a change (update team name)
# Check your PROD Supabase project → Table Editor → teams
# Verify the change appears there
```

---

## 📊 How It Works

### Local Development
```
Your Computer
  └─ npm run dev
      └─ Reads .env.local
          └─ Connects to DEV database (xxxdev.supabase.co)
```

### Production Deployment
```
Vercel Serverless
  └─ Production environment
      └─ Reads Vercel Environment Variables
          └─ Connects to PROD database (xxxprod.supabase.co)
```

### Key Points
- `.env.local` is **never** deployed to Vercel
- Vercel uses its own environment variables
- Each environment has isolated data
- You can test freely in dev without affecting prod

---

## 🎯 Best Practices

### Development Database
- ✅ Test all changes here first
- ✅ Reset as many times as needed (Admin panel → Reset Database)
- ✅ Try out new features
- ✅ Break things safely!

### Production Database
- ⚠️ Only deploy tested changes
- ⚠️ Never reset during the event
- ⚠️ Monitor during hackathon
- ⚠️ Have backup of important data

---

## 🔄 Sharing Dev Database with Team

If multiple developers want to share a dev database:

### Option 1: Shared Dev Database (Recommended)
```bash
# All team members use the same .env.local
# Share the DEV credentials via secure channel (Slack DM, 1Password, etc.)
# Everyone can see each other's changes
```

### Option 2: Individual Dev Databases
```bash
# Each developer creates their own Supabase project
# Each has their own .env.local
# Fully isolated development
```

---

## 🛠️ Quick Commands

### View Current Database Connection
```bash
# Check which database you're using
cat .env.local
```

### Switch to Different Database
```bash
# Edit .env.local and change the URL/key
# Restart dev server
npm run dev
```

### Reset Development Database
```bash
# In your app (running locally):
# 1. Go to Admin panel
# 2. Click "Reset Database"
# 3. Enter admin password
# Or directly in Supabase dashboard:
# SQL Editor → Run: DELETE FROM teams; (and other tables)
```

---

## 🐛 Troubleshooting

### "Changes appear in wrong database"

**Problem:** Local changes showing in prod (or vice versa)

**Solution:**
```bash
# 1. Check your .env.local
cat .env.local

# 2. Make sure URL matches your DEV project
# Should be: https://xxxdev.supabase.co
# NOT: https://xxxprod.supabase.co

# 3. Restart dev server
npm run dev
```

### "Both environments connect to same database"

**Problem:** Same data in both local and production

**Solution:**
- Verify you created TWO separate Supabase projects
- Check Vercel environment variables use PROD credentials
- Check .env.local uses DEV credentials
- URLs should be different: `xxxdev` vs `xxxprod`

### "Production still uses old database"

**Problem:** Updated Vercel env vars but still using old DB

**Solution:**
```bash
# 1. Verify Vercel environment variables are correct
# 2. Redeploy to pick up new variables
vercel --prod

# Or trigger redeploy in Vercel dashboard:
# Deployments → ... → Redeploy
```

---

## 📝 Summary

| Aspect | Local Development | Production |
|--------|------------------|------------|
| **Database** | `hackathon-dev` project | `hackathon-prod` project |
| **Config File** | `.env.local` (git-ignored) | Vercel Environment Variables |
| **URL Example** | `https://abc123dev.supabase.co` | `https://xyz789prod.supabase.co` |
| **Purpose** | Testing & development | Live hackathon event |
| **Data** | Can reset anytime | Persistent, backed up |

---

## 🎉 Ready to Go!

Now you have:
- ✅ Separate databases for dev and prod
- ✅ Safe testing environment
- ✅ Production data protection
- ✅ Proper deployment workflow

**Development workflow:**
1. Make changes locally (uses dev DB)
2. Test thoroughly
3. Commit and push
4. Deploy to Vercel (uses prod DB)
5. Verify in production

Happy hacking! 🚀
