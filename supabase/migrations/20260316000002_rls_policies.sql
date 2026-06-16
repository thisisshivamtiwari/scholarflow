-- ScholarFlow TMS — Row Level Security policies

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE week_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE year_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE grading_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_reason_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_log ENABLE ROW LEVEL SECURITY;

-- Schools
CREATE POLICY schools_select ON schools FOR SELECT TO authenticated
  USING (id = get_my_school_id());

CREATE POLICY schools_update ON schools FOR UPDATE TO authenticated
  USING (id = get_my_school_id() AND is_headmaster_or_admin())
  WITH CHECK (id = get_my_school_id() AND is_headmaster_or_admin());

-- Profiles
CREATE POLICY profiles_select ON profiles FOR SELECT TO authenticated
  USING (school_id = get_my_school_id());

CREATE POLICY profiles_update ON profiles FOR UPDATE TO authenticated
  USING (school_id = get_my_school_id() AND is_headmaster_or_admin())
  WITH CHECK (school_id = get_my_school_id() AND is_headmaster_or_admin());

-- Helper for parent school check
CREATE OR REPLACE FUNCTION school_id_check_parent(p_parent_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = p_parent_id AND school_id = get_my_school_id()
  ) AND is_headmaster_or_admin();
$$;

-- Parent children
CREATE POLICY parent_children_select ON parent_children FOR SELECT TO authenticated
  USING (
    parent_id = auth.uid()
    OR student_id = auth.uid()
    OR school_id_check_parent(parent_id)
  );

CREATE POLICY parent_children_manage ON parent_children FOR ALL TO authenticated
  USING (is_headmaster_or_admin() AND EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = parent_children.parent_id AND p.school_id = get_my_school_id()
  ))
  WITH CHECK (is_headmaster_or_admin());

-- Workspaces
CREATE POLICY workspaces_select ON workspaces FOR SELECT TO authenticated
  USING (
    school_id = get_my_school_id()
    AND (
      is_headmaster_or_admin()
      OR teacher_user_id = auth.uid()
      OR EXISTS (SELECT 1 FROM student_enrollments se WHERE se.workspace_id = workspaces.id AND se.student_id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM student_enrollments se
        JOIN parent_children pc ON pc.student_id = se.student_id
        WHERE se.workspace_id = workspaces.id AND pc.parent_id = auth.uid()
      )
    )
  );

CREATE POLICY workspaces_teacher_write ON workspaces FOR UPDATE TO authenticated
  USING (school_id = get_my_school_id() AND teacher_user_id = auth.uid())
  WITH CHECK (school_id = get_my_school_id() AND teacher_user_id = auth.uid());

CREATE POLICY workspaces_headmaster_write ON workspaces FOR ALL TO authenticated
  USING (school_id = get_my_school_id() AND is_headmaster())
  WITH CHECK (school_id = get_my_school_id() AND is_headmaster());

CREATE POLICY workspaces_admin_insert ON workspaces FOR INSERT TO authenticated
  WITH CHECK (school_id = get_my_school_id() AND is_headmaster_or_admin());

-- Teacher workspaces
CREATE POLICY teacher_workspaces_select ON teacher_workspaces FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.school_id = get_my_school_id()));

CREATE POLICY teacher_workspaces_manage ON teacher_workspaces FOR ALL TO authenticated
  USING (is_headmaster_or_admin())
  WITH CHECK (is_headmaster_or_admin());

-- Student enrollments
CREATE POLICY student_enrollments_select ON student_enrollments FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.school_id = get_my_school_id()
  ));

CREATE POLICY student_enrollments_manage ON student_enrollments FOR ALL TO authenticated
  USING (is_headmaster_or_admin())
  WITH CHECK (is_headmaster_or_admin());

