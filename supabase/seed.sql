-- ScholarFlow demo seed — School DEMO01, password demo123 for all users
-- Run after migrations via: supabase db reset

-- Fixed UUIDs for reproducibility
-- School
INSERT INTO schools (id, external_id, name, academic_year, grade_threshold_percent, attendance_threshold_percent, parent_resource_access, session_timeout_minutes, attendance_lock_hours)
VALUES (
  'a0000000-0000-4000-8000-000000000001',
  'DEMO01',
  'Riverside Academy',
  '2025–2026',
  50, 80, false, 30, 24
);

-- Auth users (local Supabase only — requires pgcrypto)
DO $$
DECLARE
  instance uuid := '00000000-0000-0000-0000-000000000000';
  v_pw text := crypt('demo123', gen_salt('bf'));
BEGIN
  -- teacher
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  VALUES (instance, 'b0000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'teacher@demo01.scholarflow.app', v_pw, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES ('b0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000001', format('{"sub":"%s","email":"teacher@demo01.scholarflow.app"}', 'b0000000-0000-4000-8000-000000000001')::jsonb, 'email', 'teacher@demo01.scholarflow.app', now(), now(), now())
  ON CONFLICT DO NOTHING;

  -- student
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  VALUES (instance, 'b0000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'student@demo01.scholarflow.app', v_pw, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES ('b0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', format('{"sub":"%s","email":"student@demo01.scholarflow.app"}', 'b0000000-0000-4000-8000-000000000002')::jsonb, 'email', 'student@demo01.scholarflow.app', now(), now(), now())
  ON CONFLICT DO NOTHING;

  -- parent
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  VALUES (instance, 'b0000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'parent@demo01.scholarflow.app', v_pw, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES ('b0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000003', format('{"sub":"%s","email":"parent@demo01.scholarflow.app"}', 'b0000000-0000-4000-8000-000000000003')::jsonb, 'email', 'parent@demo01.scholarflow.app', now(), now(), now())
  ON CONFLICT DO NOTHING;

  -- headmaster
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  VALUES (instance, 'b0000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'headmaster@demo01.scholarflow.app', v_pw, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES ('b0000000-0000-4000-8000-000000000004', 'b0000000-0000-4000-8000-000000000004', format('{"sub":"%s","email":"headmaster@demo01.scholarflow.app"}', 'b0000000-0000-4000-8000-000000000004')::jsonb, 'email', 'headmaster@demo01.scholarflow.app', now(), now(), now())
  ON CONFLICT DO NOTHING;

  -- admin
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  VALUES (instance, 'b0000000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'admin@demo01.scholarflow.app', v_pw, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES ('b0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000005', format('{"sub":"%s","email":"admin@demo01.scholarflow.app"}', 'b0000000-0000-4000-8000-000000000005')::jsonb, 'email', 'admin@demo01.scholarflow.app', now(), now(), now())
  ON CONFLICT DO NOTHING;

  -- superadmin (platform)
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
  VALUES (instance, 'b0000000-0000-4000-8000-000000000006', 'authenticated', 'authenticated', 'superadmin@scholarflow.app', v_pw, now(), '{"provider":"email","providers":["email"]}', '{}', now(), now(), '', '', '', '')
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES ('b0000000-0000-4000-8000-000000000006', 'b0000000-0000-4000-8000-000000000006', format('{"sub":"%s","email":"superadmin@scholarflow.app"}', 'b0000000-0000-4000-8000-000000000006')::jsonb, 'email', 'superadmin@scholarflow.app', now(), now(), now())
  ON CONFLICT DO NOTHING;
END $$;

-- Profiles
INSERT INTO profiles (id, school_id, username, display_name, email, role, class_label) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'teacher', 'Dr. Morgan Chen', 'teacher@demo01.scholarflow.app', 'teacher', NULL),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'student', 'Alex Rivera', 'student@demo01.scholarflow.app', 'student', 'Year 9A'),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'parent', 'Jamie Rivera', 'parent@demo01.scholarflow.app', 'parent', NULL),
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'headmaster', 'Prof. Elena Voss', 'headmaster@demo01.scholarflow.app', 'headmaster', NULL),
  ('b0000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'admin', 'Riley Okonkwo', 'admin@demo01.scholarflow.app', 'admin', NULL),
  ('b0000000-0000-4000-8000-000000000006', 'a0000000-0000-4000-8000-000000000099', 'superadmin', 'Platform Superadmin', 'superadmin@scholarflow.app', 'superadmin', NULL);

-- Additional students
INSERT INTO profiles (id, school_id, username, display_name, email, role, class_label) VALUES
  ('b0000000-0000-4000-8000-000000000010', 'a0000000-0000-4000-8000-000000000001', 'jordan', 'Jordan Lee', 'jordan@demo01.scholarflow.app', 'student', 'Year 9A'),
  ('b0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000001', 'sam', 'Sam Patel', 'sam@demo01.scholarflow.app', 'student', 'Year 9A');

INSERT INTO parent_children (parent_id, student_id) VALUES
  ('b0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000002');

-- Workspaces
INSERT INTO workspaces (id, school_id, subject_name, class_label, teacher_user_id, curriculum_status, submitted_at) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Science', 'Year 9A', 'b0000000-0000-4000-8000-000000000001', 'pending', '2026-03-28'),
  ('c0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Mathematics', 'Year 9A', 'b0000000-0000-4000-8000-000000000001', 'locked', NULL);

INSERT INTO teacher_workspaces (teacher_id, workspace_id) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001'),
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002');

INSERT INTO student_enrollments (student_id, workspace_id)
SELECT p.id, w.id FROM profiles p CROSS JOIN workspaces w
WHERE p.role = 'student' AND p.class_label = 'Year 9A';

-- Topics Science
INSERT INTO topics (id, workspace_id, heading, sub_heading, description, target_weeks, sort_order) VALUES
  ('d0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'Cell biology', 'Structure and function', 'Organelles, diffusion, osmosis.', '{1,2}', 0),
  ('d0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001', 'Forces', 'Newton''s laws', 'Balanced and unbalanced forces.', '{3,4}', 1);

INSERT INTO topic_resources (id, topic_id, kind, title, url, visible_to_students) VALUES
  ('e0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 'video', 'Introduction to cells', 'https://www.youtube.com/watch?v=demo', true),
  ('e0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001', 'paper', 'Topic check worksheet', 'https://example.com/paper.pdf', false);

INSERT INTO topics (id, workspace_id, heading, sub_heading, description, target_weeks, sort_order) VALUES
  ('d0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000002', 'Algebra foundations', 'Linear equations', 'Solving linear equations in one variable.', '{1,2}', 0);

INSERT INTO topic_resources (id, topic_id, kind, title, url, visible_to_students) VALUES
  ('e0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000003', 'video', 'Solving equations', 'https://www.youtube.com/watch?v=demo2', true);

INSERT INTO week_tracking (workspace_id, week_index, status, remarks) VALUES
  ('c0000000-0000-4000-8000-000000000001', 1, 'completed', ''),
  ('c0000000-0000-4000-8000-000000000001', 2, 'partial', 'Assessment week'),
  ('c0000000-0000-4000-8000-000000000001', 3, 'not_covered', 'School trip'),
  ('c0000000-0000-4000-8000-000000000002', 1, 'completed', ''),
  ('c0000000-0000-4000-8000-000000000002', 2, 'completed', '');

INSERT INTO grades (id, workspace_id, student_id, category, assessment_name, date, value, remarks) VALUES
  ('f0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', 'test', 'Cells quiz', '2026-03-15', '72%', 'Solid understanding of organelles.'),
  ('f0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', 'exam', 'Term 1 paper', '2026-03-10', '84%', ''),
  ('f0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000010', 'test', 'Cells quiz', '2026-03-15', '45%', 'Review diffusion.');

INSERT INTO attendance_records (id, workspace_id, student_id, date, presence, reason_code) VALUES
  ('a1000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', '2026-04-01', 'present', NULL),
  ('a1000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002', '2026-04-03', 'late', 'Medical'),
  ('a1000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000002', 'b0000000-0000-4000-8000-000000000002', '2026-04-02', 'absent', 'Unexplained');

INSERT INTO timetable_slots (id, school_id, day, start_time, end_time, subject_name, class_label, teacher_user_id, teacher_name, room, workspace_id) VALUES
  ('a2000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Mon', '09:00', '10:00', 'Science', 'Year 9A', 'b0000000-0000-4000-8000-000000000001', 'Dr. Morgan Chen', 'Lab 2', 'c0000000-0000-4000-8000-000000000001'),
  ('a2000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Mon', '10:15', '11:15', 'Mathematics', 'Year 9A', 'b0000000-0000-4000-8000-000000000001', 'Dr. Morgan Chen', 'B12', 'c0000000-0000-4000-8000-000000000002'),
  ('a2000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'Tue', '09:00', '10:00', 'English', 'Year 9A', NULL, 'Ms. Adebayo', 'A4', NULL),
  ('a2000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'Wed', '11:30', '12:30', 'Science', 'Year 9A', 'b0000000-0000-4000-8000-000000000001', 'Dr. Morgan Chen', 'Lab 2', 'c0000000-0000-4000-8000-000000000001'),
  ('a2000000-0000-4000-8000-000000000005', 'a0000000-0000-4000-8000-000000000001', 'Mon', '10:15', '11:15', 'History', 'Year 9A', NULL, 'Mr. Smith', 'B12', NULL);

INSERT INTO change_requests (id, workspace_id, reason, status, requested_by, requested_at) VALUES
  ('a3000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002', 'Reorder weeks 3–4 to align with district assessment window.', 'pending', 'b0000000-0000-4000-8000-000000000001', '2026-03-20');

INSERT INTO account_requests (id, school_id, school_external_id, name, email, requested_role, status, requested_at) VALUES
  ('a4000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'DEMO01', 'Taylor Kim', 'taylor.kim@example.com', 'teacher', 'pending', '2026-04-05');

INSERT INTO year_groups (school_id, label, sort_order) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'Year 9A', 0),
  ('a0000000-0000-4000-8000-000000000001', 'Year 10B', 1);

INSERT INTO school_subjects (school_id, name, code, year_group_labels) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'Science', 'SCI', '{Year 9A}'),
  ('a0000000-0000-4000-8000-000000000001', 'Mathematics', 'MATH', '{Year 9A}'),
  ('a0000000-0000-4000-8000-000000000001', 'English', 'ENG', '{Year 9A}');

INSERT INTO grading_schemes (school_id, name, scheme_type, config) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'Percentage', 'percentage', '{"pass_threshold": 50}'),
  ('a0000000-0000-4000-8000-000000000001', 'Behaviour Descriptive', 'descriptive', '{"values": ["Excellent", "Good", "Satisfactory", "Needs Improvement"]}');

INSERT INTO attendance_reason_codes (school_id, code, label) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'Medical', 'Medical'),
  ('a0000000-0000-4000-8000-000000000001', 'Unexplained', 'Unexplained'),
  ('a0000000-0000-4000-8000-000000000001', 'School Trip', 'School Trip');

-- GCSE Mathematics curriculum template (PRD SF-004)
INSERT INTO curriculum_templates (id, school_id, school_subject_id, name, term_weeks)
SELECT
  'f1000000-0000-4000-8000-000000000001',
  'a0000000-0000-4000-8000-000000000001',
  ss.id,
  'Mathematics GCSE',
  6
FROM school_subjects ss
WHERE ss.school_id = 'a0000000-0000-4000-8000-000000000001' AND ss.name = 'Mathematics';

INSERT INTO template_topics (template_id, heading, sub_heading, description, target_weeks, sort_order) VALUES
  ('f1000000-0000-4000-8000-000000000001', 'Number: integers, decimals & rounding', 'Foundation', '', '{1}', 0),
  ('f1000000-0000-4000-8000-000000000001', 'Fractions, decimals & percentages', 'Foundation', '', '{1}', 1),
  ('f1000000-0000-4000-8000-000000000001', 'Ratio & proportion', 'Foundation', '', '{2}', 2),
  ('f1000000-0000-4000-8000-000000000001', 'Indices & standard form', 'Foundation', '', '{2}', 3),
  ('f1000000-0000-4000-8000-000000000001', 'Algebra: expressions & formulae', 'Foundation', '', '{3}', 4),
  ('f1000000-0000-4000-8000-000000000001', 'Algebra: equations & inequalities', 'Foundation', '', '{3}', 5),
  ('f1000000-0000-4000-8000-000000000001', 'Sequences & nth term', 'Foundation', '', '{4}', 6),
  ('f1000000-0000-4000-8000-000000000001', 'Coordinates & straight-line graphs', 'Foundation', '', '{4}', 7),
  ('f1000000-0000-4000-8000-000000000001', 'Geometry: angles & shape properties', 'Foundation', '', '{5}', 8),
  ('f1000000-0000-4000-8000-000000000001', 'Perimeter, area & volume', 'Foundation', '', '{5}', 9),
  ('f1000000-0000-4000-8000-000000000001', 'Statistics: averages & range', 'Foundation', '', '{6}', 10),
  ('f1000000-0000-4000-8000-000000000001', 'Probability', 'Foundation', '', '{6}', 11),
  ('f1000000-0000-4000-8000-000000000001', 'Quadratic equations (completing the square / formula)', 'Higher', '', '{6}', 12),
  ('f1000000-0000-4000-8000-000000000001', 'Vectors', 'Higher', '', '{6}', 13);
