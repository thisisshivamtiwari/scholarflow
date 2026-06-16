import { AppDataLoading } from '@/components/app/AppDataLoading'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAppData } from '@/context/AppDataContext'
import { useParentChild } from '@/hooks/useParentChild'
import {
  attendancePercent,
  curriculumProgressPercent,
  studentDisplayName,
} from '@/lib/dashboard-stats'
import { workspaceById } from '@/lib/tms-helpers'
import { AlertTriangle, BookOpen, LineChart } from 'lucide-react'

export const ParentDashboard = () => {
  const { childId, childIds, setChildId } = useParentChild()
  const { data } = useAppData()

  if (!childId) {
    return (
      <p className="text-sm text-muted-foreground">No linked children on this account.</p>
    )
  }

  const name = studentDisplayName(data, childId)
  const wids = data.studentWorkspaceIds[childId] ?? []
  const grades = data.grades.filter((g) => g.studentId === childId)
  const att = data.attendance.filter((a) => a.studentId === childId)
  const attPct = attendancePercent(att)
  const curPct = curriculumProgressPercent(data, wids)

  const alerts: string[] = []
  if (data.flaggedStudents.some((f) => f.studentId === childId)) {
    alerts.push('Performance below threshold in one or more subjects')
  }
  if (data.attendanceLowStudentIds.includes(childId)) {
    alerts.push('Attendance below school threshold')
  }

  return (
    <AppDataLoading>
      <DashboardShell
        title="Parent dashboard"
        subtitle={`Monitoring ${name}`}
        actions={
          childIds.length > 1 ? (
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-muted-foreground">Child</span>
              <select
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm shadow-sm"
              >
                {childIds.map((id) => (
                  <option key={id} value={id}>
                    {studentDisplayName(data, id)}
                  </option>
                ))}
              </select>
            </label>
          ) : null
        }
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Attendance"
            value={attPct !== null ? `${attPct}%` : '—'}
            icon={LineChart}
            to="/app/parent/attendance"
            linkLabel="View attendance"
          />
          <StatCard
            label="Curriculum progress"
            value={curPct !== null ? `${curPct}%` : '—'}
            icon={BookOpen}
            to="/app/parent/curriculum"
            linkLabel="View curriculum"
          />
          <StatCard
            label="Recent grades"
            value={grades.length}
            hint={
              grades[0]
                ? `${workspaceById(data, grades[0].workspaceId)?.subjectName}: ${grades[0].value}`
                : 'No grades yet'
            }
            to="/app/parent/performance"
            linkLabel="Academic report"
          />
        </div>

        {alerts.length > 0 ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
              <AlertTriangle className="size-4" aria-hidden />
              <p className="text-sm font-semibold">Alerts for {name}</p>
            </div>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              {alerts.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </DashboardShell>
    </AppDataLoading>
  )
}
