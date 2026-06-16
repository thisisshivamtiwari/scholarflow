import { CalendarDays, ClipboardList, Settings, Users } from 'lucide-react'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { StatCard } from '@/components/dashboard/StatCard'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'

export const AdminDashboard = () => {
  const { user } = useAuth()
  const { data } = useAppData()

  const opsPending =
    data.accountRequests.length +
    data.timetableConflicts.length +
    data.enrolmentGaps.length

  return (
    <AppDataLoading>
      <DashboardShell
        title={`Admin console`}
        subtitle={`${user?.displayName ?? 'Admin'} · ${data.school.name}`}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Pending operations"
            value={opsPending}
            hint={`${data.accountRequests.length} account requests`}
            icon={ClipboardList}
            tone={opsPending > 0 ? 'warning' : 'default'}
            to="/app/admin/pending"
            linkLabel="Pending tasks"
          />
          <StatCard
            label="Students"
            value={data.students.length}
            icon={Users}
            to="/app/admin/users"
            linkLabel="User management"
          />
          <StatCard
            label="Timetable conflicts"
            value={data.timetableConflicts.length}
            icon={CalendarDays}
            tone={data.timetableConflicts.length > 0 ? 'warning' : 'default'}
            to="/app/admin/timetable"
            linkLabel="Timetable"
          />
          <StatCard
            label="Enrolment gaps"
            value={data.enrolmentGaps.length}
            icon={Settings}
            to="/app/admin/configuration"
            linkLabel="Configuration"
          />
        </div>
      </DashboardShell>
    </AppDataLoading>
  )
}
