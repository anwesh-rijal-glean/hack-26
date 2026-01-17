-- Initialize ALL tables with seed data
-- Run this comprehensive script in your Supabase SQL Editor to populate all tables at once

-- =============================================================================
-- TASKS TABLE
-- =============================================================================
INSERT INTO tasks (id, title, description, due_date, points, locked) VALUES
(1, 'Name your team 🏷️', 'Pick a memorable name for your team and update team details.', '2026-01-20T20:00:00Z', 10, false),
(2, 'Define your winning idea 💡', 'Submit details of your problem statement. What pain are you solving and why it matters', '2026-01-20T20:00:00Z', 10, false),
(3, 'Share the Vibe 🎨', 'Create a graphics or visual that captures the problem, pain or the vibe of your team and post it to #gko-fy2027-se-hackathon', '2026-01-20T20:00:00Z', 10, false),
(4, 'Progress Ping 📢', 'Post a quick progress. Keep the momentum visible and the hype alive', '2026-02-01T20:00:00Z', 10, false),
(5, 'Make it Real! ⚙️', 'Build a functional prototype (rough edges are fine!)', '2026-02-10T20:00:00Z', 10, false),
(6, 'Cross-Team Jam 🤝', 'Collaborate or get feedback from at least one x-functional partner (product, eng)', '2026-02-10T20:00:00Z', 10, false),
(7, 'Learning Drop 📘', 'Share one new thing you learned in the channel. Bonus points if it helps others.', '2026-02-10T20:00:00Z', 10, false),
(8, 'How-To Guide 📖', 'Create some documentation: what it is, when to use it, how it works etc.', '2026-02-20T20:00:00Z', 10, false),
(9, 'Audition Demo Video 🎥', 'Submit a short pitch video of your project to qualify for finals. Clear, crisp and compelling.', '2026-02-20T20:00:00Z', 10, false),
(10, 'Ready for the spotlight 🏆', 'Turn in your final presentation deck - this is what you''ll use if you present live at GKO', '2026-02-20T20:00:00Z', 10, false)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- RUBRIC TABLE
-- =============================================================================
INSERT INTO rubric (id, title, description, max_points, sort_order) VALUES
('criterion-1', 'Problem Relevance', 'How relevant and meaningful is the problem to Glean and/or customers?', 20, 0),
('criterion-2', 'Use of Glean', 'Is Glean used meaningfully and creatively?', 20, 1),
('criterion-3', 'Innovation', 'Is the solution bold, creative, or original?', 20, 2),
('criterion-4', 'Functionality', 'Does the demo work (real or mock data)?', 10, 3),
('criterion-5', 'Team Participation', 'Does each team member have a role in the project?', 10, 4),
('criterion-6', 'Value Demonstrated', 'Does it clearly solve a problem or add value?', 20, 5)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- FINALIST TEAMS TABLE
-- =============================================================================
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

-- =============================================================================
-- VERIFICATION
-- =============================================================================
SELECT 
  (SELECT COUNT(*) FROM tasks) as tasks_count,
  (SELECT COUNT(*) FROM rubric) as rubric_count,
  (SELECT COUNT(*) FROM finalist_teams) as finalists_count;

-- Show all data
SELECT 'TASKS' as table_name, COUNT(*) as count FROM tasks
UNION ALL
SELECT 'RUBRIC' as table_name, COUNT(*) as count FROM rubric
UNION ALL
SELECT 'FINALIST_TEAMS' as table_name, COUNT(*) as count FROM finalist_teams;
