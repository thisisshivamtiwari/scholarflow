import { Link, useParams } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { studentName, studentsInWorkspace, workspaceById } from '@/lib/tms-helpers'
import { cn } from '@/lib/utils'

export const TeacherAttendance = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { user } = useAuth()
  const { data } = useAppData()
  const ws = workspaceId ? workspaceById(data, workspaceId) : undefined
  const allowed =
    user?.role === 'teacher' &&
    ws &&
    (user.workspaceIds?.includes(ws.id) ?? false)

  if (!ws || !allowed) {
    return <p className="text-sm text-muted-foreground">Workspace not found.</p>
  }

  const sids = studentsInWorkspace(data, ws.id)
  const today = '2026-04-08'
  const rows = sids.map((sid) => {
    const rec = data.attendance.find(
      (a) => a.workspaceId === ws.id && a.studentId === sid && a.date === today,
    )
    return { studentId: sid, rec }
  })

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/app/teacher/workspaces"
        className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        ← Workspaces
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        Attendance · {ws.subjectName}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Mark present / absent / late for this lesson (PRD §9.1). Demo date: {today}.
      </p>

      <ul className="mt-6 space-y-3" role="list">
        {rows.map(({ studentId, rec }) => (
          <li
            key={studentId}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="font-medium text-foreground">
              {studentName(data, studentId)}
            </span>
            <div className="flex flex-wrap gap-2">
              {(['present', 'absent', 'late'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={cn(
                    'rounded-lg border px-3 py-1.5 text-sm font-medium capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    rec?.presence === p
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border hover:bg-muted',
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">
        Buttons are non-persistent UI stubs — wire to AppDataContext in a later iteration.
      </p>
    </div>
  )
}
