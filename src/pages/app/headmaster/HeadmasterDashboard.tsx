import {
  AlertTriangle,
  ClipboardList,
  LineChart,
  UserSquare,
  Users,
} from 'lucide-react'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'

export const HeadmasterDashboard = () => {
  const { user } = useAuth()
  const { data } = useAppData()

  const pendingTotal =
    data.syllabusPending.length +
    data.changeRequests.length +
    data.accountRequests.length

  return (
    <AppDataLoading>
      <DashboardShell
        title={`Good day, ${user?.displayName ?? 'Headmaster'}`}
        subtitle={`${data.school.name} — school-wide overview`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Pending approvals"
            value={pendingTotal}
            hint={`${data.syllabusPending.length} syllabi · ${data.changeRequests.length} changes · ${data.accountRequests.length} accounts`}
            icon={ClipboardList}
            tone={pendingTotal > 0 ? 'warning' : 'default'}
            to="/app/headmaster/pending"
            linkLabel="Open pending tasks"
          />
          <StatCard
            label="Flagged students"
            value={data.flaggedStudents.length}
            icon={AlertTriangle}
            tone={data.flaggedStudents.length > 0 ? 'warning' : 'default'}
            to="/app/headmaster/school-performance"
            linkLabel="School performance"
          />
          <StatCard
            label="Teachers behind"
            value={data.teacherBehindIds.length}
            icon={UserSquare}
            to="/app/headmaster/teacher-performance"
            linkLabel="Teacher performance"
          />
          <StatCard
            label="Students enrolled"
            value={data.students.length}
            icon={Users}
            to="/app/headmaster/users"
            linkLabel="Manage users"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <StatCard
            label="Low attendance alerts"
            value={data.attendanceLowStudentIds.length}
            hint={`Threshold ${data.school.attendanceThresholdPercent}%`}
            icon={LineChart}
            tone={data.attendanceLowStudentIds.length > 0 ? 'warning' : 'default'}
            to="/app/headmaster/attendance"
            linkLabel="Attendance overview"
          />
          <StatCard
            label="Timetable conflicts"
            value={data.timetableConflicts.length}
            icon={ClipboardList}
            tone={data.timetableConflicts.length > 0 ? 'warning' : 'default'}
            to="/app/headmaster/timetable"
            linkLabel="Timetable builder"
          />
        </div>
      </DashboardShell>
    </AppDataLoading>
  )
}
