import { useAppData } from '@/context/AppDataContext'
import { useParentChild } from '@/hooks/useParentChild'
import { studentName, workspaceById } from '@/lib/tms-helpers'

export const ParentPerformance = () => {
  const { childId, setChildId, childIds } = useParentChild()
  const { data } = useAppData()
  if (!childId) return null
  const grades = data.grades.filter((g) => g.studentId === childId)

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Academic performance</h1>
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
      <div className="mt-6 h-28 rounded-xl border border-dashed border-border bg-muted/20" />
      <table className="mt-6 w-full text-left text-sm">
        <thead className="border-b border-border bg-muted/50">
          <tr>
            <th className="p-2">Subject</th>
            <th className="p-2">Assessment</th>
            <th className="p-2">Grade</th>
            <th className="p-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g) => {
            const ws = workspaceById(data, g.workspaceId)
            return (
              <tr key={g.id} className="border-b border-border">
                <td className="p-2">{ws?.subjectName}</td>
                <td className="p-2">{g.assessmentName}</td>
                <td className="p-2 font-medium">{g.value}</td>
                <td className="p-2 text-muted-foreground">{g.remarks || '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
