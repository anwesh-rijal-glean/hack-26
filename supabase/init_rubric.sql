-- Initialize Rubric table with judging criteria
-- Run this script in your Supabase SQL Editor if the rubric table is empty

-- Clear existing rubric (optional - remove this line if you want to keep existing data)
-- DELETE FROM rubric;

-- Insert all 6 judging criteria
INSERT INTO rubric (id, title, description, max_points, sort_order) VALUES
('criterion-1', 'Problem Relevance', 'How relevant and meaningful is the problem to Glean and/or customers?', 20, 0),
('criterion-2', 'Use of Glean', 'Is Glean used meaningfully and creatively?', 20, 1),
('criterion-3', 'Innovation', 'Is the solution bold, creative, or original?', 20, 2),
('criterion-4', 'Functionality', 'Does the demo work (real or mock data)?', 10, 3),
('criterion-5', 'Team Participation', 'Does each team member have a role in the project?', 10, 4),
('criterion-6', 'Value Demonstrated', 'Does it clearly solve a problem or add value?', 20, 5)
ON CONFLICT (id) DO NOTHING;

-- Verify the insert
SELECT COUNT(*) as rubric_count FROM rubric;
SELECT * FROM rubric ORDER BY sort_order;
