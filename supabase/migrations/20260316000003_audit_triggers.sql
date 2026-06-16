-- ScholarFlow TMS — audit logging triggers

CREATE OR REPLACE FUNCTION audit_log_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_school_id UUID;
  v_user_id UUID;
  v_record_id UUID;
  v_delta JSONB;
BEGIN
  v_user_id := auth.uid();

  IF TG_OP = 'DELETE' THEN
    v_record_id := OLD.id;
    v_delta := to_jsonb(OLD);
  ELSIF TG_OP = 'UPDATE' THEN
    v_record_id := NEW.id;
    v_delta := jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW));
  ELSE
    v_record_id := NEW.id;
    v_delta := to_jsonb(NEW);
  END IF;

  IF TG_TABLE_NAME = 'schools' THEN
    v_school_id := COALESCE(NEW.id, OLD.id);
  ELSIF TG_TABLE_NAME = 'profiles' THEN
    v_school_id := COALESCE(NEW.school_id, OLD.school_id);
  ELSIF TG_TABLE_NAME IN ('workspaces', 'timetable_slots', 'year_groups', 'school_subjects', 'grading_schemes', 'attendance_reason_codes') THEN
    v_school_id := COALESCE(NEW.school_id, OLD.school_id);
  ELSIF TG_TABLE_NAME IN ('topics', 'week_tracking', 'grades', 'attendance_records', 'change_requests') THEN
    SELECT w.school_id INTO v_school_id FROM workspaces w WHERE w.id = COALESCE(NEW.workspace_id, OLD.workspace_id);
  ELSIF TG_TABLE_NAME = 'topic_resources' THEN
    SELECT w.school_id INTO v_school_id FROM topics t JOIN workspaces w ON w.id = t.workspace_id WHERE t.id = COALESCE(NEW.topic_id, OLD.topic_id);
  END IF;

  INSERT INTO audit_logs (school_id, user_id, action, table_name, record_id, delta)
  VALUES (v_school_id, v_user_id, TG_OP, TG_TABLE_NAME, v_record_id, v_delta);

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER audit_workspaces AFTER INSERT OR UPDATE OR DELETE ON workspaces FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
CREATE TRIGGER audit_topics AFTER INSERT OR UPDATE OR DELETE ON topics FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
CREATE TRIGGER audit_grades AFTER INSERT OR UPDATE OR DELETE ON grades FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
CREATE TRIGGER audit_attendance AFTER INSERT OR UPDATE OR DELETE ON attendance_records FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
CREATE TRIGGER audit_change_requests AFTER INSERT OR UPDATE OR DELETE ON change_requests FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
CREATE TRIGGER audit_schools AFTER UPDATE ON schools FOR EACH ROW EXECUTE FUNCTION audit_log_changes();
CREATE TRIGGER audit_profiles AFTER UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION audit_log_changes();

-- RPC helpers for governance mutations
CREATE OR REPLACE FUNCTION approve_syllabus(p_workspace_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_headmaster() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE workspaces SET curriculum_status = 'locked', updated_at = now()
  WHERE id = p_workspace_id AND school_id = get_my_school_id();
END;
$$;

CREATE OR REPLACE FUNCTION reject_syllabus(p_workspace_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT is_headmaster() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE workspaces SET curriculum_status = 'rejected', updated_at = now()
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
  UPDATE workspaces SET curriculum_status = 'pending', submitted_at = CURRENT_DATE, updated_at = now()
  WHERE id = p_workspace_id AND teacher_user_id = auth.uid() AND curriculum_status = 'draft';
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
  IF NOT is_headmaster() THEN RAISE EXCEPTION 'Forbidden'; END IF;
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
  IF NOT is_headmaster() THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE change_requests SET status = 'rejected' WHERE id = p_request_id;
END;
$$;

GRANT EXECUTE ON FUNCTION approve_syllabus(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_syllabus(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION submit_curriculum_for_approval(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION approve_change_request(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION reject_change_request(UUID) TO authenticated;
