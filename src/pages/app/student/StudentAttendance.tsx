import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceById } from '@/lib/tms-helpers'
import { cn } from '@/lib/utils'

export const StudentAttendance = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const sid = user?.studentId
  const rows = sid ? data.attendance.filter((a) => a.studentId === sid) : []

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-foreground">My attendance</h1>
      <p className="mt-1 text-sm text-muted-foreground">Per subject (PRD §6.5)</p>
      <ul className="mt-6 space-y-2" role="list">
        {rows.map((r) => {
          const ws = workspaceById(data, r.workspaceId)
          return (
            <li
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card p-3 text-sm"
            >
              <span className="text-muted-foreground">{r.date}</span>
              <span className="font-medium">{ws?.subjectName ?? r.workspaceId}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium capitalize',
                  r.presence === 'present' && 'bg-emerald-100 text-emerald-900',
                  r.presence === 'absent' && 'bg-red-100 text-red-900',
                  r.presence === 'late' && 'bg-amber-100 text-amber-900',
                )}
              >
                {r.presence}
              </span>
              {r.reasonCode ? (
                <span className="text-xs text-muted-foreground">{r.reasonCode}</span>
              ) : null}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
