import { useAppData } from '@/context/AppDataContext'

export const TimetableAdminPage = () => {
  const { data } = useAppData()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Timetable management</h1>
      <p className="text-sm text-muted-foreground">
        Master timetable (PRD §8.9 / §10) — read-only grid; drag-drop builder stub.
      </p>
      <button
        type="button"
        className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
      >
        Open builder (stub)
      </button>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-2">Day</th>
              <th className="p-2">Time</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Class</th>
              <th className="p-2">Teacher</th>
              <th className="p-2">Room</th>
            </tr>
          </thead>
          <tbody>
            {data.timetable.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="p-2">{t.day}</td>
                <td className="p-2">
                  {t.start}–{t.end}
                </td>
                <td className="p-2">{t.subjectName}</td>
                <td className="p-2">{t.classLabel}</td>
                <td className="p-2">{t.teacherName}</td>
                <td className="p-2">{t.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
