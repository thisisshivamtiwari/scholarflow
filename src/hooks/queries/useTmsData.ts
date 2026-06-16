import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { fetchAppDataState, fetchAuditLogs, fetchSchoolConfig } from '@/lib/api/transform'
import {
  governanceApi,
  workspaceApi,
  resourceApi,
  gradesApi,
  attendanceApi,
  timetableApi,
  configApi,
  usersApi,
  accountRequestApi,
} from '@/lib/api/mutations'
import type { GradeCategory, Role } from '@/types/tms'

export const TMS_QUERY_KEY = ['tms', 'appData'] as const
export const SCHOOL_KEY = ['tms', 'school'] as const
export const PROFILES_KEY = ['tms', 'profiles'] as const
export const AUDIT_KEY = ['tms', 'audit'] as const
export const TIMETABLE_KEY = ['tms', 'timetable'] as const

export const useAppData = () => {
  const { user } = useAuth()
  const isSuperadmin = user?.role === 'superadmin'
  const query = useQuery({
    queryKey: TMS_QUERY_KEY,
    queryFn: fetchAppDataState,
    enabled: !isSuperadmin,
  })
  const qc = useQueryClient()

  const invalidate = () => qc.invalidateQueries({ queryKey: TMS_QUERY_KEY })

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    invalidate,
    approveSyllabus: useMutation({
      mutationFn: (workspaceId: string) => governanceApi.approveSyllabus(workspaceId),
      onSuccess: invalidate,
    }),
    rejectSyllabus: useMutation({
      mutationFn: (workspaceId: string) => governanceApi.rejectSyllabus(workspaceId),
      onSuccess: invalidate,
    }),
    approveChangeRequest: useMutation({
      mutationFn: (requestId: string) => governanceApi.approveChangeRequest(requestId),
      onSuccess: invalidate,
    }),
    rejectChangeRequest: useMutation({
      mutationFn: (requestId: string) => governanceApi.rejectChangeRequest(requestId),
      onSuccess: invalidate,
    }),
    approveAccountRequest: useMutation({
      mutationFn: (requestId: string) => governanceApi.approveAccountRequest(requestId),
      onSuccess: invalidate,
    }),
    rejectAccountRequest: useMutation({
      mutationFn: (requestId: string) => governanceApi.rejectAccountRequest(requestId),
      onSuccess: invalidate,
    }),
    submitCurriculumForApproval: useMutation({
      mutationFn: (workspaceId: string) => governanceApi.submitCurriculum(workspaceId),
      onSuccess: invalidate,
    }),
    setWorkspaceStatus: useMutation({
      mutationFn: ({ workspaceId, status }: { workspaceId: string; status: string }) =>
        workspaceApi.updateStatus(workspaceId, status),
      onSuccess: invalidate,
    }),
    addTopic: useMutation({
      mutationFn: (p: {
        workspaceId: string
        heading: string
        subHeading: string
        targetWeeks: number[]
      }) => workspaceApi.addTopic(p.workspaceId, p.heading, p.subHeading, p.targetWeeks),
      onSuccess: invalidate,
    }),
    deleteTopic: useMutation({
      mutationFn: (topicId: string) => workspaceApi.deleteTopic(topicId),
      onSuccess: invalidate,
    }),
    reorderTopics: useMutation({
      mutationFn: (orderedIds: string[]) => workspaceApi.reorderTopics(orderedIds),
      onSuccess: invalidate,
    }),
    upsertTracking: useMutation({
      mutationFn: (p: {
        workspaceId: string
        weekIndex: number
        status: string
        remarks: string
      }) => workspaceApi.upsertTracking(p.workspaceId, p.weekIndex, p.status, p.remarks),
      onSuccess: invalidate,
    }),
    addResource: useMutation({
      mutationFn: (p: {
        topicId: string
        kind: 'video' | 'paper'
        title: string
        url: string
        visible: boolean
      }) => resourceApi.add(p.topicId, p.kind, p.title, p.url, p.visible),
      onSuccess: invalidate,
    }),
    toggleResourceVisibility: useMutation({
      mutationFn: (p: { id: string; visible: boolean }) =>
        resourceApi.update(p.id, { visible_to_students: p.visible }),
      onSuccess: invalidate,
    }),
    removeResource: useMutation({
      mutationFn: (id: string) => resourceApi.remove(id),
      onSuccess: invalidate,
    }),
    uploadPaper: useMutation({
      mutationFn: (p: {
        schoolUuid: string
        topicId: string
        file: File
        title: string
        visible: boolean
      }) => resourceApi.uploadPaper(p.schoolUuid, p.topicId, p.file, p.title, p.visible),
      onSuccess: invalidate,
    }),
    addGrade: useMutation({
      mutationFn: (p: {
        workspaceId: string
        studentId: string
        category: GradeCategory
        assessmentName: string
        date: string
        value: string
        remarks?: string
      }) => gradesApi.add(p),
      onSuccess: invalidate,
    }),
    importGradesCsv: useMutation({
      mutationFn: (p: { workspaceId: string; csvText: string }) =>
        gradesApi.importCsv(p.workspaceId, p.csvText),
      onSuccess: invalidate,
    }),
    upsertAttendance: useMutation({
      mutationFn: (p: {
        workspaceId: string
        studentId: string
        date: string
        presence: string
        reasonCode?: string
      }) =>
        attendanceApi.upsert(
          p.workspaceId,
          p.studentId,
          p.date,
          p.presence,
          p.reasonCode,
        ),
      onSuccess: invalidate,
    }),
    createChangeRequest: useMutation({
      mutationFn: (p: { workspaceId: string; reason: string; requestedBy: string }) =>
        workspaceApi.createChangeRequest(p.workspaceId, p.reason, p.requestedBy),
      onSuccess: invalidate,
    }),
  }
}