-- Topics (inherit workspace access)
CREATE OR REPLACE FUNCTION can_access_workspace(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspaces w WHERE w.id = p_workspace_id AND w.school_id = get_my_school_id()
    AND (
      is_headmaster_or_admin()
      OR w.teacher_user_id = auth.uid()
      OR EXISTS (SELECT 1 FROM student_enrollments se WHERE se.workspace_id = w.id AND se.student_id = auth.uid())
      OR EXISTS (
        SELECT 1 FROM student_enrollments se
        JOIN parent_children pc ON pc.student_id = se.student_id
        WHERE se.workspace_id = w.id AND pc.parent_id = auth.uid()
      )
    )
  );
$$;

CREATE OR REPLACE FUNCTION can_edit_workspace(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspaces w WHERE w.id = p_workspace_id
    AND w.school_id = get_my_school_id()
    AND (
      (w.teacher_user_id = auth.uid() AND w.curriculum_status IN ('draft', 'rejected'))
      OR is_headmaster()
    )
  );
$$;

CREATE POLICY topics_select ON topics FOR SELECT TO authenticated
  USING (can_access_workspace(workspace_id));

CREATE POLICY topics_write ON topics FOR ALL TO authenticated
  USING (can_edit_workspace(workspace_id))
  WITH CHECK (can_edit_workspace(workspace_id));

-- Topic resources
CREATE POLICY topic_resources_select ON topic_resources FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM topics t WHERE t.id = topic_id AND can_access_workspace(t.workspace_id))
    AND (
      is_headmaster_or_admin()
      OR EXISTS (SELECT 1 FROM topics t JOIN workspaces w ON w.id = t.workspace_id WHERE t.id = topic_id AND w.teacher_user_id = auth.uid())
      OR (
        visible_to_students
        AND EXISTS (
          SELECT 1 FROM topics t JOIN workspaces w ON w.id = t.workspace_id
          WHERE t.id = topic_id AND w.curriculum_status = 'locked'
          AND (
            EXISTS (SELECT 1 FROM student_enrollments se WHERE se.workspace_id = w.id AND se.student_id = auth.uid())
            OR EXISTS (
              SELECT 1 FROM student_enrollments se JOIN parent_children pc ON pc.student_id = se.student_id
              JOIN schools s ON s.id = w.school_id
              WHERE se.workspace_id = w.id AND pc.parent_id = auth.uid() AND s.parent_resource_access = true
            )
          )
        )
      )
    )
  );

CREATE POLICY topic_resources_write ON topic_resources FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM topics t JOIN workspaces w ON w.id = t.workspace_id
      WHERE t.id = topic_id AND w.teacher_user_id = auth.uid() AND w.school_id = get_my_school_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM topics t JOIN workspaces w ON w.id = t.workspace_id
      WHERE t.id = topic_id AND w.teacher_user_id = auth.uid() AND w.school_id = get_my_school_id()
    )
  );

-- Week tracking
CREATE POLICY week_tracking_select ON week_tracking FOR SELECT TO authenticated
  USING (can_access_workspace(workspace_id));

CREATE POLICY week_tracking_write ON week_tracking FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.teacher_user_id = auth.uid() AND w.school_id = get_my_school_id())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.teacher_user_id = auth.uid() AND w.school_id = get_my_school_id())
  );

-- Grades
CREATE POLICY grades_select ON grades FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.school_id = get_my_school_id())
    AND (
      is_headmaster_or_admin()
      OR EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.teacher_user_id = auth.uid())
      OR student_id = auth.uid()
      OR EXISTS (SELECT 1 FROM parent_children pc WHERE pc.parent_id = auth.uid() AND pc.student_id = grades.student_id)
    )
  );

CREATE POLICY grades_write ON grades FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.teacher_user_id = auth.uid() AND w.school_id = get_my_school_id())
    OR (is_headmaster_or_admin() AND EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.school_id = get_my_school_id()))
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.teacher_user_id = auth.uid() AND w.school_id = get_my_school_id())
    OR (is_headmaster_or_admin() AND EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.school_id = get_my_school_id()))
  );

