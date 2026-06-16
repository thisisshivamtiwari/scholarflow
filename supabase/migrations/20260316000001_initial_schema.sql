-- ScholarFlow TMS — initial schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE user_role AS ENUM ('teacher', 'student', 'parent', 'headmaster', 'admin');
CREATE TYPE curriculum_status AS ENUM ('draft', 'pending', 'locked', 'change_requested', 'rejected');
CREATE TYPE week_delivery_status AS ENUM ('completed', 'partial', 'not_covered');
CREATE TYPE presence AS ENUM ('present', 'absent', 'late');
CREATE TYPE grade_category AS ENUM ('exam', 'test', 'assessment', 'behaviour', 'other');
CREATE TYPE resource_kind AS ENUM ('video', 'paper');
CREATE TYPE timetable_day AS ENUM ('Mon', 'Tue', 'Wed', 'Thu', 'Fri');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE grading_scheme_type AS ENUM ('percentage', 'letter', 'descriptive', 'custom_numeric', 'combined');

-- Schools (tenant root)
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2025–2026',
  grade_threshold_percent INTEGER NOT NULL DEFAULT 50,
  attendance_threshold_percent INTEGER NOT NULL DEFAULT 80,
  parent_resource_access BOOLEAN NOT NULL DEFAULT false,
  session_timeout_minutes INTEGER NOT NULL DEFAULT 30,
  attendance_lock_hours INTEGER NOT NULL DEFAULT 24,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL,
  class_label TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (school_id, username),
  UNIQUE (school_id, email)
);

CREATE INDEX idx_profiles_school ON profiles(school_id);
CREATE INDEX idx_profiles_role ON profiles(school_id, role);

-- Parent ↔ student links
CREATE TABLE parent_children (
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (parent_id, student_id)
);

-- Workspaces (subject + class curriculum unit)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  class_label TEXT NOT NULL,
  teacher_user_id UUID NOT NULL REFERENCES profiles(id),
  curriculum_status curriculum_status NOT NULL DEFAULT 'draft',
  submitted_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_workspaces_school ON workspaces(school_id);
CREATE INDEX idx_workspaces_teacher ON workspaces(teacher_user_id);

CREATE TABLE teacher_workspaces (
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  PRIMARY KEY (teacher_id, workspace_id)
);

CREATE TABLE student_enrollments (
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  PRIMARY KEY (student_id, workspace_id)
);

-- Topics
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  heading TEXT NOT NULL,
  sub_heading TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  target_weeks INTEGER[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_topics_workspace ON topics(workspace_id);

CREATE TABLE topic_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  kind resource_kind NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL DEFAULT '',
  storage_path TEXT,
  visible_to_students BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_topic_resources_topic ON topic_resources(topic_id);

CREATE TABLE week_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  week_index INTEGER NOT NULL,
  status week_delivery_status NOT NULL DEFAULT 'not_covered',
  remarks TEXT NOT NULL DEFAULT '',
  UNIQUE (workspace_id, week_index)
);

CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id),
  category grade_category NOT NULL,
  assessment_name TEXT NOT NULL,
  date DATE NOT NULL,
  value TEXT NOT NULL,
  remarks TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_grades_workspace ON grades(workspace_id);
CREATE INDEX idx_grades_student ON grades(student_id);

CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id),
  date DATE NOT NULL,
  presence presence NOT NULL,
  reason_code TEXT,
  locked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workspace_id, student_id, date)
);

CREATE INDEX idx_attendance_workspace ON attendance_records(workspace_id);
CREATE INDEX idx_attendance_student ON attendance_records(student_id);

CREATE TABLE timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  day timetable_day NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  subject_name TEXT NOT NULL,
  class_label TEXT NOT NULL,
  teacher_user_id UUID REFERENCES profiles(id),
  teacher_name TEXT NOT NULL DEFAULT '',
  room TEXT NOT NULL DEFAULT '',
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_timetable_school ON timetable_slots(school_id);

CREATE TABLE change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status request_status NOT NULL DEFAULT 'pending',
  requested_by UUID REFERENCES profiles(id),
  requested_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE account_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  school_external_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  requested_role user_role NOT NULL,
  notes TEXT DEFAULT '',
  status request_status NOT NULL DEFAULT 'pending',
  requested_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- School configuration tables
CREATE TABLE year_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (school_id, label)
);

CREATE TABLE school_subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL DEFAULT '',
  year_group_labels TEXT[] NOT NULL DEFAULT '{}',
  UNIQUE (school_id, name)
);

CREATE TABLE grading_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  scheme_type grading_scheme_type NOT NULL DEFAULT 'percentage',
  config JSONB NOT NULL DEFAULT '{}',
  UNIQUE (school_id, name)
);

CREATE TABLE attendance_reason_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  label TEXT NOT NULL,
  UNIQUE (school_id, code)
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  delta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_school ON audit_logs(school_id, created_at DESC);

CREATE TABLE notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'stubbed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helper functions for RLS
CREATE OR REPLACE FUNCTION get_my_profile()
RETURNS profiles
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM profiles WHERE id = auth.uid() AND active = true;
$$;

CREATE OR REPLACE FUNCTION get_my_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = auth.uid() AND active = true;
$$;

CREATE OR REPLACE FUNCTION get_my_school_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT school_id FROM profiles WHERE id = auth.uid() AND active = true;
$$;

CREATE OR REPLACE FUNCTION is_headmaster_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role IN ('headmaster', 'admin') FROM profiles WHERE id = auth.uid() AND active = true;
$$;

CREATE OR REPLACE FUNCTION is_headmaster()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role = 'headmaster' FROM profiles WHERE id = auth.uid() AND active = true;
$$;

-- Login resolver (PRD: School ID + username → auth email)
CREATE OR REPLACE FUNCTION resolve_login_email(p_school_external_id TEXT, p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT p.email INTO v_email
  FROM profiles p
  JOIN schools s ON s.id = p.school_id
  WHERE upper(s.external_id) = upper(trim(p_school_external_id))
    AND lower(p.username) = lower(trim(p_username))
    AND p.active = true;
  RETURN v_email;
END;
$$;

GRANT EXECUTE ON FUNCTION resolve_login_email(TEXT, TEXT) TO anon, authenticated;

-- Updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER schools_updated_at BEFORE UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER attendance_updated_at BEFORE UPDATE ON attendance_records FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER timetable_updated_at BEFORE UPDATE ON timetable_slots FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Derived views
CREATE OR REPLACE VIEW v_flagged_students AS
SELECT DISTINCT g.student_id, p.school_id,
  'Below ' || s.grade_threshold_percent || '% in ' || w.subject_name AS reason
FROM grades g
JOIN workspaces w ON w.id = g.workspace_id
JOIN schools s ON s.id = w.school_id
JOIN profiles p ON p.id = g.student_id
WHERE g.value ~ '^\d+%?$'
  AND (
    CASE WHEN g.value ~ '^\d+'
      THEN (regexp_replace(g.value, '[^0-9]', '', 'g'))::INTEGER
      ELSE 0
    END
  ) < s.grade_threshold_percent;

CREATE OR REPLACE VIEW v_timetable_conflicts AS
SELECT
  t1.school_id,
  t1.id AS slot_id,
  t1.day,
  t1.start_time,
  'Room ' || t1.room || ' double-booked ' || t1.day || ' ' || t1.start_time::TEXT AS description
FROM timetable_slots t1
JOIN timetable_slots t2 ON t1.school_id = t2.school_id
  AND t1.day = t2.day
  AND t1.start_time = t2.start_time
  AND t1.room = t2.room
  AND t1.id < t2.id
  AND t1.room <> '';
