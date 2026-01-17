# 🚀 Quick Start with Supabase

## TL;DR Setup (5 minutes)

> 💡 **Best Practice:** Create separate databases for dev and prod! See [LOCAL_VS_PROD_SETUP.md](./LOCAL_VS_PROD_SETUP.md) for details.

### 1. Create Supabase Project
- Go to [supabase.com](https://supabase.com) → Sign up (free)
- Create new project (name it `hackathon-dev` for local development)
- Wait 2 minutes for provisioning

### 2. Run Database Schema
- Supabase Dashboard → **SQL Editor** → **New query**
- Copy/paste entire `supabase/schema.sql` file
- Click **Run** ✅

### 3. Get API Keys
- Supabase Dashboard → **Settings** → **API**
- Copy: **Project URL** and **anon public** key

### 4. Set Environment Variables

Create `.env.local` in project root (this is for LOCAL development only):
```env
# LOCAL DEVELOPMENT DATABASE
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJI...
```

**Note:** For production on Vercel, use different credentials in Vercel Environment Variables.
See [LOCAL_VS_PROD_SETUP.md](./LOCAL_VS_PROD_SETUP.md) for complete guide.

### 5. Run App
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` ✨

---

## Deploy to Vercel

```bash
npm run build
git add .
git commit -m "Setup Supabase PostgreSQL"
git push origin main
vercel --prod
```

**Don't forget:** Add environment variables in Vercel → Settings → Environment Variables

---

## Need Help?

See full guide: **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

---

## What You Get

✅ **Persistent database** - Data survives deployments  
✅ **Shared state** - All users see the same data  
✅ **Free tier** - 500MB database (more than enough)  
✅ **Auto-initialization** - Seed data loaded automatically  
✅ **Professional** - Real PostgreSQL database  

Perfect for your hackathon! 🎉
