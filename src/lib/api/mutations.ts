import { supabase, invokeFunction } from '@/lib/supabase'
import { throwIfMutationError } from '@/lib/api/errors'
import type { GradeCategory, Role } from '@/types/tms'

export const governanceApi = {
  approveSyllabus: async (workspaceId: string) => {
    throwIfMutationError(await supabase.rpc('approve_syllabus', { p_workspace_id: workspaceId }))
  },
  rejectSyllabus: async (workspaceId: string) => {
    throwIfMutationError(await supabase.rpc('reject_syllabus', { p_workspace_id: workspaceId }))
  },
  submitCurriculum: async (workspaceId: string) => {
    throwIfMutationError(
      await supabase.rpc('submit_curriculum_for_approval', { p_workspace_id: workspaceId }),
    )
  },
  approveChangeRequest: async (requestId: string) => {
    throwIfMutationError(
      await supabase.rpc('approve_change_request', { p_request_id: requestId }),
    )
  },
  rejectChangeRequest: async (requestId: string) => {
    throwIfMutationError(
      await supabase.rpc('reject_change_request', { p_request_id: requestId }),
    )
  },

  approveAccountRequest: (requestId: string) =>
    invokeFunction<{ ok: boolean }>('approve-account-request', {
      requestId,
      action: 'approve',
    }),

  rejectAccountRequest: (requestId: string) =>
    invokeFunction<{ ok: boolean }>('approve-account-request', {
      requestId,
      action: 'reject',
    }),
}

export const workspaceApi = {
  updateStatus: async (workspaceId: string, status: string) => {
    throwIfMutationError(
      await supabase.from('workspaces').update({ curriculum_status: status }).eq('id', workspaceId),
    )
  },

  createChangeRequest: async (workspaceId: string, reason: string, requestedBy: string) => {
    throwIfMutationError(
      await supabase.from('change_requests').insert({
        workspace_id: workspaceId,
        reason,
        requested_by: requestedBy,
      }),
    )
  },

  addTopic: async (
    workspaceId: string,
    heading: string,
    subHeading: string,
    targetWeeks: number[],
  ) => {
    throwIfMutationError(
      await supabase.from('topics').insert({
        workspace_id: workspaceId,
        heading,
        sub_heading: subHeading,
        target_weeks: targetWeeks,
        sort_order: 999,
      }),
    )
  },

  updateTopic: async (
    topicId: string,
    patch: Partial<{
      heading: string
      sub_heading: string
      description: string
      target_weeks: number[]
      sort_order: number
    }>,
  ) => {
    throwIfMutationError(await supabase.from('topics').update(patch).eq('id', topicId))
  },

  deleteTopic: async (topicId: string) => {
    throwIfMutationError(await supabase.from('topics').delete().eq('id', topicId))
  },

  reorderTopics: async (orderedIds: string[]) => {
    for (let i = 0; i < orderedIds.length; i++) {
      throwIfMutationError(
        await supabase.from('topics').update({ sort_order: i }).eq('id', orderedIds[i]),
      )
    }
  },

  upsertTracking: async (
    workspaceId: string,
    weekIndex: number,
    status: string,
    remarks: string,
  ) => {
    throwIfMutationError(
      await supabase.from('week_tracking').upsert(
        { workspace_id: workspaceId, week_index: weekIndex, status, remarks },
        { onConflict: 'workspace_id,week_index' },
      ),
    )
  },
}

