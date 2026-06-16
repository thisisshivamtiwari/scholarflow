import type { AppDataState } from '@/types/tms'
import { studentName, workspaceById } from '@/lib/tms-helpers'

export const gradeAveragePercent = (grades: { value: string }[]): number | null => {
  if (grades.length === 0) return null
  const nums = grades
    .map((g) => parseInt(g.value, 10))
    .filter((n) => !Number.isNaN(n))
  if (nums.length === 0) return null
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length)
}

export const attendancePercent = (
  records: { presence: string }[],
): number | null => {
  if (records.length === 0) return null
  const present = records.filter((a) => a.presence === 'present' || a.presence === 'late')
  return Math.round((present.length / records.length) * 100)
}

export const curriculumProgressPercent = (
  data: AppDataState,
  workspaceIds: string[],
): number | null => {
  let total = 0
  let covered = 0
  for (const wid of workspaceIds) {
    const ws = workspaceById(data, wid)
    if (!ws || ws.curriculumStatus !== 'locked') continue
    for (const t of ws.topics) {
      total++
      const done = ws.tracking.some(
        (tr) => t.targetWeeks.includes(tr.weekIndex) && tr.status === 'completed',
      )
      if (done) covered++
    }
  }
  if (total === 0) return null
  return Math.round((covered / total) * 100)
}

export const studentDisplayName = (data: AppDataState, studentId: string) =>
  studentName(data, studentId)
