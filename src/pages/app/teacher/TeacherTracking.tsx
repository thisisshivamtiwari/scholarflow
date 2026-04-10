import { Link, useParams } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceById } from '@/lib/tms-helpers'
import { cn } from '@/lib/utils'

export const TeacherTracking = () => {
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

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/app/teacher/workspaces"
        className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        ← Workspaces
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        Weekly tracking · {ws.subjectName}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Plan vs actuals (PRD §5.3)
      </p>
      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="p-3 font-semibold">Week</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {ws.tracking.map((row) => (
              <tr key={row.weekIndex} className="border-b border-border">
                <td className="p-3 font-medium">{row.weekIndex}</td>
                <td className="p-3">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                      row.status === 'completed' && 'bg-emerald-100 text-emerald-900',
                      row.status === 'partial' && 'bg-amber-100 text-amber-900',
                      row.status === 'not_covered' && 'bg-slate-100 text-slate-800',
                    )}
                  >
                    {row.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{row.remarks || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
