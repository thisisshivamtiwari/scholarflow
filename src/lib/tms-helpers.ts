import type { AppDataState, AuthUser, TimetableSlot, Workspace } from '@/types/tms'

export const workspaceForTeacher = (
  data: AppDataState,
  user: AuthUser,
): Workspace[] => {
  const ids = user.workspaceIds ?? []
  return data.workspaces.filter((w) => ids.includes(w.id))
}

export const workspaceById = (
  data: AppDataState,
  id: string,
): Workspace | undefined => data.workspaces.find((w) => w.id === id)

export const studentsInWorkspace = (
  data: AppDataState,
  workspaceId: string,
): string[] => {
  const ids: string[] = []
  for (const [sid, wids] of Object.entries(data.studentWorkspaceIds)) {
    if (wids.includes(workspaceId)) ids.push(sid)
  }
  return ids
}

export const studentName = (data: AppDataState, studentId: string): string =>
  data.students.find((s) => s.id === studentId)?.displayName ?? studentId

export const timetableForStudent = (
  data: AppDataState,
  studentId: string,
): TimetableSlot[] => {
  const st = data.students.find((s) => s.id === studentId)
  if (!st) return []
  return data.timetable.filter((t) => t.classLabel === st.classLabel)
}

export const timetableForTeacher = (
  data: AppDataState,
  workspaceIds: string[],
): TimetableSlot[] =>
  data.timetable.filter(
    (t) => t.workspaceId != null && workspaceIds.includes(t.workspaceId),
  )

export const topicProgressLabel = (
  ws: Workspace,
  topicIndex: number,
): 'Covered' | 'In progress' | 'Upcoming' => {
  const topic = ws.topics[topicIndex]
  if (!topic) return 'Upcoming'
  const maxWeek = Math.max(...topic.targetWeeks)
  const track = ws.tracking.find((x) => x.weekIndex === maxWeek)
  const anyCompleted = ws.tracking.some(
    (x) => topic.targetWeeks.includes(x.weekIndex) && x.status === 'completed',
  )
  if (anyCompleted) return 'Covered'
  if (track?.status === 'partial') return 'In progress'
  return 'Upcoming'
}
