import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { exportGradesPdf } from '@/lib/export-reports'

export const TeacherPerformancePage = () => {
  const { data } = useAppData()
  const { user } = useAuth()
  const teacherId = user?.id ?? ''
  const behind = data.teacherBehindIds.includes(teacherId)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Teacher performance</h1>
        <button
          type="button"
          onClick={() =>
            exportGradesPdf(
              'Teacher Performance',
              [[`Delivery flag: ${behind ? 'Behind' : 'On track'}`, `Workspaces: ${data.workspaces.length}`]],
              ['Metric', 'Value'],
            )
          }
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
        >
          Export PDF
        </button>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="font-medium text-foreground">{user?.displayName}</p>
        <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
          <li>Curriculum delivery: {data.workspaces.length} workspaces active</li>
          <li>Behind plan flag: {behind ? 'Yes' : 'No'}</li>
          <li>Pending change requests: {data.changeRequests.length}</li>
        </ul>
      </div>
    </div>
  )
}
