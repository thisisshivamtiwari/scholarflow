import { useAppData } from '@/context/AppDataContext'
import { useParentChild } from '@/hooks/useParentChild'
import { studentName, workspaceById } from '@/lib/tms-helpers'

export const ParentOverview = () => {
  const { childId, childIds, setChildId } = useParentChild()
  const { data } = useAppData()

  if (!childId) {
    return <p className="text-sm text-muted-foreground">No linked children.</p>
  }

  const name = studentName(data, childId)
  const wids = data.studentWorkspaceIds[childId] ?? []
  const grades = data.grades.filter((g) => g.studentId === childId)
  const att = data.attendance.filter((a) => a.studentId === childId)
  const present = att.filter((a) => a.presence === 'present' || a.presence === 'late')
  const attPct =
    att.length > 0 ? Math.round((present.length / att.length) * 100) : null

  let topicTotal = 0
  let topicCovered = 0
  for (const wid of wids) {
    const ws = workspaceById(data, wid)
    if (!ws || ws.curriculumStatus !== 'locked') continue
    for (const t of ws.topics) {
      topicTotal++
      const done = ws.tracking.some(
        (tr) =>
          t.targetWeeks.includes(tr.weekIndex) && tr.status === 'completed',
      )
      if (done) topicCovered++
    }
  }
  const curPct =
    topicTotal > 0 ? Math.round((topicCovered / topicTotal) * 100) : null

  const alerts: string[] = []
  if (data.flaggedStudents.some((f) => f.studentId === childId)) {
    alerts.push('Performance below threshold in one or more subjects')
  }
  if (data.attendanceLowStudentIds.includes(childId)) {
    alerts.push('Attendance below school threshold')
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Child overview</h1>
        {childIds.length > 1 ? (
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Switch child</span>
            <select
              value={childId}
              onChange={(e) => setChildId(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2"
            >
              {childIds.map((id) => (
                <option key={id} value={id}>
                  {studentName(data, id)}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      <p className="mt-2 text-lg font-medium text-foreground">{name}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Attendance
          </p>
          <p className="mt-1 text-2xl font-semibold">
            {attPct !== null ? `${attPct}%` : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Curriculum progress
          </p>
          <p className="mt-1 text-2xl font-semibold">
            {curPct !== null ? `${curPct}%` : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Recent grades
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {grades.slice(0, 2).map((g) => {
              const ws = workspaceById(data, g.workspaceId)
              return (
                <span key={g.id} className="block">
                  {ws?.subjectName}: {g.value}
                </span>
              )
            })}
          </p>
        </div>
      </div>

      {alerts.length > 0 ? (
        <div className="mt-8 rounded-xl border border-amber-500/40 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
            Alerts
          </p>
          <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
            {alerts.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
