-- Migration: Remove unused columns from teams table
-- Date: 2026-01-18
-- Teams now use Slack channel for sharing links and updates instead

-- Remove the links column (no longer used)
ALTER TABLE teams DROP COLUMN IF EXISTS links;

-- Remove the notes column (no longer used)
ALTER TABLE teams DROP COLUMN IF EXISTS notes;

-- Optional: Verify columns are removed
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'teams' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Expected columns after migration:
-- id, name, icon, color, progress, last_updated_by, created_at, updated_at
