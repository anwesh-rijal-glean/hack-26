-- Migration: Add due_date column to tasks table
-- This column exists in the seed data but was missing from the schema

-- Add due_date column if it doesn't exist
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;

-- Update existing tasks with due dates from seed data
UPDATE tasks SET due_date = '2026-01-20T20:00:00Z' WHERE id IN (1, 2, 3);
UPDATE tasks SET due_date = '2026-02-01T20:00:00Z' WHERE id = 4;
UPDATE tasks SET due_date = '2026-02-10T20:00:00Z' WHERE id IN (5, 6, 7);
UPDATE tasks SET due_date = '2026-02-20T20:00:00Z' WHERE id IN (8, 9, 10);

-- Verify the migration
SELECT id, title, due_date FROM tasks ORDER BY id;
