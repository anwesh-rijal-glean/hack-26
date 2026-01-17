-- Initialize Tasks table with seed data
-- Run this script in your Supabase SQL Editor if the tasks table is empty

-- Clear existing tasks (optional - remove this line if you want to keep existing data)
-- DELETE FROM tasks;

-- Insert all 10 milestone tasks
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

-- Verify the insert
SELECT COUNT(*) as task_count FROM tasks;
SELECT * FROM tasks ORDER BY id;
