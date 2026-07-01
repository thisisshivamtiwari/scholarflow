import { Link, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceById } from '@/lib/tms-helpers'
import { cn } from '@/lib/utils'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { LoadingButton } from '@/components/ui/LoadingButton'

export const TeacherCurriculum = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { user } = useAuth()
  const {
    data,
    submitCurriculumForApproval,
    addTopic,
    deleteTopic,
    createChangeRequest,
    reorderTopics,
    updateTopic,
    isFetching,
  } = useAppData()
  const [view, setView] = useState<'topic' | 'week'>('topic')
  const [newHeading, setNewHeading] = useState('')
  const [changeReason, setChangeReason] = useState('')

  const ws = workspaceId ? workspaceById(data, workspaceId) : undefined
  const allowed =
    user?.role === 'teacher' &&
    ws &&
    (user.workspaceIds?.includes(ws.id) ?? false)

  const termWeeks = useMemo(() => {
    const n = ws?.termWeeks ?? data.school.termWeeks ?? 6
    return Array.from({ length: n }, (_, i) => i + 1)
  }, [ws?.termWeeks, data.school.termWeeks])

  if (!workspaceId || !ws || !allowed) {
    return <p className="text-sm text-muted-foreground">Workspace not found.</p>
  }

  const isEditable = ws.curriculumStatus === 'draft' || ws.curriculumStatus === 'rejected'
  const isLocked = ws.curriculumStatus === 'locked'
  const isRejected = ws.curriculumStatus === 'rejected'

  const moveTopic = (index: number, direction: -1 | 1) => {
    const next = index + direction
    if (next < 0 || next >= ws.topics.length) return
    const ids = ws.topics.map((t) => t.id)
    ;[ids[index], ids[next]] = [ids[next], ids[index]]
    reorderTopics(ids)
  }

  const toggleWeek = (topicId: string, week: number, current: number[]) => {
    const next = current.includes(week)
      ? current.filter((w) => w !== week)
      : [...current, week].sort((a, b) => a - b)
    updateTopic({ topicId, patch: { target_weeks: next } })
  }

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {ws.subjectName} · {ws.classLabel}
            </h1>
            <p className="mt-1 text-sm capitalize text-muted-foreground">
              Status: {ws.curriculumStatus.replace('_', ' ')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isEditable ? (
              <LoadingButton
                type="button"
                loading={isFetching}
                loadingLabel="Submitting…"
                onClick={() => submitCurriculumForApproval(ws.id)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                {isRejected ? 'Resubmit for approval' : 'Submit for approval'}
              </LoadingButton>
            ) : null}
          </div>
        </div>

        {isRejected && ws.rejectionReason ? (
          <p className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            <strong>Rejected:</strong> {ws.rejectionReason}
          </p>
        ) : null}

        {isEditable ? (
          <form
            className="mt-6 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!newHeading.trim()) return
              addTopic({
                workspaceId: ws.id,
                heading: newHeading.trim(),
                subHeading: '',
                targetWeeks: [1],
              })
              setNewHeading('')
            }}
          >
            <input
              value={newHeading}
              onChange={(e) => setNewHeading(e.target.value)}
              placeholder="New topic heading"
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Add topic
            </button>
          </form>
        ) : null}

        {isLocked ? (
          <form
            className="mt-6 space-y-2 rounded-xl border border-border bg-card p-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!changeReason.trim() || !user) return
              createChangeRequest({
                workspaceId: ws.id,
                reason: changeReason.trim(),
                requestedBy: user.id,
              })
              setChangeReason('')
            }}
          >
            <p className="text-sm font-medium">Request curriculum change (locked)</p>
            <textarea
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              rows={2}
              placeholder="Reason for change…"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              Submit change request
            </button>
          </form>
        ) : null}

        <div
          className="mt-6 inline-flex rounded-lg border border-border p-1"
          role="tablist"
          aria-label="Curriculum view"
        >
          <button
            type="button"
            role="tab"
            aria-selected={view === 'topic'}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium',
              view === 'topic' ? 'bg-muted text-foreground' : 'text-muted-foreground',
            )}
            onClick={() => setView('topic')}
          >
            Topic view
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'week'}
            className={cn(
              'rounded-md px-4 py-2 text-sm font-medium',
              view === 'week' ? 'bg-muted text-foreground' : 'text-muted-foreground',
            )}
            onClick={() => setView('week')}
          >
            Week view
          </button>
        </div>

        {view === 'topic' ? (
          <ul className="mt-6 space-y-3" role="list">
            {ws.topics.map((t, i) => (
              <li key={t.id} className="flex items-start gap-2">
                {isEditable ? (
                  <div className="flex flex-col gap-1 pt-4">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => moveTopic(i, -1)}
                      className="rounded border px-1 text-xs disabled:opacity-30"
                      aria-label="Move up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      disabled={i === ws.topics.length - 1}
                      onClick={() => moveTopic(i, 1)}
                      className="rounded border px-1 text-xs disabled:opacity-30"
                      aria-label="Move down"
                    >
                      ↓
                    </button>
                  </div>
                ) : null}
                <div className="block flex-1 rounded-xl border border-border bg-card p-4 shadow-sm">
                  <p className="text-xs font-medium text-muted-foreground">Topic {i + 1}</p>
                  <Link
                    to={`/app/teacher/workspaces/${ws.id}/topics/${t.id}`}
                    className="font-semibold text-foreground hover:text-primary hover:underline"
                  >
                    {t.heading}
                  </Link>
                  <p className="text-sm text-muted-foreground">{t.subHeading}</p>
                  {isEditable ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {termWeeks.map((week) => (
                        <label
                          key={week}
                          className="inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={t.targetWeeks.includes(week)}
                            onChange={() => toggleWeek(t.id, week, t.targetWeeks)}
                          />
                          W{week}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Weeks {t.targetWeeks.join(', ') || '—'}
                    </p>
                  )}
                </div>
                {isEditable ? (
                  <button
                    type="button"
                    onClick={() => deleteTopic(t.id)}
                    className="rounded-lg border border-red-300 px-2 py-1 text-xs text-red-700"
                  >
                    Delete
                  </button>
                ) : null}
              </li>
            ))}
            {ws.topics.length === 0 ? (
              <li className="text-sm text-muted-foreground">No topics yet.</li>
            ) : null}
          </ul>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="p-3 font-semibold text-foreground">Week</th>
                  <th className="p-3 font-semibold text-foreground">Planned topic</th>
                </tr>
              </thead>
              <tbody>
                {termWeeks.map((week) => {
                  const topics = ws.topics.filter((t) => t.targetWeeks.includes(week))
                  return (
                    <tr key={week} className="border-b border-border">
                      <td className="p-3 font-medium text-foreground">{week}</td>
                      <td className="p-3 text-muted-foreground">
                        {topics.length
                          ? topics.map((t) => t.heading).join(' · ')
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppDataLoading>
  )
}
