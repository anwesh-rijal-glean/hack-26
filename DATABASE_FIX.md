# Database Field Mapping Fix

## Issue Summary

**Problem:** Data was persisting to the database but not showing up correctly in the UI.

**Root Causes:**
1. **Field name mismatch** - Database uses `snake_case`, TypeScript uses `camelCase`
2. **Missing column** - `last_updated_by` field didn't exist in database schema
3. **Incomplete mapping** - Field conversions weren't applied consistently

---

## What Was Wrong

### Field Name Mismatches

| TypeScript Field | Database Column | Status |
|-----------------|-----------------|--------|
| `horseIcon` | `icon` | ❌ Not mapped |
| `updatedAt` | `updated_at` | ❌ Not mapped |
| `lastUpdatedBy` | `last_updated_by` | ❌ Missing from schema |

### The Problem Flow

```
1. User changes team icon in UI → "🦁"
2. Code sends: { horseIcon: "🦁" }
3. Database receives: { horseIcon: "🦁" } ← Wrong field name!
4. Database saves to column "horseIcon" (doesn't exist)
5. OR ignores the field entirely
6. When reading back: { icon: "🐴" } ← Old value
7. Code looks for horseIcon, doesn't map from icon
8. UI shows: "🐴" ← No change visible!
```

---

## What Was Fixed

### 1. Updated Database Schema ✅

Added missing column:
```sql
ALTER TABLE teams ADD COLUMN last_updated_by TEXT DEFAULT '';
```

### 2. Added Mapping Functions ✅

Created proper field converters in `lib/db.ts`:

```typescript
// Database → TypeScript
function mapDbRowToTeam(row: any): Team {
  return {
    id: row.id,
    name: row.name,
    horseIcon: row.icon,           // ← Maps icon to horseIcon
    updatedAt: row.updated_at,     // ← Maps updated_at to updatedAt
    lastUpdatedBy: row.last_updated_by, // ← Maps last_updated_by
    // ... other fields
  };
}

// TypeScript → Database
function mapTeamUpdatesToDb(updates: Partial<Team>): any {
  const dbUpdates: any = {};
  if ('horseIcon' in updates) dbUpdates.icon = updates.horseIcon;
  if ('lastUpdatedBy' in updates) dbUpdates.last_updated_by = updates.lastUpdatedBy;
  // ... other fields
  return dbUpdates;
}
```

### 3. Updated All Database Operations ✅

All team-related functions now use the mapping:
- `getAllTeams()` - Maps on read
- `getTeam()` - Maps on read
- `updateTeam()` - Maps on write AND read

### 4. Updated Store Logic ✅

Store now sends `lastUpdatedBy` with all updates:
- Team name changes
- Team icon changes
- Task toggles

---

## How to Fix Your Existing Database

### If You Already Have a Supabase Database

**Option 1: Run Migration Script (Recommended)**

1. Go to your Supabase project
2. Open **SQL Editor** → **New query**
3. Copy/paste `supabase/migration_add_last_updated_by.sql`
4. Click **Run**
5. Restart your dev server

**Option 2: Recreate Database (Clean Slate)**

1. Go to your Supabase project
2. Open **SQL Editor** → **New query**
3. Run this to drop all tables:
   ```sql
   DROP TABLE IF EXISTS finalist_teams;
   DROP TABLE IF EXISTS scorecards;
   DROP TABLE IF EXISTS rubric;
   DROP TABLE IF EXISTS audit_log;
   DROP TABLE IF EXISTS tasks;
   DROP TABLE IF EXISTS teams;
   ```
4. Copy/paste the updated `supabase/schema.sql`
5. Click **Run**
6. Restart your dev server
7. Data will be re-initialized with seed data

---

## Verification Steps

### 1. Check Database Schema

In Supabase dashboard:
1. Go to **Table Editor** → **teams** table
2. Verify columns exist:
   - ✅ `icon` (TEXT)
   - ✅ `updated_at` (TIMESTAMPTZ)
   - ✅ `last_updated_by` (TEXT) ← NEW!

