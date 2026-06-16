import { BookOpen, CalendarDays, ClipboardCheck, LineChart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import {
  attendancePercent,
  curriculumProgressPercent,
  gradeAveragePercent,
} from '@/lib/dashboard-stats'
import { timetableForStudent, workspaceById } from '@/lib/tms-helpers'

export const StudentDashboard = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const studentId = user?.studentId ?? ''
  const workspaceIds = data.studentWorkspaceIds[studentId] ?? []
  const grades = data.grades.filter((g) => g.studentId === studentId)
  const attendance = data.attendance.filter((a) => a.studentId === studentId)
  const timetable = timetableForStudent(data, studentId)
  const avg = gradeAveragePercent(grades)
  const attPct = attendancePercent(attendance)
  const curPct = curriculumProgressPercent(data, workspaceIds)

  return (
    <AppDataLoading>
      <DashboardShell
        title={`Welcome, ${user?.displayName ?? 'Student'}`}
        subtitle={`${data.school.name} · ${data.school.academicYear}`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Grade average" value={avg !== null ? `${avg}%` : '—'} icon={LineChart} />
          <StatCard
            label="Attendance"
            value={attPct !== null ? `${attPct}%` : '—'}
            icon={ClipboardCheck}
            to="/app/student/attendance"
            linkLabel="View attendance"
          />
          <StatCard
            label="Curriculum progress"
            value={curPct !== null ? `${curPct}%` : '—'}
            icon={BookOpen}
            to="/app/student/subjects"
            linkLabel="My subjects"
          />
          <StatCard
            label="Weekly slots"
            value={timetable.length}
            hint="On your class timetable"
            icon={CalendarDays}
            to="/app/student/timetable"
            linkLabel="Open timetable"
          />
        </div>

        <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-foreground">Your subjects</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2" role="list">
            {workspaceIds.length === 0 ? (
              <li className="text-sm text-muted-foreground">No enrolled subjects yet.</li>
            ) : (
              workspaceIds.map((wid) => {
                const ws = workspaceById(data, wid)
                if (!ws) return null
                return (
                  <li key={wid}>
                    <Link
                      to={`/app/student/subjects`}
                      className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 text-sm hover:bg-muted"
                    >
                      <span className="font-medium">{ws.subjectName}</span>
                      <span className="text-xs capitalize text-muted-foreground">
                        {ws.curriculumStatus.replace('_', ' ')}
                      </span>
                    </Link>
                  </li>
                )
              })
            )}
          </ul>
        </section>
      </DashboardShell>
    </AppDataLoading>
  )
}
