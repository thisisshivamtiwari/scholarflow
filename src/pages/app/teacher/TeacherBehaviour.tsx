import { useMemo, useState, type FormEvent } from 'react'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceForTeacher, studentsInWorkspace, studentName } from '@/lib/tms-helpers'
import { useBehaviourMutations } from '@/hooks/queries/useTmsData'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { LoadingButton } from '@/components/ui/LoadingButton'

export const TeacherBehaviour = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const record = useBehaviourMutations()
  const workspaces = user ? workspaceForTeacher(data, user) : []
  const [workspaceId, setWorkspaceId] = useState(workspaces[0]?.id ?? '')
  const [studentId, setStudentId] = useState('')
  const [rating, setRating] = useState(3)
  const [remark, setRemark] = useState('')
  const [saved, setSaved] = useState(false)

  const students = useMemo(
    () => (workspaceId ? studentsInWorkspace(data, workspaceId) : []),
    [data, workspaceId],
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!user || !workspaceId || !studentId) return
    record.mutate(
      {
        workspaceId,
        studentId,
        date: new Date().toISOString().slice(0, 10),
        rating,
        remark: remark.trim(),
        recordedBy: user.id,
      },
      {
        onSuccess: () => {
          setSaved(true)
          setRemark('')
          setTimeout(() => setSaved(false), 3000)
        },
      },
    )
  }

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Behaviour records</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record behaviour for headmaster approval before parents can view it.
          </p>
        </div>

        {saved ? (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800" role="status">
            Record submitted for approval.
          </p>
        ) : null}

        <form className="space-y-4 rounded-xl border border-border bg-card p-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="workspace" className="block text-sm font-medium">Subject</label>
            <select
              id="workspace"
              value={workspaceId}
              onChange={(e) => {
                setWorkspaceId(e.target.value)
                setStudentId('')
              }}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.subjectName} · {w.classLabel}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="student" className="block text-sm font-medium">Student</label>
            <select
              id="student"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="">Select student</option>
              {students.map((sid) => (
                <option key={sid} value={sid}>
                  {studentName(data, sid)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium">
              Rating ({rating}/5)
            </label>
            <input
              id="rating"
              type="range"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </div>
          <div>
            <label htmlFor="remark" className="block text-sm font-medium">Remark</label>
            <textarea
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              required
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>
          <LoadingButton
            type="submit"
            loading={record.isPending}
            loadingLabel="Saving…"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Submit for approval
          </LoadingButton>
        </form>
      </div>
    </AppDataLoading>
  )
}
