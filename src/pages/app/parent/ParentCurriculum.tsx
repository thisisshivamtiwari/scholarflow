import { useAppData } from '@/context/AppDataContext'
import { useParentChild } from '@/hooks/useParentChild'
import { studentName, workspaceById } from '@/lib/tms-helpers'

export const ParentCurriculum = () => {
  const { childId, setChildId, childIds } = useParentChild()
  const { data } = useAppData()
  if (!childId) return null
  const wids = data.studentWorkspaceIds[childId] ?? []
  const allowRes = data.school.parentResourceAccess

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Curriculum progress</h1>
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
      <p className="mt-2 text-sm text-muted-foreground">
        Read-only topic coverage (PRD §7.3). Resources for parents:{' '}
        {allowRes ? 'enabled' : 'disabled'} for this school.
      </p>
      <ul className="mt-6 space-y-4" role="list">
        {wids.map((wid) => {
          const ws = workspaceById(data, wid)
          if (!ws) return null
          return (
            <li key={wid} className="rounded-xl border border-border bg-card p-4">
              <h2 className="font-semibold">{ws.subjectName}</h2>
              <ul className="mt-2 space-y-1 text-sm">
                {ws.topics.map((t) => (
                  <li key={t.id} className="text-muted-foreground">
                    {t.heading} — {ws.curriculumStatus === 'locked' ? 'on plan' : 'pending publication'}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
