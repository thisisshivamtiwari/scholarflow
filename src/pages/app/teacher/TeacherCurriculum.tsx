import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
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

  if (!workspaceId || !ws || !allowed) {
    return <p className="text-sm text-muted-foreground">Workspace not found.</p>
  }

  const isDraft = ws.curriculumStatus === 'draft'
  const isLocked = ws.curriculumStatus === 'locked'

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
            {isDraft ? (
              <LoadingButton
                type="button"
                loading={isFetching}
                loadingLabel="Submitting…"
                onClick={() => submitCurriculumForApproval(ws.id)}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Submit for approval
              </LoadingButton>
            ) : null}
          </div>
        </div>

        {isDraft ? (
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
                <Link
                  to={`/app/teacher/workspaces/${ws.id}/topics/${t.id}`}
                  className="block flex-1 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="text-xs font-medium text-muted-foreground">Topic {i + 1}</p>
                  <p className="font-semibold text-foreground">{t.heading}</p>
                  <p className="text-sm text-muted-foreground">{t.subHeading}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Weeks {t.targetWeeks.join(', ')}
                  </p>
                </Link>
                {isDraft ? (
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
                {[1, 2, 3, 4, 5, 6].map((week) => {
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
