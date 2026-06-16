import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import Papa from 'papaparse'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { studentName, studentsInWorkspace, workspaceById } from '@/lib/tms-helpers'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import type { GradeCategory } from '@/types/tms'

export const TeacherGrades = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { user } = useAuth()
  const { data, addGrade, importGradesCsv } = useAppData()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    studentId: '',
    category: 'test' as GradeCategory,
    assessmentName: '',
    date: new Date().toISOString().slice(0, 10),
    value: '',
    remarks: '',
  })

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

  const handleCsvImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.csv'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      Papa.parse(file, {
        complete: (result) => {
          const csvText = (result.data as string[][]).map((r) => r.join(',')).join('\n')
          importGradesCsv({ workspaceId: ws.id, csvText })
        },
      })
    }
    input.click()
  }

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-5xl">
        <Link to="/app/teacher/workspaces" className="text-sm font-medium text-primary hover:underline">
          ← Workspaces
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Grades · {ws.subjectName}
        </h1>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Add grade
          </button>
          <button
            type="button"
            onClick={handleCsvImport}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            Import CSV
          </button>
        </div>

        {showForm ? (
          <form
            className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault()
              addGrade({ workspaceId: ws.id, ...form })
              setShowForm(false)
            }}
          >
            <label className="text-sm">
              Student
              <select
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                required
              >
                <option value="">Select…</option>
                {sids.map((id) => (
                  <option key={id} value={id}>{studentName(data, id)}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Category
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as GradeCategory })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              >
                <option value="exam">Exam</option>
                <option value="test">Test</option>
                <option value="assessment">Assessment</option>
                <option value="behaviour">Behaviour</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label className="text-sm">
              Assessment
              <input
                value={form.assessmentName}
                onChange={(e) => setForm({ ...form, assessmentName: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                required
              />
            </label>
            <label className="text-sm">
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                required
              />
            </label>
            <label className="text-sm">
              Grade
              <input
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
                required
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Remarks
              <input
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2"
              />
            </label>
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:col-span-2">
              Save grade
            </button>
          </form>
        ) : null}

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
    </AppDataLoading>
  )
}
