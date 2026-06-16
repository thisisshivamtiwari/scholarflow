import { Link, useParams } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceById } from '@/lib/tms-helpers'
import { cn } from '@/lib/utils'
import { AppDataLoading } from '@/components/app/AppDataLoading'

export const TeacherTracking = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { user } = useAuth()
  const { data, upsertTracking } = useAppData()
  const ws = workspaceId ? workspaceById(data, workspaceId) : undefined
  const allowed =
    user?.role === 'teacher' &&
    ws &&
    (user.workspaceIds?.includes(ws.id) ?? false)

  if (!ws || !allowed) {
    return <p className="text-sm text-muted-foreground">Workspace not found.</p>
  }

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-4xl">
        <Link to="/app/teacher/workspaces" className="text-sm font-medium text-primary hover:underline">
          ← Workspaces
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Weekly tracking · {ws.subjectName}
        </h1>

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
                    <select
                      value={row.status}
                      onChange={(e) =>
                        upsertTracking({
                          workspaceId: ws.id,
                          weekIndex: row.weekIndex,
                          status: e.target.value,
                          remarks: row.remarks,
                        })
                      }
                      className={cn(
                        'rounded-lg border border-border px-2 py-1 text-xs capitalize',
                      )}
                    >
                      <option value="completed">Completed</option>
                      <option value="partial">Partial</option>
                      <option value="not_covered">Not covered</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      value={row.remarks}
                      onChange={(e) =>
                        upsertTracking({
                          workspaceId: ws.id,
                          weekIndex: row.weekIndex,
                          status: row.status,
                          remarks: e.target.value,
                        })
                      }
                      className="w-full rounded border border-border px-2 py-1 text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppDataLoading>
  )
}