export const resourceApi = {
  add: async (
    topicId: string,
    kind: 'video' | 'paper',
    title: string,
    url: string,
    visible: boolean,
  ) => {
    throwIfMutationError(
      await supabase.from('topic_resources').insert({
        topic_id: topicId,
        kind,
        title,
        url,
        visible_to_students: visible,
      }),
    )
  },

  update: async (
    id: string,
    patch: Partial<{ title: string; url: string; visible_to_students: boolean }>,
  ) => {
    throwIfMutationError(await supabase.from('topic_resources').update(patch).eq('id', id))
  },

  remove: async (id: string) => {
    throwIfMutationError(await supabase.from('topic_resources').delete().eq('id', id))
  },

  uploadPaper: async (
    schoolUuid: string,
    topicId: string,
    file: File,
    title: string,
    visible: boolean,
  ) => {
    const path = `${schoolUuid}/${topicId}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('question-papers').upload(path, file)
    if (upErr) throw upErr
    const { data: urlData } = supabase.storage.from('question-papers').getPublicUrl(path)
    throwIfMutationError(
      await supabase.from('topic_resources').insert({
        topic_id: topicId,
        kind: 'paper',
        title,
        url: urlData.publicUrl,
        storage_path: path,
        visible_to_students: visible,
      }),
    )
  },
}

export const gradesApi = {
  add: async (entry: {
    workspaceId: string
    studentId: string
    category: GradeCategory
    assessmentName: string
    date: string
    value: string
    remarks?: string
  }) => {
    throwIfMutationError(
      await supabase.from('grades').insert({
        workspace_id: entry.workspaceId,
        student_id: entry.studentId,
        category: entry.category,
        assessment_name: entry.assessmentName,
        date: entry.date,
        value: entry.value,
        remarks: entry.remarks ?? '',
      }),
    )
  },

  importCsv: (workspaceId: string, csvText: string) =>
    invokeFunction<{ inserted: number }>('import-grades-csv', { workspaceId, csvText }),
}

export const attendanceApi = {
  upsert: async (
    workspaceId: string,
    studentId: string,
    date: string,
    presence: string,
    reasonCode?: string,
  ) => {
    throwIfMutationError(
      await supabase.from('attendance_records').upsert(
        {
          workspace_id: workspaceId,
          student_id: studentId,
          date,
          presence,
          reason_code: reasonCode ?? null,
        },
        { onConflict: 'workspace_id,student_id,date' },
      ),
    )
  },
}

export const timetableApi = {
  list: () => supabase.from('timetable_slots').select('*').order('day').order('start_time'),

  create: async (slot: {
    schoolId: string
    day: string
    startTime: string
    endTime: string
    subjectName: string
    classLabel: string
    teacherUserId?: string
    teacherName: string
    room: string
    workspaceId?: string
  }) => {
    throwIfMutationError(
      await supabase.from('timetable_slots').insert({
        school_id: slot.schoolId,
        day: slot.day,
        start_time: slot.startTime,
        end_time: slot.endTime,
        subject_name: slot.subjectName,
        class_label: slot.classLabel,
        teacher_user_id: slot.teacherUserId ?? null,
        teacher_name: slot.teacherName,
        room: slot.room,
        workspace_id: slot.workspaceId ?? null,
      }),
    )
  },

  update: async (id: string, patch: Record<string, unknown>) => {
    throwIfMutationError(await supabase.from('timetable_slots').update(patch).eq('id', id))
  },

  remove: async (id: string) => {
    throwIfMutationError(await supabase.from('timetable_slots').delete().eq('id', id))
  },
}

export const configApi = {
  updateSchool: async (patch: Record<string, unknown>) => {
    throwIfMutationError(
      await supabase.from('schools').update(patch).eq('id', patch.id as string),
    )
  },

  updateSchoolByExternalId: async (externalId: string, patch: Record<string, unknown>) => {
    const { data: school } = await supabase
      .from('schools')
      .select('id')
      .eq('external_id', externalId)
      .single()
    if (!school) throw new Error('School not found')
    return supabase.from('schools').update(patch).eq('id', school.id)
  },

  yearGroups: () => supabase.from('year_groups').select('*').order('sort_order'),
  addYearGroup: (schoolId: string, label: string) =>
    supabase.from('year_groups').insert({ school_id: schoolId, label }),
  removeYearGroup: (id: string) => supabase.from('year_groups').delete().eq('id', id),

  subjects: () => supabase.from('school_subjects').select('*'),
  addSubject: (schoolId: string, name: string, code: string) =>
    supabase.from('school_subjects').insert({ school_id: schoolId, name, code }),
  removeSubject: (id: string) => supabase.from('school_subjects').delete().eq('id', id),

  gradingSchemes: () => supabase.from('grading_schemes').select('*'),

  reasonCodes: () => supabase.from('attendance_reason_codes').select('*').order('code'),
  addReasonCode: async (schoolId: string, code: string, label: string) => {
    throwIfMutationError(
      await supabase.from('attendance_reason_codes').insert({ school_id: schoolId, code, label }),
    )
  },
  removeReasonCode: async (id: string) => {
    throwIfMutationError(await supabase.from('attendance_reason_codes').delete().eq('id', id))
  },

  updateAttendanceLock: async (schoolId: string, hours: number) => {
    throwIfMutationError(
      await supabase.from('schools').update({ attendance_lock_hours: hours }).eq('id', schoolId),
    )
  },
}

export const accountRequestApi = {
  submit: async (payload: {
    schoolExternalId: string
    name: string
    email: string
    requestedRole: Role
    notes?: string
  }) => {
    const { data: school } = await supabase
      .from('schools')
      .select('id')
      .eq('external_id', payload.schoolExternalId.toUpperCase())
      .maybeSingle()

    throwIfMutationError(
      await supabase.from('account_requests').insert({
        school_id: school?.id ?? null,
        school_external_id: payload.schoolExternalId.toUpperCase(),
        name: payload.name,
        email: payload.email,
        requested_role: payload.requestedRole,
        notes: payload.notes ?? '',
      }),
    )
  },
}

export const usersApi = {
  list: () => supabase.from('profiles').select('*').order('display_name'),

  adminAction: (action: string, payload: Record<string, unknown>) =>
    invokeFunction('admin-users', { action, ...payload }),

  create: (payload: Record<string, unknown>) =>
    invokeFunction('admin-users', { action: 'create', ...payload }),

  deactivate: (userId: string) =>
    invokeFunction('admin-users', { action: 'deactivate', userId }),

  reactivate: (userId: string) =>
    invokeFunction('admin-users', { action: 'reactivate', userId }),

  resetPassword: (userId: string) =>
    invokeFunction('admin-users', { action: 'resetPassword', userId }),

  updateRole: (userId: string, role: Role) =>
    invokeFunction('admin-users', { action: 'updateRole', userId, role }),

  linkParentChild: async (parentId: string, studentId: string) => {
    throwIfMutationError(
      await supabase.from('parent_children').insert({ parent_id: parentId, student_id: studentId }),
    )
  },

  importStudentsCsv: (csvText: string) =>
    invokeFunction('admin-users', { action: 'importStudents', csvText }),
}

export const notificationApi = {
  sendStub: (type: string, recipientEmail: string, payload: Record<string, unknown>) =>
    invokeFunction('send-notification', { type, recipientEmail, payload }),
}