-- Attendance
CREATE POLICY attendance_select ON attendance_records FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.school_id = get_my_school_id())
    AND (
      is_headmaster_or_admin()
      OR EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.teacher_user_id = auth.uid())
      OR student_id = auth.uid()
      OR EXISTS (SELECT 1 FROM parent_children pc WHERE pc.parent_id = auth.uid() AND pc.student_id = attendance_records.student_id)
    )
  );

CREATE POLICY attendance_write ON attendance_records FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.teacher_user_id = auth.uid() AND w.school_id = get_my_school_id())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.teacher_user_id = auth.uid() AND w.school_id = get_my_school_id())
  );

-- Timetable
CREATE POLICY timetable_select ON timetable_slots FOR SELECT TO authenticated
  USING (school_id = get_my_school_id());

CREATE POLICY timetable_write ON timetable_slots FOR ALL TO authenticated
  USING (school_id = get_my_school_id() AND is_headmaster_or_admin())
  WITH CHECK (school_id = get_my_school_id() AND is_headmaster_or_admin());

-- Change requests
CREATE POLICY change_requests_select ON change_requests FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.school_id = get_my_school_id())
    AND (
      is_headmaster_or_admin()
      OR EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.teacher_user_id = auth.uid())
    )
  );

CREATE POLICY change_requests_teacher_insert ON change_requests FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.teacher_user_id = auth.uid() AND w.curriculum_status = 'locked')
  );

CREATE POLICY change_requests_headmaster_update ON change_requests FOR UPDATE TO authenticated
  USING (is_headmaster() AND EXISTS (SELECT 1 FROM workspaces w WHERE w.id = workspace_id AND w.school_id = get_my_school_id()))
  WITH CHECK (is_headmaster());

-- Account requests
CREATE POLICY account_requests_anon_insert ON account_requests FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY account_requests_select ON account_requests FOR SELECT TO authenticated
  USING (
    (school_id IS NOT NULL AND school_id = get_my_school_id() AND is_headmaster_or_admin())
    OR (school_id IS NULL AND is_headmaster_or_admin())
  );

CREATE POLICY account_requests_update ON account_requests FOR UPDATE TO authenticated
  USING (is_headmaster_or_admin())
  WITH CHECK (is_headmaster_or_admin());

-- Config tables
CREATE POLICY year_groups_all ON year_groups FOR ALL TO authenticated
  USING (school_id = get_my_school_id())
  WITH CHECK (school_id = get_my_school_id() AND is_headmaster_or_admin());

CREATE POLICY school_subjects_all ON school_subjects FOR ALL TO authenticated
  USING (school_id = get_my_school_id())
  WITH CHECK (school_id = get_my_school_id() AND is_headmaster_or_admin());

CREATE POLICY grading_schemes_all ON grading_schemes FOR ALL TO authenticated
  USING (school_id = get_my_school_id())
  WITH CHECK (school_id = get_my_school_id() AND is_headmaster_or_admin());

CREATE POLICY attendance_reason_codes_all ON attendance_reason_codes FOR ALL TO authenticated
  USING (school_id = get_my_school_id())
  WITH CHECK (school_id = get_my_school_id() AND is_headmaster_or_admin());

-- Audit logs (read-only for headmaster/admin)
CREATE POLICY audit_logs_select ON audit_logs FOR SELECT TO authenticated
  USING (school_id = get_my_school_id() AND is_headmaster_or_admin());

CREATE POLICY notification_log_select ON notification_log FOR SELECT TO authenticated
  USING (school_id = get_my_school_id() AND is_headmaster_or_admin());

-- Storage bucket for question papers
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('question-papers', 'question-papers', false, 52428800)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY storage_papers_select ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'question-papers' AND (storage.foldername(name))[1] = get_my_school_id()::TEXT);

CREATE POLICY storage_papers_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'question-papers' AND (storage.foldername(name))[1] = get_my_school_id()::TEXT);

CREATE POLICY storage_papers_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'question-papers' AND (storage.foldername(name))[1] = get_my_school_id()::TEXT);
