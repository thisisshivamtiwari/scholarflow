import { useAppData } from '@/context/AppDataContext'
import { useParentChild } from '@/hooks/useParentChild'
import { studentName, timetableForStudent } from '@/lib/tms-helpers'

export const ParentTimetable = () => {
  const { childId, setChildId, childIds } = useParentChild()
  const { data } = useAppData()
  if (!childId) return null
  const slots = timetableForStudent(data, childId)
  const byDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Timetable</h1>
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
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {byDay.map((day) => (
          <section key={day} className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-semibold">{day}</h2>
            <ul className="mt-2 space-y-2 text-sm">
              {slots
                .filter((s) => s.day === day)
                .map((s) => (
                  <li key={s.id} className="rounded-lg bg-muted/40 p-2">
                    {s.subjectName} · {s.start}–{s.end}
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
