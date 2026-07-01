import { useState, type FormEvent } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSchoolConfig, useSubjectRequestSubmit } from '@/hooks/queries/useTmsData'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { LoadingButton } from '@/components/ui/LoadingButton'

export const TeacherSubjectRequest = () => {
  const { user } = useAuth()
  const { data: school } = useSchoolConfig()
  const submit = useSubjectRequestSubmit()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    subjectName: '',
    classLabel: 'Year 9A',
    notes: '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!user || !school) return
    try {
      await submit.mutateAsync({
        subjectName: form.subjectName.trim(),
        classLabel: form.classLabel.trim(),
        notes: form.notes.trim(),
        teacherId: user.id,
        schoolId: school.id,
      })
      setSubmitted(true)
      setForm({ subjectName: '', classLabel: 'Year 9A', notes: '' })
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Request a subject</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask your school admin to create a new teaching workspace. Approved requests apply the
            curriculum template when available.
          </p>
        </div>

        {submitted ? (
          <p className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
            Request submitted. You will see the workspace once an admin approves it.
          </p>
        ) : (
          <form className="space-y-4 rounded-xl border border-border bg-card p-6" onSubmit={(e) => void handleSubmit(e)}>
            <div>
              <label htmlFor="subjectName" className="block text-sm font-medium">Subject name</label>
              <input
                id="subjectName"
                value={form.subjectName}
                onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
                placeholder="e.g. Mathematics"
              />
            </div>
            <div>
              <label htmlFor="classLabel" className="block text-sm font-medium">Class / year group</label>
              <input
                id="classLabel"
                value={form.classLabel}
                onChange={(e) => setForm({ ...form, classLabel: e.target.value })}
                required
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium">Notes (optional)</label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <LoadingButton
              type="submit"
              loading={submit.isPending}
              loadingLabel="Submitting…"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Submit request
            </LoadingButton>
          </form>
        )}
      </div>
    </AppDataLoading>
  )
}
