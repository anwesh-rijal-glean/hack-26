-- Hackathon Racetrack Database Schema for Supabase PostgreSQL

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '🐴',
  progress JSONB DEFAULT '[]'::jsonb,
  notes TEXT DEFAULT '',
  links JSONB DEFAULT '[]'::jsonb,
  last_updated_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMPTZ,
  points INTEGER NOT NULL,
  locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  ts TIMESTAMPTZ NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  team_id TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rubric criteria table
CREATE TABLE IF NOT EXISTS rubric (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  max_points INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scorecards table
CREATE TABLE IF NOT EXISTS scorecards (
  id TEXT PRIMARY KEY,
  judge_id TEXT NOT NULL,
  judge_name TEXT NOT NULL,
  team_id TEXT NOT NULL,
  scores JSONB DEFAULT '[]'::jsonb,
  total_score DECIMAL(10,2) DEFAULT 0,
  submitted_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(judge_id, team_id)
);

-- Finalist teams table
CREATE TABLE IF NOT EXISTS finalist_teams (
  team_id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_audit_log_team_id ON audit_log(team_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_ts ON audit_log(ts DESC);
CREATE INDEX IF NOT EXISTS idx_scorecards_judge_id ON scorecards(judge_id);
CREATE INDEX IF NOT EXISTS idx_scorecards_team_id ON scorecards(team_id);

-- Enable Row Level Security (but allow all operations for now)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE rubric ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE finalist_teams ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (you can restrict later)
CREATE POLICY "Allow all operations on teams" ON teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on audit_log" ON audit_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on rubric" ON rubric FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on scorecards" ON scorecards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on finalist_teams" ON finalist_teams FOR ALL USING (true) WITH CHECK (true);
