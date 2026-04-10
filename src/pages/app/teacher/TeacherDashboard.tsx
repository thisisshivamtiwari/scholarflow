import { AlertTriangle, LineChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import {
  studentName,
  studentsInWorkspace,
  workspaceForTeacher,
} from '@/lib/tms-helpers'

export const TeacherDashboard = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const workspaces = user ? workspaceForTeacher(data, user) : []

  const ws = workspaces[0]
  const studentIds = ws ? studentsInWorkspace(data, ws.id) : []
  const gradesInWs = ws
    ? data.grades.filter((g) => g.workspaceId === ws.id)
    : []
  const avg =
    gradesInWs.length > 0
      ? Math.round(
          gradesInWs.reduce((acc, g) => {
            const n = parseInt(g.value, 10)
            return acc + (Number.isNaN(n) ? 0 : n)
          }, 0) / gradesInWs.length,
        )
      : null

  const flagged = data.flaggedStudents.filter((f) =>
    studentIds.includes(f.studentId),
  )

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Filters (class, subject, date range) — demo uses your first workspace.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <LineChart className="size-4" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Class average
            </span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {avg !== null ? `${avg}%` : '—'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {ws ? `${ws.subjectName} · ${ws.classLabel}` : 'No workspace'}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Grade distribution
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chart placeholder — {gradesInWs.length} entries in sample data.
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertTriangle className="size-4" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wide">
              Below threshold
            </span>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {flagged.length === 0 ? (
              <li className="text-muted-foreground">None in this class.</li>
            ) : (
              flagged.map((f) => (
                <li key={f.studentId}>
                  <span className="font-medium text-foreground">
                    {studentName(data, f.studentId)}
                  </span>
                  <span className="text-muted-foreground"> — {f.reason}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {workspaces.map((w) => (
          <Link
            key={w.id}
            to={`/app/teacher/workspaces/${w.id}/curriculum`}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Open {w.subjectName} curriculum
          </Link>
        ))}
      </div>
    </div>
  )
}
