-- PRD v1.0 — account requests, subjects, templates, curriculum fixes, behaviour, timetable weekends

ALTER TABLE schools ADD COLUMN IF NOT EXISTS term_weeks INTEGER NOT NULL DEFAULT 6;
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS term_weeks INTEGER;

ALTER TYPE timetable_day ADD VALUE IF NOT EXISTS 'Sat';
ALTER TYPE timetable_day ADD VALUE IF NOT EXISTS 'Sun';

CREATE OR REPLACE FUNCTION list_onboarding_schools()
RETURNS TABLE (external_id TEXT, name TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.external_id, s.name
  FROM schools s
  WHERE upper(s.external_id) <> 'SCHOLARFLOW'
  ORDER BY s.name;
$$;

GRANT EXECUTE ON FUNCTION list_onboarding_schools() TO anon, authenticated;

CREATE TABLE IF NOT EXISTS subject_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_name TEXT NOT NULL,
  class_label TEXT NOT NULL,
  school_subject_id UUID REFERENCES school_subjects(id) ON DELETE SET NULL,
  notes TEXT NOT NULL DEFAULT '',
  status request_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subject_requests_school ON subject_requests(school_id, status);

CREATE TABLE IF NOT EXISTS curriculum_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  school_subject_id UUID REFERENCES school_subjects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  term_weeks INTEGER NOT NULL DEFAULT 6,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (school_id, school_subject_id)
);

