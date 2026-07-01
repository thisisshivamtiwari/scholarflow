import type {
  AppDataState,
  AttendanceRecord,
  AuthUser,
  GradeEntry,
  ResourceItem,
  Role,
  TimetableSlot,
  Topic,
  WeekTracking,
  Workspace,
} from '@/types/tms'
import type { Database } from '@/types/database'
import { supabase } from '@/lib/supabase'

type ProfileRow = Database['public']['Tables']['profiles']['Row']
type WorkspaceRow = Database['public']['Tables']['workspaces']['Row']

export const profileToAuthUser = async (
  profile: ProfileRow,
  schoolExternalId: string,
): Promise<AuthUser> => {
  const user: AuthUser = {
    id: profile.id,
    schoolId: schoolExternalId,
    username: profile.username,
    displayName: profile.display_name,
    email: profile.email,
    role: profile.role as Role,
  }

  if (profile.role === 'teacher') {
    const { data } = await supabase
      .from('teacher_workspaces')
      .select('workspace_id')
      .eq('teacher_id', profile.id)
    user.workspaceIds = data?.map((r) => r.workspace_id) ?? []
  }
  if (profile.role === 'student') {
    user.studentId = profile.id
  }
  if (profile.role === 'parent') {
    const { data } = await supabase
      .from('parent_children')
      .select('student_id')
      .eq('parent_id', profile.id)
    user.parentChildIds = data?.map((r) => r.student_id) ?? []
  }
  return user
}

const mapResource = (r: Database['public']['Tables']['topic_resources']['Row']): ResourceItem => ({
  id: r.id,
  kind: r.kind,
  title: r.title,
  url: r.url,
  visibleToStudents: r.visible_to_students,
})

const mapTopic = (
  t: Database['public']['Tables']['topics']['Row'],
  resources: Database['public']['Tables']['topic_resources']['Row'][],
): Topic => ({
  id: t.id,
  heading: t.heading,
  subHeading: t.sub_heading,
  description: t.description,
  targetWeeks: t.target_weeks,
  resources: resources.filter((r) => r.topic_id === t.id).map(mapResource),
})

