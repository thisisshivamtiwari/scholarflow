-- Fix RLS infinite recursion between workspaces and student_enrollments

CREATE OR REPLACE FUNCTION workspace_in_my_school(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspaces w
    WHERE w.id = p_workspace_id AND w.school_id = get_my_school_id()
  );
$$;

CREATE OR REPLACE FUNCTION is_enrolled_in_workspace(
  p_workspace_id UUID,
  p_student_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM student_enrollments se
    WHERE se.workspace_id = p_workspace_id AND se.student_id = p_student_id
  );
$$;

CREATE OR REPLACE FUNCTION parent_in_workspace(
  p_workspace_id UUID,
  p_parent_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM student_enrollments se
    JOIN parent_children pc ON pc.student_id = se.student_id
    WHERE se.workspace_id = p_workspace_id AND pc.parent_id = p_parent_id
  );
$$;

DROP POLICY IF EXISTS workspaces_select ON workspaces;
CREATE POLICY workspaces_select ON workspaces FOR SELECT TO authenticated
  USING (
    school_id = get_my_school_id()
    AND (
      is_headmaster_or_admin()
      OR teacher_user_id = auth.uid()
      OR is_enrolled_in_workspace(id)
      OR parent_in_workspace(id)
    )
  );

DROP POLICY IF EXISTS student_enrollments_select ON student_enrollments;
CREATE POLICY student_enrollments_select ON student_enrollments FOR SELECT TO authenticated
  USING (workspace_in_my_school(workspace_id));

DROP POLICY IF EXISTS teacher_workspaces_select ON teacher_workspaces;
CREATE POLICY teacher_workspaces_select ON teacher_workspaces FOR SELECT TO authenticated
  USING (workspace_in_my_school(workspace_id));

CREATE OR REPLACE FUNCTION can_access_workspace(p_workspace_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT workspace_in_my_school(p_workspace_id)
    AND (
      is_headmaster_or_admin()
      OR EXISTS (
        SELECT 1 FROM workspaces w
        WHERE w.id = p_workspace_id AND w.teacher_user_id = auth.uid()
      )
      OR is_enrolled_in_workspace(p_workspace_id)
      OR parent_in_workspace(p_workspace_id)
    );
$$;
