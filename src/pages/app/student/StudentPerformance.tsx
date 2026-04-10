import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceById } from '@/lib/tms-helpers'

export const StudentPerformance = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const sid = user?.studentId
  const grades = sid ? data.grades.filter((g) => g.studentId === sid) : []

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-foreground">My performance</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your grades and anonymised class comparison (PRD §6.3) — chart placeholder.
      </p>
      <div className="mt-6 h-32 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
        Subject average over time — demo chart area
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="p-3 font-semibold">Subject</th>
              <th className="p-3 font-semibold">Assessment</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Grade</th>
              <th className="p-3 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => {
              const ws = workspaceById(data, g.workspaceId)
              return (
                <tr key={g.id} className="border-b border-border">
                  <td className="p-3">{ws?.subjectName ?? '—'}</td>
                  <td className="p-3">{g.assessmentName}</td>
                  <td className="p-3">{g.date}</td>
                  <td className="p-3 font-medium">{g.value}</td>
                  <td className="p-3 text-muted-foreground">{g.remarks || '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
