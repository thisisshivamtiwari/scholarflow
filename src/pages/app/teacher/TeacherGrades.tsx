import { Link, useParams } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { studentName, studentsInWorkspace, workspaceById } from '@/lib/tms-helpers'

export const TeacherGrades = () => {
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

  const sids = studentsInWorkspace(data, ws.id)
  const grades = data.grades.filter((g) => g.workspaceId === ws.id)

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        to="/app/teacher/workspaces"
        className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        ← Workspaces
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        Grades · {ws.subjectName}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Class list and grade entries (PRD §5.5)
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Add grade (stub)
        </button>
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Import CSV (stub)
        </button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Roster: {sids.map((id) => studentName(data, id)).join(', ')}
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="p-3 font-semibold">Student</th>
              <th className="p-3 font-semibold">Category</th>
              <th className="p-3 font-semibold">Assessment</th>
              <th className="p-3 font-semibold">Date</th>
              <th className="p-3 font-semibold">Grade</th>
              <th className="p-3 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.id} className="border-b border-border">
                <td className="p-3">{studentName(data, g.studentId)}</td>
                <td className="p-3 capitalize">{g.category}</td>
                <td className="p-3">{g.assessmentName}</td>
                <td className="p-3">{g.date}</td>
                <td className="p-3 font-medium">{g.value}</td>
                <td className="p-3 text-muted-foreground">{g.remarks || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
