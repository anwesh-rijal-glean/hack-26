# 📁 Supabase Database Scripts

This folder contains all SQL scripts for the Glean SE Hackathon 2026 database.

---

## 🚀 Quick Setup

### 1. Create Tables
Run this first to create the database schema:
```sql
-- Run in Supabase SQL Editor
supabase/schema.sql
```

### 2. Populate Seed Data
Run this to populate initial data (tasks, rubric, finalists):
```sql
-- Run in Supabase SQL Editor
supabase/init_all_tables.sql
```

**That's it!** Your database is ready.

---

## 📄 Files

### Required Scripts

| File | Purpose | When to Run |
|------|---------|-------------|
| **`schema.sql`** | Creates all tables, indexes, and triggers | First time setup |
| **`init_all_tables.sql`** | Populates tasks, rubric, and finalists | After schema.sql |

### Optional Migrations

| File | Purpose | When to Run |
|------|---------|-------------|
| **`migration_add_last_updated_by.sql`** | Adds tracking column | If upgrading from old schema |
| **`migration_add_due_date_to_tasks.sql`** | Adds due dates | If upgrading from old schema |
| **`migration_remove_links.sql`** | Removes unused columns | Optional cleanup |

---

## 🗄️ Database Schema

### Tables
- **`teams`** - Team information and progress (20 teams)
- **`tasks`** - Hackathon milestones (10 tasks)
- **`scorecards`** - Judge scores for finalists
- **`rubric`** - Judging criteria (6 criteria, 100 points total)
- **`finalist_teams`** - Selected finalists (default: teams 1-10)
- **`audit_log`** - Activity tracking

### Key Features
- Auto-updated timestamps (`updated_at`)
- JSONB for arrays (progress, scores)
- Referential integrity
- Default values for all fields

---

## 🔄 Migrations

### If Upgrading from Old Schema

Run migrations in this order:
```sql
1. migration_add_last_updated_by.sql
2. migration_add_due_date_to_tasks.sql
3. migration_remove_links.sql (optional)
```

### Fresh Install

Just run:
```sql
1. schema.sql
2. init_all_tables.sql
```

---

## 🧪 Verification

After running scripts, verify with:
```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check row counts
SELECT 
  (SELECT COUNT(*) FROM teams) as teams,
  (SELECT COUNT(*) FROM tasks) as tasks,
  (SELECT COUNT(*) FROM rubric) as rubric,
  (SELECT COUNT(*) FROM finalist_teams) as finalists;
```

Expected results:
- `tasks`: 10 rows
- `rubric`: 6 rows
- `finalist_teams`: 10 rows
- `teams`: 0 rows (populated by app)

---

## 📝 Notes

- **Seed data uses `ON CONFLICT DO NOTHING`** - Safe to run multiple times
- **Teams table is empty initially** - Populated from `lib/seed.ts` on first run
- **All timestamps are UTC** - Automatically managed by triggers
- **JSONB columns** - `progress` (boolean[]), `scores` (TeamScore[])

---

## 🔗 Related Documentation

- **[SUPABASE_SETUP.md](../SUPABASE_SETUP.md)** - Complete setup guide
- **[README.md](../README.md)** - Main documentation
- **[docs/DATABASE_SETUP.md](../docs/DATABASE_SETUP.md)** - Advanced configuration

---

**Last Updated:** 2026-01-18
