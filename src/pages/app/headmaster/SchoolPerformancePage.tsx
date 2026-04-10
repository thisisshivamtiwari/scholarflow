import { useAppData } from '@/context/AppDataContext'
import { studentName, workspaceById } from '@/lib/tms-helpers'

export const SchoolPerformancePage = () => {
  const { data } = useAppData()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">School-wide performance</h1>
      <p className="text-sm text-muted-foreground">
        Filters: year group, subject, date range, grade category (PRD §8.4) — demo summary.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">Grade distribution</p>
          <p className="mt-2 text-sm text-muted-foreground">Placeholder chart</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">Class averages</p>
          <p className="mt-2 text-sm">Year 9A — Science avg ~58%</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs uppercase text-muted-foreground">Below threshold</p>
          <ul className="mt-2 text-sm">
            {data.flaggedStudents.map((f) => (
              <li key={f.studentId}>{studentName(data, f.studentId)}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-2">Student</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Assessment</th>
              <th className="p-2">Grade</th>
            </tr>
          </thead>
          <tbody>
            {data.grades.map((g) => {
              const ws = workspaceById(data, g.workspaceId)
              return (
                <tr key={g.id} className="border-t border-border">
                  <td className="p-2">{studentName(data, g.studentId)}</td>
                  <td className="p-2">{ws?.subjectName}</td>
                  <td className="p-2">{g.assessmentName}</td>
                  <td className="p-2">{g.value}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
