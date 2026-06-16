import { useState } from 'react'
import { useSchoolConfig, useConfigMutations } from '@/hooks/queries/useTmsData'
import { configApi } from '@/lib/api/mutations'
import { useQuery } from '@tanstack/react-query'
import { AppDataLoading } from '@/components/app/AppDataLoading'

export const AttendanceConfigPage = () => {
  const { data: school } = useSchoolConfig()
  const { updateAttendanceLock } = useConfigMutations()
  const [code, setCode] = useState('')
  const [label, setLabel] = useState('')
  const [lockHours, setLockHours] = useState<number | ''>('')

  const { data: codes, refetch } = useQuery({
    queryKey: ['attendance-reason-codes'],
    queryFn: async () => {
      const { data, error } = await configApi.reasonCodes()
      if (error) throw error
      return data
    },
  })

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-2xl font-semibold text-foreground">Attendance configuration</h1>
        <p className="text-sm text-muted-foreground">PRD §8.10 — reason codes and lock window.</p>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold">Lock window</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Records lock after this many hours (current: {school?.attendance_lock_hours ?? 24}h).
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!school || lockHours === '') return
              updateAttendanceLock.mutate({ schoolId: school.id, hours: Number(lockHours) })
            }}
          >
            <input
              type="number"
              value={lockHours}
              onChange={(e) => setLockHours(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Hours"
              className="w-24 rounded-lg border border-border px-3 py-2 text-sm"
            />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">
              Update lock
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold">Reason codes</h2>
          <ul className="mt-3 space-y-1 text-sm">
            {(codes ?? []).map((c) => (
              <li key={c.id} className="flex justify-between">
                <span>{c.code} — {c.label}</span>
                <button
                  type="button"
                  onClick={() => configApi.removeReasonCode(c.id).then(() => refetch())}
                  className="text-xs text-red-600 underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <form
            className="mt-4 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!school || !code.trim()) return
              configApi.addReasonCode(school.id, code.trim(), label.trim() || code.trim()).then(() => {
                setCode('')
                setLabel('')
                void refetch()
              })
            }}
          >
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code" className="rounded-lg border px-3 py-2 text-sm" />
            <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Label" className="flex-1 rounded-lg border px-3 py-2 text-sm" />
            <button type="submit" className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">Add</button>
          </form>
        </section>
      </div>
    </AppDataLoading>
  )
}