const mapWorkspace = (
  w: WorkspaceRow,
  topics: Database['public']['Tables']['topics']['Row'][],
  resources: Database['public']['Tables']['topic_resources']['Row'][],
  tracking: Database['public']['Tables']['week_tracking']['Row'][],
): Workspace => ({
  id: w.id,
  subjectName: w.subject_name,
  classLabel: w.class_label,
  teacherUserId: w.teacher_user_id,
  curriculumStatus: w.curriculum_status,
  submittedAt: w.submitted_at ?? undefined,
  rejectionReason: w.rejection_reason ?? undefined,
  termWeeks: w.term_weeks ?? undefined,
  topics: topics
    .filter((t) => t.workspace_id === w.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((t) => mapTopic(t, resources)),
  tracking: tracking
    .filter((tr) => tr.workspace_id === w.id)
    .map(
      (tr): WeekTracking => ({
        weekIndex: tr.week_index,
        status: tr.status,
        remarks: tr.remarks,
      }),
    ),
})

export const fetchAppDataState = async (): Promise<AppDataState> => {
  const [
    schoolRes,
    workspacesRes,
    topicsRes,
    resourcesRes,
    trackingRes,
    studentsRes,
    enrollmentsRes,
    gradesRes,
    attendanceRes,
    timetableRes,
    changeRes,
    accountRes,
    subjectReqRes,
    behaviourRes,
    flaggedRes,
    conflictsRes,
  ] = await Promise.all([
    supabase.from('schools').select('*').single(),
    supabase.from('workspaces').select('*'),
    supabase.from('topics').select('*'),
    supabase.from('topic_resources').select('*'),
    supabase.from('week_tracking').select('*'),
    supabase.from('profiles').select('*').eq('role', 'student'),
    supabase.from('student_enrollments').select('*'),
    supabase.from('grades').select('*'),
    supabase.from('attendance_records').select('*'),
    supabase.from('timetable_slots').select('*'),
    supabase.from('change_requests').select('*').eq('status', 'pending'),
    supabase.from('account_requests').select('*').eq('status', 'pending'),
    supabase.from('subject_requests').select('*').eq('status', 'pending'),
    supabase.from('behaviour_records').select('*'),
    supabase.from('v_flagged_students').select('*'),
    supabase.from('v_timetable_conflicts').select('*'),
  ])

  if (schoolRes.error) throw schoolRes.error
  const school = schoolRes.data
  const workspaces = workspacesRes.data ?? []
  const topics = topicsRes.data ?? []
  const resources = resourcesRes.data ?? []
  const tracking = trackingRes.data ?? []

  const studentWorkspaceIds: Record<string, string[]> = {}
  for (const e of enrollmentsRes.data ?? []) {
    if (!studentWorkspaceIds[e.student_id]) studentWorkspaceIds[e.student_id] = []
    studentWorkspaceIds[e.student_id].push(e.workspace_id)
  }

  const syllabusPending = workspaces
    .filter((w) => w.curriculum_status === 'pending')
    .map((w) => ({
      id: w.id,
      workspaceId: w.id,
      submittedAt: w.submitted_at ?? '',
    }))

  const teacherBehindIds = workspaces
    .filter((w) => {
      const rows = tracking.filter((tr) => tr.workspace_id === w.id)
      return rows.some((r) => r.status === 'not_covered' || r.status === 'partial')
    })
    .map((w) => w.teacher_user_id)
    .filter((v, i, a) => a.indexOf(v) === i)

  const attendanceLowStudentIds: string[] = []
  const attByStudent: Record<string, { total: number; present: number }> = {}
  for (const a of attendanceRes.data ?? []) {
    if (!attByStudent[a.student_id]) attByStudent[a.student_id] = { total: 0, present: 0 }
    attByStudent[a.student_id].total++
    if (a.presence === 'present' || a.presence === 'late') attByStudent[a.student_id].present++
  }
  const threshold = school.attendance_threshold_percent
  for (const [sid, stats] of Object.entries(attByStudent)) {
    if (stats.total > 0 && (stats.present / stats.total) * 100 < threshold) {
      attendanceLowStudentIds.push(sid)
    }
  }

  return {
    school: {
      id: school.external_id,
      name: school.name,
      academicYear: school.academic_year,
      gradeThresholdPercent: school.grade_threshold_percent,
      attendanceThresholdPercent: school.attendance_threshold_percent,
      parentResourceAccess: school.parent_resource_access,
      termWeeks: school.term_weeks ?? 6,
    },
    workspaces: workspaces.map((w) => mapWorkspace(w, topics, resources, tracking)),
    students: (studentsRes.data ?? []).map((s) => ({
      id: s.id,
      displayName: s.display_name,
      classLabel: s.class_label ?? '',
    })),
    studentWorkspaceIds,
    grades: (gradesRes.data ?? []).map(
      (g): GradeEntry => ({
        id: g.id,
        workspaceId: g.workspace_id,
        studentId: g.student_id,
        category: g.category,
        assessmentName: g.assessment_name,
        date: g.date,
        value: g.value,
        remarks: g.remarks,
      }),
    ),
    attendance: (attendanceRes.data ?? []).map(
      (a): AttendanceRecord => ({
        id: a.id,
        workspaceId: a.workspace_id,
        studentId: a.student_id,
        date: a.date,
        presence: a.presence,
        reasonCode: a.reason_code ?? undefined,
      }),
    ),
    timetable: (timetableRes.data ?? []).map(
      (t): TimetableSlot => ({
        id: t.id,
        day: t.day,
        start: t.start_time.slice(0, 5),
        end: t.end_time.slice(0, 5),
        subjectName: t.subject_name,
        classLabel: t.class_label,
        teacherName: t.teacher_name,
        room: t.room,
        workspaceId: t.workspace_id ?? undefined,
      }),
    ),
    syllabusPending,
    changeRequests: (changeRes.data ?? []).map((c) => ({
      id: c.id,
      workspaceId: c.workspace_id,
      reason: c.reason,
      requestedAt: c.requested_at,
    })),
    accountRequests: (accountRes.data ?? []).map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      requestedRole: a.requested_role as Role,
      requestedAt: a.requested_at,
    })),
    subjectRequests: (subjectReqRes.data ?? []).map((s) => ({
      id: s.id,
      teacherId: s.teacher_id,
      subjectName: s.subject_name,
      classLabel: s.class_label,
      notes: s.notes,
      requestedAt: s.created_at,
    })),
    behaviourPending: (behaviourRes.data ?? [])
      .filter((b) => b.status === 'pending')
      .map((b) => ({
        id: b.id,
        workspaceId: b.workspace_id,
        studentId: b.student_id,
        date: b.date,
        rating: b.rating,
        remark: b.remark,
        recordedAt: b.created_at,
      })),
    behaviourRecords: (behaviourRes.data ?? []).map((b) => ({
      id: b.id,
      workspaceId: b.workspace_id,
      studentId: b.student_id,
      date: b.date,
      rating: b.rating,
      remark: b.remark,
      status: b.status,
    })),
    flaggedStudents: (flaggedRes.data ?? []).map((f) => ({
      studentId: f.student_id,
      reason: f.reason,
    })),
    teacherBehindIds,
    attendanceLowStudentIds,
    timetableConflicts: (conflictsRes.data ?? []).map((c) => ({
      id: c.slot_id,
      description: c.description,
    })),
    enrolmentGaps: [{ id: 'eg-1', description: 'Year 10B missing homeroom assignment' }],
  }
}

export const fetchSchoolConfig = async () => {
  const { data, error } = await supabase.from('schools').select('*').single()
  if (error) throw error
  return data
}

export const fetchProfiles = async () => {
  const { data, error } = await supabase.from('profiles').select('*').order('display_name')
  if (error) throw error
  return data
}

export const fetchAuditLogs = async (limit = 100) => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export const fetchNotificationLog = async (limit = 50) => {
  const { data, error } = await supabase
    .from('notification_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}
