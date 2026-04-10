import { useAppData } from '@/context/AppDataContext'
import { useParentChild } from '@/hooks/useParentChild'
import { studentName, workspaceById } from '@/lib/tms-helpers'
import { cn } from '@/lib/utils'

export const ParentAttendance = () => {
  const { childId, setChildId, childIds } = useParentChild()
  const { data } = useAppData()
  if (!childId) return null
  const rows = data.attendance.filter((a) => a.studentId === childId)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Attendance</h1>
        {childIds.length > 1 ? (
          <select
            value={childId}
            onChange={(e) => setChildId(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {childIds.map((id) => (
              <option key={id} value={id}>
                {studentName(data, id)}
              </option>
            ))}
          </select>
        ) : null}
      </div>
      <ul className="mt-6 space-y-2" role="list">
        {rows.map((r) => {
          const ws = workspaceById(data, r.workspaceId)
          return (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3 text-sm"
            >
              <span>{r.date}</span>
              <span>{ws?.subjectName}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs capitalize',
                  r.presence === 'absent' && 'bg-red-100 text-red-900',
                )}
              >
                {r.presence}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
