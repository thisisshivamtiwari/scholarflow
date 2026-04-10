export type Role = 'teacher' | 'student' | 'parent' | 'headmaster' | 'admin'

export type CurriculumStatus =
  | 'draft'
  | 'pending'
  | 'locked'
  | 'change_requested'
  | 'rejected'

export type WeekDeliveryStatus = 'completed' | 'partial' | 'not_covered'

export type Presence = 'present' | 'absent' | 'late'

export type GradeCategory = 'exam' | 'test' | 'assessment' | 'behaviour' | 'other'

export type PendingTaskType =
  | 'syllabus_approval'
  | 'change_request'
  | 'account_request'
  | 'student_below_threshold'
  | 'teacher_behind'
  | 'attendance_low'
  | 'timetable_conflict'
  | 'incomplete_enrolment'

export type AuthUser = {
  id: string
  schoolId: string
  username: string
  displayName: string
  email: string
  role: Role
  /** Teacher: workspace ids */
  workspaceIds?: string[]
  studentId?: string
  parentChildIds?: string[]
}

export type SchoolConfig = {
  id: string
  name: string
  academicYear: string
  gradeThresholdPercent: number
  attendanceThresholdPercent: number
  parentResourceAccess: boolean
}

export type ResourceItem = {
  id: string
  kind: 'video' | 'paper'
  title: string
  url: string
  visibleToStudents: boolean
}

export type Topic = {
  id: string
  heading: string
  subHeading: string
  description: string
  targetWeeks: number[]
  resources: ResourceItem[]
}

export type WeekTracking = {
  weekIndex: number
  status: WeekDeliveryStatus
  remarks: string
}

export type Workspace = {
  id: string
  subjectName: string
  classLabel: string
  teacherUserId: string
  curriculumStatus: CurriculumStatus
  submittedAt?: string
  topics: Topic[]
  tracking: WeekTracking[]
}

export type StudentRecord = {
  id: string
  displayName: string
  classLabel: string
}

export type GradeEntry = {
  id: string
  workspaceId: string
  studentId: string
  category: GradeCategory
  assessmentName: string
  date: string
  value: string
  remarks: string
}

export type AttendanceRecord = {
  id: string
  workspaceId: string
  studentId: string
  date: string
  presence: Presence
  reasonCode?: string
}

export type TimetableSlot = {
  id: string
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
  start: string
  end: string
  subjectName: string
  classLabel: string
  teacherName: string
  room: string
  workspaceId?: string
}

export type SyllabusPending = {
  id: string
  workspaceId: string
  submittedAt: string
}

export type ChangeRequestPending = {
  id: string
  workspaceId: string
  reason: string
  requestedAt: string
}

export type AccountRequestPending = {
  id: string
  name: string
  email: string
  requestedRole: Role
  requestedAt: string
}

export type FlaggedStudent = {
  studentId: string
  reason: string
}

export type TimetableConflict = {
  id: string
  description: string
}

export type EnrolmentGap = {
  id: string
  description: string
}

export type AppDataState = {
  school: SchoolConfig
  workspaces: Workspace[]
  students: StudentRecord[]
  /** studentId -> workspaceIds */
  studentWorkspaceIds: Record<string, string[]>
  grades: GradeEntry[]
  attendance: AttendanceRecord[]
  timetable: TimetableSlot[]
  syllabusPending: SyllabusPending[]
  changeRequests: ChangeRequestPending[]
  accountRequests: AccountRequestPending[]
  flaggedStudents: FlaggedStudent[]
  teacherBehindIds: string[]
  attendanceLowStudentIds: string[]
  timetableConflicts: TimetableConflict[]
  enrolmentGaps: EnrolmentGap[]
}
