import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { timetableForStudent } from '@/lib/tms-helpers'

export const StudentTimetable = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const slots = user?.studentId
    ? timetableForStudent(data, user.studentId)
    : []
  const byDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-semibold text-foreground">My timetable</h1>
      <p className="mt-1 text-sm text-muted-foreground">Read-only (PRD §6.4)</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {byDay.map((day) => (
          <section key={day} className="rounded-xl border border-border bg-card p-4">
            <h2 className="font-semibold">{day}</h2>
            <ul className="mt-2 space-y-2 text-sm" role="list">
              {slots
                .filter((s) => s.day === day)
                .map((s) => (
                  <li key={s.id} className="rounded-lg bg-muted/40 p-2">
                    <p className="font-medium">{s.subjectName}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.start}–{s.end} · {s.teacherName} · {s.room}
                    </p>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
