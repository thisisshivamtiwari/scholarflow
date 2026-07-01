import { useAppData } from '@/context/AppDataContext'
import { useParentChild } from '@/hooks/useParentChild'
import { studentName, workspaceById } from '@/lib/tms-helpers'
import { AppDataLoading } from '@/components/app/AppDataLoading'

export const ParentBehaviour = () => {
  const { childId } = useParentChild()
  const { data } = useAppData()

  if (!childId) {
    return <p className="text-sm text-muted-foreground">No linked children on this account.</p>
  }

  const records = data.behaviourRecords.filter(
    (b) => b.studentId === childId && b.status === 'approved',
  )

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Behaviour</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Approved behaviour records for {studentName(data, childId)}.
          </p>
        </div>

        <ul className="space-y-3" role="list">
          {records.map((b) => {
            const ws = workspaceById(data, b.workspaceId)
            return (
              <li key={b.id} className="rounded-xl border border-border bg-card p-4">
                <p className="font-medium text-foreground">
                  {ws?.subjectName} · {b.date}
                </p>
                <p className="text-sm text-muted-foreground">Rating {b.rating}/5</p>
                <p className="mt-2 text-sm">{b.remark}</p>
              </li>
            )
          })}
          {records.length === 0 ? (
            <li className="text-sm text-muted-foreground">No approved behaviour records yet.</li>
          ) : null}
        </ul>
      </div>
    </AppDataLoading>
  )
}