CREATE TABLE IF NOT EXISTS template_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES curriculum_templates(id) ON DELETE CASCADE,
  heading TEXT NOT NULL,
  sub_heading TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  target_weeks INTEGER[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_template_topics_template ON template_topics(template_id);

CREATE TABLE IF NOT EXISTS behaviour_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  remark TEXT NOT NULL DEFAULT '',
  status request_status NOT NULL DEFAULT 'pending',
  recorded_by UUID NOT NULL REFERENCES profiles(id),
  reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_behaviour_workspace ON behaviour_records(workspace_id);
CREATE INDEX IF NOT EXISTS idx_behaviour_student ON behaviour_records(student_id, status);

CREATE OR REPLACE FUNCTION apply_curriculum_template(p_workspace_id UUID, p_template_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ws workspaces%ROWTYPE;
  v_tpl curriculum_templates%ROWTYPE;
  r RECORD;
BEGIN
  SELECT * INTO v_ws FROM workspaces WHERE id = p_workspace_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Workspace not found'; END IF;

  SELECT * INTO v_tpl FROM curriculum_templates WHERE id = p_template_id AND school_id = v_ws.school_id;
  IF NOT FOUND THEN RETURN; END IF;

  IF EXISTS (SELECT 1 FROM topics WHERE workspace_id = p_workspace_id) THEN
    RETURN;
  END IF;

  UPDATE workspaces SET term_weeks = v_tpl.term_weeks WHERE id = p_workspace_id;

  FOR r IN
    SELECT * FROM template_topics WHERE template_id = p_template_id ORDER BY sort_order
  LOOP
    INSERT INTO topics (workspace_id, heading, sub_heading, description, target_weeks, sort_order)
    VALUES (p_workspace_id, r.heading, r.sub_heading, r.description, r.target_weeks, r.sort_order);
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION apply_curriculum_template(UUID, UUID) TO authenticated;

CREATE OR REPLACE FUNCTION apply_template_for_subject(p_workspace_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ws workspaces%ROWTYPE;
  v_tpl_id UUID;
BEGIN
  SELECT * INTO v_ws FROM workspaces WHERE id = p_workspace_id;
  IF NOT FOUND THEN RETURN; END IF;

  SELECT ct.id INTO v_tpl_id
  FROM curriculum_templates ct
  JOIN school_subjects ss ON ss.id = ct.school_subject_id
  WHERE ct.school_id = v_ws.school_id
    AND lower(ss.name) = lower(v_ws.subject_name)
  LIMIT 1;

  IF v_tpl_id IS NULL THEN
    SELECT ct.id INTO v_tpl_id
    FROM curriculum_templates ct
    WHERE ct.school_id = v_ws.school_id
      AND lower(ct.name) = lower(v_ws.subject_name)
    LIMIT 1;
  END IF;

  IF v_tpl_id IS NOT NULL THEN
    PERFORM apply_curriculum_template(p_workspace_id, v_tpl_id);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION apply_template_for_subject(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION approve_subject_request(p_request_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_req subject_requests%ROWTYPE;
  v_ws_id UUID;
BEGIN
  IF NOT is_headmaster_or_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;

  SELECT * INTO v_req FROM subject_requests WHERE id = p_request_id AND school_id = get_my_school_id();
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF v_req.status <> 'pending' THEN RAISE EXCEPTION 'Request already processed'; END IF;

  INSERT INTO workspaces (school_id, subject_name, class_label, teacher_user_id, curriculum_status)
  VALUES (v_req.school_id, v_req.subject_name, v_req.class_label, v_req.teacher_id, 'draft')
  RETURNING id INTO v_ws_id;

  INSERT INTO teacher_workspaces (teacher_id, workspace_id)
  VALUES (v_req.teacher_id, v_ws_id)
  ON CONFLICT DO NOTHING;

  PERFORM apply_template_for_subject(v_ws_id);

  UPDATE subject_requests
  SET status = 'approved', reviewed_by = auth.uid(), reviewed_at = now()
  WHERE id = p_request_id;

  RETURN v_ws_id;
END;
$$;

GRANT EXECUTE ON FUNCTION approve_subject_request(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION reject_subject_request(p_request_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_headmaster_or_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE subject_requests
  SET status = 'rejected', reviewed_by = auth.uid(), reviewed_at = now()
  WHERE id = p_request_id AND school_id = get_my_school_id() AND status = 'pending';
END;
$$;

GRANT EXECUTE ON FUNCTION reject_subject_request(UUID) TO authenticated;

CREATE OR REPLACE FUNCTION approve_syllabus(p_workspace_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_headmaster_or_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE workspaces
  SET curriculum_status = 'locked', rejection_reason = NULL, updated_at = now()
  WHERE id = p_workspace_id AND school_id = get_my_school_id();
END;
$$;

CREATE OR REPLACE FUNCTION reject_syllabus(p_workspace_id UUID, p_reason TEXT DEFAULT '')
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_headmaster_or_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE workspaces
  SET curriculum_status = 'rejected', rejection_reason = NULLIF(trim(p_reason), ''), updated_at = now()
  WHERE id = p_workspace_id AND school_id = get_my_school_id();
END;
$$;

CREATE OR REPLACE FUNCTION submit_curriculum_for_approval(p_workspace_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE workspaces
  SET curriculum_status = 'pending', submitted_at = CURRENT_DATE, rejection_reason = NULL, updated_at = now()
  WHERE id = p_workspace_id
    AND teacher_user_id = auth.uid()
    AND curriculum_status IN ('draft', 'rejected');
END;
$$;

CREATE OR REPLACE FUNCTION approve_change_request(p_request_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_ws UUID;
BEGIN
  IF NOT is_headmaster_or_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  SELECT workspace_id INTO v_ws FROM change_requests WHERE id = p_request_id;
  UPDATE change_requests SET status = 'approved' WHERE id = p_request_id;
  UPDATE workspaces SET curriculum_status = 'draft', updated_at = now() WHERE id = v_ws;
END;
$$;

CREATE OR REPLACE FUNCTION reject_change_request(p_request_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_headmaster_or_admin() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE change_requests SET status = 'rejected' WHERE id = p_request_id;
END;
$$;

CREATE OR REPLACE FUNCTION approve_behaviour_record(p_record_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_headmaster() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE behaviour_records
  SET status = 'approved', reviewed_by = auth.uid(), reviewed_at = now()
  WHERE id = p_record_id
    AND EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = behaviour_records.workspace_id AND w.school_id = get_my_school_id()
    );
END;
$$;

CREATE OR REPLACE FUNCTION reject_behaviour_record(p_record_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_headmaster() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE behaviour_records
  SET status = 'rejected', reviewed_by = auth.uid(), reviewed_at = now()
  WHERE id = p_record_id
    AND EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = behaviour_records.workspace_id AND w.school_id = get_my_school_id()
    );
END;
$$;

GRANT EXECUTE ON FUNCTION approve_behaviour_record(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_behaviour_record(UUID) TO authenticated;

ALTER TABLE subject_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE behaviour_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY subject_requests_insert ON subject_requests FOR INSERT TO authenticated
  WITH CHECK (school_id = get_my_school_id() AND teacher_id = auth.uid() AND get_my_role() = 'teacher');

CREATE POLICY subject_requests_select ON subject_requests FOR SELECT TO authenticated
  USING (school_id = get_my_school_id());

CREATE POLICY subject_requests_update ON subject_requests FOR UPDATE TO authenticated
  USING (school_id = get_my_school_id() AND is_headmaster_or_admin());

CREATE POLICY curriculum_templates_all ON curriculum_templates FOR ALL TO authenticated
  USING (school_id = get_my_school_id() AND is_headmaster_or_admin())
  WITH CHECK (school_id = get_my_school_id() AND is_headmaster_or_admin());

CREATE POLICY template_topics_all ON template_topics FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM curriculum_templates ct
    WHERE ct.id = template_id AND ct.school_id = get_my_school_id()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM curriculum_templates ct
    WHERE ct.id = template_id AND ct.school_id = get_my_school_id()
  ));

CREATE POLICY behaviour_insert ON behaviour_records FOR INSERT TO authenticated
  WITH CHECK (
    get_my_role() = 'teacher'
    AND recorded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM workspaces w
      WHERE w.id = workspace_id AND w.school_id = get_my_school_id()
    )
  );

CREATE POLICY behaviour_select ON behaviour_records FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.school_id = get_my_school_id())
    AND (
      is_headmaster_or_admin()
      OR recorded_by = auth.uid()
      OR (get_my_role() = 'parent' AND status = 'approved' AND student_id IN (
        SELECT student_id FROM parent_children WHERE parent_id = auth.uid()
      ))
      OR (get_my_role() = 'student' AND student_id = auth.uid())
    )
  );

CREATE POLICY behaviour_update ON behaviour_records FOR UPDATE TO authenticated
  USING (
    is_headmaster()
    AND EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.school_id = get_my_school_id())
  );
