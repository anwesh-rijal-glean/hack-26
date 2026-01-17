-- Migration: Add last_updated_by column to teams table
-- Run this if you already have a database set up and need to add the missing column

-- Add the column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'teams' 
    AND column_name = 'last_updated_by'
  ) THEN
    ALTER TABLE teams ADD COLUMN last_updated_by TEXT DEFAULT '';
    RAISE NOTICE 'Column last_updated_by added successfully';
  ELSE
    RAISE NOTICE 'Column last_updated_by already exists';
  END IF;
END $$;