### 2. Test Team Icon Change

```bash
1. npm run dev
2. Go to /team and login
3. Click your team icon
4. Select a new icon (e.g., 🦁)
5. Check Supabase → teams table → icon column
6. Verify it shows: 🦁
7. Refresh the page
8. Verify icon still shows: 🦁 (persisted!)
```

### 3. Test Team Name Change

```bash
1. Click edit icon next to team name
2. Change name to "New Team Name"
3. Check Supabase → teams table
4. Verify name column shows: "New Team Name"
5. Verify last_updated_by shows your team name
6. Refresh the page
7. Verify name still shows: "New Team Name" (persisted!)
```

### 4. Check Console Logs

Open browser DevTools → Console:
- ✅ Should see: "Fetching data from API..."
- ✅ Should NOT see: "Failed to save..." errors
- ✅ Should NOT see: "Reverting change..." messages

---

## Expected Behavior Now

### ✅ Before (Broken)
```
User changes icon → Appears to work → Refresh → Icon reverts
```

### ✅ After (Fixed)
```
User changes icon → Success toast → Refresh → Icon persists!
```

### Data Flow Now

```
UI Change → Store (optimistic update)
         ↓
    API Call with mapped fields
         ↓
    Database saves to correct columns
         ↓
    Refresh fetches data
         ↓
    Maps database fields back to TypeScript
         ↓
    UI updates with persisted data ✅
```

---

## Technical Details

### Field Mapping Implementation

**Read Path (Database → App):**
```
teams.icon → Team.horseIcon
teams.updated_at → Team.updatedAt
teams.last_updated_by → Team.lastUpdatedBy
```

**Write Path (App → Database):**
```
Team.horseIcon → teams.icon
Team.lastUpdatedBy → teams.last_updated_by
(updated_at handled automatically by database)
```

### Why Snake Case in Database?

PostgreSQL/Supabase convention uses `snake_case`:
- Standard SQL practice
- Better for queries and indexing
- Avoids quoting column names

### Why Camel Case in TypeScript?

JavaScript/TypeScript convention uses `camelCase`:
- Standard for JS/TS objects
- Better for code readability
- Matches other frontend code

### The Solution: Mapping Layer

A thin mapping layer converts between conventions:
- Keeps database following SQL standards
- Keeps TypeScript following JS standards
- Handles conversion transparently

---

## Common Issues After Fix

### "Column 'horseIcon' does not exist"

**Problem:** Old code trying to write `horseIcon` directly to database

**Solution:** Make sure you pulled the latest code with mapping functions

### "Icon/name changes work locally but not in production"

**Problem:** Production database doesn't have `last_updated_by` column

**Solution:**
1. Run migration script in PROD Supabase project
2. OR recreate prod database with new schema
3. Redeploy to Vercel

### "Data shows in database but not in UI"

**Problem:** Mapping functions not being used

**Solution:**
1. Verify you have latest `lib/db.ts`
2. Clear browser cache
3. Restart dev server
4. Check console for errors

---

## Summary

### Files Changed
- ✅ `supabase/schema.sql` - Added `last_updated_by` column
- ✅ `lib/db.ts` - Added mapping functions and updated all team operations
- ✅ `lib/store.ts` - Updated to send `lastUpdatedBy` with all changes
- ✅ `supabase/migration_add_last_updated_by.sql` - Migration script for existing databases

### What Works Now
- ✅ Team icon changes persist
- ✅ Team name changes persist
- ✅ Task checkbox changes persist
- ✅ `lastUpdatedBy` field tracks who made changes
- ✅ All timestamps update correctly
- ✅ Data syncs across all users
- ✅ Changes survive page refresh

---

## Need Help?

If you're still having issues:

1. **Check browser console** - Look for error messages
2. **Check Supabase logs** - Dashboard → Logs
3. **Verify schema** - Table Editor should match new schema
4. **Test with fresh data** - Reset database and test again
5. **Check environment variables** - Make sure they're correct

The fix is complete and should work now! 🎉
