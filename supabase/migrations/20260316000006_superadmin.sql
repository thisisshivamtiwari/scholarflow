-- ScholarFlow platform superadmin role (run after enum value exists)

CREATE OR REPLACE FUNCTION is_superadmin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role = 'superadmin' FROM profiles WHERE id = auth.uid() AND active = true;
$$;

-- Platform tenant (not a customer school)
INSERT INTO schools (
  id,
  external_id,
  name,
  academic_year,
  grade_threshold_percent,
  attendance_threshold_percent,
  parent_resource_access,
  session_timeout_minutes,
  attendance_lock_hours
)
VALUES (
  'a0000000-0000-4000-8000-000000000099',
  'SCHOLARFLOW',
  'ScholarFlow Platform',
  '2025–2026',
  50,
  80,
  false,
  60,
  24
)
ON CONFLICT (id) DO NOTHING;

-- Superadmin profile is created via seed.sql / cloud-seed (requires auth.users row first)

-- Cross-tenant access for platform operators
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'schools',
    'profiles',
    'parent_children',
    'workspaces',
    'teacher_workspaces',
    'student_enrollments',
    'topics',
    'topic_resources',
    'week_tracking',
    'grades',
    'attendance_records',
    'timetable_slots',
    'change_requests',
    'account_requests',
    'year_groups',
    'school_subjects',
    'grading_schemes',
    'attendance_reason_codes',
    'audit_logs',
    'notification_log'
  ]
  LOOP
    EXECUTE format(
      'CREATE POLICY superadmin_all_%I ON %I FOR ALL TO authenticated USING (is_superadmin()) WITH CHECK (is_superadmin())',
      t,
      t
    );
  END LOOP;
END $$;

CREATE POLICY superadmin_storage ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'question-papers' AND is_superadmin())
  WITH CHECK (bucket_id = 'question-papers' AND is_superadmin());
