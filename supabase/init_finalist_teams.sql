-- Initialize Finalist Teams table
-- Run this script in your Supabase SQL Editor if the finalist_teams table is empty

-- Clear existing finalist teams (optional - remove this line if you want to keep existing data)
-- DELETE FROM finalist_teams;

-- Insert default top 10 finalist teams (teams 1-10)
INSERT INTO finalist_teams (team_id) VALUES
('team-1'),
('team-2'),
('team-3'),
('team-4'),
('team-5'),
('team-6'),
('team-7'),
('team-8'),
('team-9'),
('team-10')
ON CONFLICT (team_id) DO NOTHING;

-- Verify the insert
SELECT COUNT(*) as finalist_count FROM finalist_teams;
SELECT * FROM finalist_teams ORDER BY team_id;