export const useSchoolConfig = () =>
  useQuery({ queryKey: SCHOOL_KEY, queryFn: fetchSchoolConfig })

export const useProfiles = () =>
  useQuery({ queryKey: PROFILES_KEY, queryFn: async () => {
    const { data, error } = await usersApi.list()
    if (error) throw error
    return data
  }})

export const useAuditLogs = () =>
  useQuery({ queryKey: AUDIT_KEY, queryFn: () => fetchAuditLogs() })

export const useTimetableSlots = () =>
  useQuery({
    queryKey: TIMETABLE_KEY,
    queryFn: async () => {
      const { data, error } = await timetableApi.list()
      if (error) throw error
      return data
    },
  })

export const useConfigMutations = () => {
  const qc = useQueryClient()
  const inv = () => {
    qc.invalidateQueries({ queryKey: SCHOOL_KEY })
    qc.invalidateQueries({ queryKey: TMS_QUERY_KEY })
  }
  return {
    updateSchool: useMutation({
      mutationFn: (patch: Record<string, unknown>) =>
        configApi.updateSchool(patch),
      onSuccess: inv,
    }),
    addReasonCode: useMutation({
      mutationFn: (p: { schoolId: string; code: string; label: string }) =>
        configApi.addReasonCode(p.schoolId, p.code, p.label),
      onSuccess: inv,
    }),
    removeReasonCode: useMutation({
      mutationFn: (id: string) => configApi.removeReasonCode(id),
      onSuccess: inv,
    }),
    updateAttendanceLock: useMutation({
      mutationFn: (p: { schoolId: string; hours: number }) =>
        configApi.updateAttendanceLock(p.schoolId, p.hours),
      onSuccess: inv,
    }),
  }
}

export const useTimetableMutations = () => {
  const qc = useQueryClient()
  const inv = () => {
    qc.invalidateQueries({ queryKey: TIMETABLE_KEY })
    qc.invalidateQueries({ queryKey: TMS_QUERY_KEY })
  }
  return {
    create: useMutation({
      mutationFn: timetableApi.create,
      onSuccess: inv,
    }),
    update: useMutation({
      mutationFn: (p: { id: string; patch: Record<string, unknown> }) =>
        timetableApi.update(p.id, p.patch),
      onSuccess: inv,
    }),
    remove: useMutation({
      mutationFn: (id: string) => timetableApi.remove(id),
      onSuccess: inv,
    }),
  }
}

export const useAccountRequestSubmit = () =>
  useMutation({ mutationFn: accountRequestApi.submit })

export const useUserAdminMutations = () => {
  const qc = useQueryClient()
  const inv = () => qc.invalidateQueries({ queryKey: PROFILES_KEY })
  return {
    create: useMutation({ mutationFn: usersApi.create, onSuccess: inv }),
    deactivate: useMutation({ mutationFn: usersApi.deactivate, onSuccess: inv }),
    reactivate: useMutation({ mutationFn: usersApi.reactivate, onSuccess: inv }),
    resetPassword: useMutation({ mutationFn: usersApi.resetPassword, onSuccess: inv }),
    updateRole: useMutation({
      mutationFn: (p: { userId: string; role: Role }) =>
        usersApi.updateRole(p.userId, p.role),
      onSuccess: inv,
    }),
    importStudents: useMutation({ mutationFn: usersApi.importStudentsCsv, onSuccess: inv }),
  }
}
