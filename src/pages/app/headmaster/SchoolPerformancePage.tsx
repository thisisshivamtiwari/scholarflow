import { useAppData } from '@/context/AppDataContext'
import { studentName, workspaceById } from '@/lib/tms-helpers'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { exportGradesExcel, exportGradesPdf } from '@/lib/export-reports'

export const SchoolPerformancePage = () => {
  const { data } = useAppData()

  const exportData = () => {
    const rows = data.grades.map((g) => {
      const ws = workspaceById(data, g.workspaceId)
      return {
        Student: studentName(data, g.studentId),
        Subject: ws?.subjectName ?? '',
        Assessment: g.assessmentName,
        Grade: g.value,
        Date: g.date,
      }
    })
    exportGradesExcel('school-performance', rows)
    exportGradesPdf(
      'School Performance',
      rows.map((r) => [r.Student, r.Subject, r.Assessment, r.Grade]),
      ['Student', 'Subject', 'Assessment', 'Grade'],
    )
  }

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-foreground">School-wide performance</h1>
          <button
            type="button"
            onClick={exportData}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Export PDF / Excel
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase text-muted-foreground">Total grades</p>
            <p className="mt-2 text-2xl font-semibold">{data.grades.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs uppercase text-muted-foreground">Workspaces</p>
            <p className="mt-2 text-2xl font-semibold">{data.workspaces.length}</p>
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
    </AppDataLoading>
  )
}
