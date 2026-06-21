import { Building2, ClipboardList, Users } from 'lucide-react'
import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { StatCard } from '@/components/dashboard/StatCard'
import { PageHeaderSkeleton, StatGridSkeleton } from '@/components/ui/LoadingSkeletons'
import { usePlatformStats } from '@/hooks/queries/usePlatformData'

export const SuperadminDashboardPage = () => {
  const { data: stats, isLoading } = usePlatformStats()

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-8">
        <PageHeaderSkeleton />
        <StatGridSkeleton count={3} />
      </div>
    )
  }

  return (
    <DashboardShell
      title="Platform overview"
      subtitle="Cross-tenant operations for ScholarFlow"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Customer schools"
          value={stats?.schoolCount ?? 0}
          icon={Building2}
          to="/app/superadmin/schools"
          linkLabel="Manage schools"
        />
        <StatCard
          label="School users"
          value={stats?.userCount ?? 0}
          icon={Users}
        />
        <StatCard
          label="Pending account requests"
          value={stats?.pendingAccountRequests ?? 0}
          icon={ClipboardList}
          tone={(stats?.pendingAccountRequests ?? 0) > 0 ? 'warning' : 'default'}
          to="/app/superadmin/account-requests"
          linkLabel="Review requests"
        />
      </div>
    </DashboardShell>
  )
}
