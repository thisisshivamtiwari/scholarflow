import { AlertTriangle, BookOpen, CalendarDays, LineChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { gradeAveragePercent } from '@/lib/dashboard-stats'
import {
  studentName,
  studentsInWorkspace,
  timetableForTeacher,
  workspaceForTeacher,
} from '@/lib/tms-helpers'
import { exportGradesPdf } from '@/lib/export-reports'

export const TeacherDashboard = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const workspaces = user ? workspaceForTeacher(data, user) : []
  const workspaceIds = workspaces.map((w) => w.id)
  const allGrades = data.grades.filter((g) => workspaceIds.includes(g.workspaceId))
  const avg = gradeAveragePercent(allGrades)
  const totalStudents = new Set(
    workspaceIds.flatMap((wid) => studentsInWorkspace(data, wid)),
  ).size
  const timetable = timetableForTeacher(data, workspaceIds)
  const flagged = data.flaggedStudents.filter((f) =>
    workspaceIds.some((wid) => studentsInWorkspace(data, wid).includes(f.studentId)),
  )

  return (
    <AppDataLoading>
      <DashboardShell
        title={`Welcome, ${user?.displayName ?? 'Teacher'}`}
        subtitle={`${workspaces.length} workspace${workspaces.length === 1 ? '' : 's'} · ${data.school.academicYear}`}
        actions={
          allGrades.length > 0 ? (
            <button
              type="button"
              onClick={() =>
                exportGradesPdf(
                  'All grades export',
                  allGrades.map((g) => [
                    studentName(data, g.studentId),
                    g.assessmentName,
                    g.date,
                    g.value,
                  ]),
                  ['Student', 'Assessment', 'Date', 'Grade'],
                )
              }
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium shadow-sm hover:bg-muted"
            >
              Export all grades PDF
            </button>
          ) : null
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Class average" value={avg !== null ? `${avg}%` : '—'} icon={LineChart} />
          <StatCard label="Students taught" value={totalStudents} icon={BookOpen} />
          <StatCard label="Grade entries" value={allGrades.length} icon={LineChart} />
          <StatCard
            label="Timetable slots"
            value={timetable.length}
            icon={CalendarDays}
            to="/app/teacher/timetable"
            linkLabel="View timetable"
          />
        </div>

        {flagged.length > 0 ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-100">
              <AlertTriangle className="size-4" aria-hidden />
              <p className="text-sm font-semibold">Students below threshold</p>
            </div>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {flagged.map((f) => (
                <li key={f.studentId}>
                  {studentName(data, f.studentId)} — {f.reason}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Your workspaces</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {workspaces.map((w) => {
              const wsGrades = data.grades.filter((g) => g.workspaceId === w.id)
              const wsAvg = gradeAveragePercent(wsGrades)
              return (
                <div
                  key={w.id}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <p className="font-medium text-foreground">
                    {w.subjectName} · {w.classLabel}
                  </p>
                  <p className="mt-1 text-xs capitalize text-muted-foreground">
                    {w.curriculumStatus.replace('_', ' ')} · avg {wsAvg !== null ? `${wsAvg}%` : '—'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      to={`/app/teacher/workspaces/${w.id}/curriculum`}
                      className="rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/15"
                    >
                      Curriculum
                    </Link>
                    <Link
                      to={`/app/teacher/workspaces/${w.id}/grades`}
                      className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted"
                    >
                      Grades
                    </Link>
                    <Link
                      to={`/app/teacher/workspaces/${w.id}/attendance`}
                      className="rounded-md border border-border px-2.5 py-1 text-xs font-medium hover:bg-muted"
                    >
                      Attendance
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </DashboardShell>
    </AppDataLoading>
  )
}
