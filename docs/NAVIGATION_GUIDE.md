# 🧭 Documentation Navigation Guide

Quick reference for finding the right documentation.

---

## 🚀 Getting Started

### I'm brand new to this project
1. **[README.md](../README.md)** - Start here!
2. **[SUPABASE_SETUP.md](../SUPABASE_SETUP.md)** - Set up database
3. **[CREDENTIALS.md](../CREDENTIALS.md)** - Get login credentials
4. Run `npm run dev` - You're ready!

### I'm deploying to production
1. **[DEPLOYMENT.md](../DEPLOYMENT.md)** - Step-by-step deployment
2. **[LOCAL_VS_PROD_SETUP.md](./LOCAL_VS_PROD_SETUP.md)** - Separate environments
3. **[TESTING_CHECKLIST.md](../TESTING_CHECKLIST.md)** - Pre-deployment QA

### I need to understand the codebase
1. **[README.md](../README.md)** - Project structure & tech stack
2. **[FEATURES.md](../FEATURES.md)** - All features explained
3. Dive into the code!

---

## 📚 Documentation Index

### Essential (Root Directory)

| File | Purpose | When to Use |
|------|---------|-------------|
| **[README.md](../README.md)** | Main documentation | Always start here |
| **[SUPABASE_SETUP.md](../SUPABASE_SETUP.md)** | Database setup | First-time setup |
| **[DEPLOYMENT.md](../DEPLOYMENT.md)** | Deploy to Vercel | Going to production |
| **[CREDENTIALS.md](../CREDENTIALS.md)** | Login credentials | Need to log in |
| **[FEATURES.md](../FEATURES.md)** | Feature list | Understanding functionality |
| **[DISPLAY_MODE.md](../DISPLAY_MODE.md)** | Display optimization | Setting up venue display |
| **[CHANGELOG.md](../CHANGELOG.md)** | Version history | See what changed |
| **[TESTING_CHECKLIST.md](../TESTING_CHECKLIST.md)** | QA tests | Before deployment |

### Advanced (docs/ folder)

| File | Purpose | When to Use |
|------|---------|-------------|
| **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** | Advanced DB config | Complex setup needs |
| **[LOCAL_VS_PROD_SETUP.md](./LOCAL_VS_PROD_SETUP.md)** | Separate environments | Dev vs Prod databases |
| **[archive/](./archive/)** | Historical docs | Understanding history |

### SQL Scripts (supabase/ folder)

| File | Purpose | When to Use |
|------|---------|-------------|
| **[README.md](../supabase/README.md)** | SQL documentation | Understanding database |
| **[schema.sql](../supabase/schema.sql)** | Database schema | First-time setup |
| **[init_all_tables.sql](../supabase/init_all_tables.sql)** | Seed data | Populate tables |
| **migrations/** | Schema changes | Upgrading existing DB |

---

## 🔍 Common Questions

### "How do I set up the project?"
→ **[README.md](../README.md)** → Quick Start section

### "What's the admin password?"
→ **[CREDENTIALS.md](../CREDENTIALS.md)**

### "How do I deploy this?"
→ **[DEPLOYMENT.md](../DEPLOYMENT.md)**

### "What are all the features?"
→ **[FEATURES.md](../FEATURES.md)**

### "How do I run tests?"
→ **[TESTING_CHECKLIST.md](../TESTING_CHECKLIST.md)**

### "What changed in version X?"
→ **[CHANGELOG.md](../CHANGELOG.md)**

### "How do I set up the database?"
→ **[SUPABASE_SETUP.md](../SUPABASE_SETUP.md)**

### "Why was X done this way?"
→ **[docs/archive/](./archive/)** - Historical context

### "How do I optimize for display?"
→ **[DISPLAY_MODE.md](../DISPLAY_MODE.md)**

### "Dev vs Prod database setup?"
→ **[LOCAL_VS_PROD_SETUP.md](./LOCAL_VS_PROD_SETUP.md)**

---

## 📁 Folder Structure

```
hackathon/
├── README.md              ⭐ START HERE
├── SUPABASE_SETUP.md      📊 Database setup
├── DEPLOYMENT.md          🚀 Production deployment
├── CREDENTIALS.md         🔐 Login info
├── FEATURES.md            ✨ Feature documentation
├── DISPLAY_MODE.md        📺 Display optimization
├── CHANGELOG.md           📝 Version history
├── TESTING_CHECKLIST.md   ✅ QA tests
│
├── docs/                  📁 Advanced docs
│   ├── NAVIGATION_GUIDE.md (this file)
│   ├── DATABASE_SETUP.md
│   ├── LOCAL_VS_PROD_SETUP.md
│   └── archive/           📦 Historical
│
└── supabase/              📁 SQL scripts
    ├── README.md
    ├── schema.sql
    ├── init_all_tables.sql
    └── migrations/
```

---

## 🎯 Role-Based Guides

### If you're a **Developer**
1. [README.md](../README.md) - Overview
2. [SUPABASE_SETUP.md](../SUPABASE_SETUP.md) - Local DB
3. [FEATURES.md](../FEATURES.md) - What to build/fix
4. Code away!

### If you're a **DevOps/Deployer**
1. [DEPLOYMENT.md](../DEPLOYMENT.md) - Deploy steps
2. [LOCAL_VS_PROD_SETUP.md](./LOCAL_VS_PROD_SETUP.md) - Environment config
3. [TESTING_CHECKLIST.md](../TESTING_CHECKLIST.md) - Pre-deploy QA

### If you're a **Hackathon Organizer**
1. [CREDENTIALS.md](../CREDENTIALS.md) - All logins
2. [DISPLAY_MODE.md](../DISPLAY_MODE.md) - Venue setup
3. [FEATURES.md](../FEATURES.md) - What participants can do

### If you're a **New Contributor**
1. [README.md](../README.md) - Project overview
2. [docs/archive/](./archive/) - Why things are the way they are
3. [CHANGELOG.md](../CHANGELOG.md) - Recent changes

---

## 💡 Tips

- **Start with README.md** - It has everything for quick start
- **Use Ctrl+F** to search within documentation
- **Check archive/** for historical context
- **SQL docs** are in `supabase/README.md`
- **All credentials** are in CREDENTIALS.md

---

## 🔗 External Links

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Slack Channel:** #gko-fy2027-se-hackathon
- **Google Drive:** [Shared Folder](https://drive.google.com/drive/folders/1NUEZn-Psh5vtgJSdgXtPr6IIabaTlF6i)

---

**Need help? Check the documentation or ask in Slack!**
