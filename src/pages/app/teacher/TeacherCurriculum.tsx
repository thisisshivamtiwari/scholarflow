import { Link, useParams } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceById } from '@/lib/tms-helpers'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export const TeacherCurriculum = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { user } = useAuth()
  const { data, submitCurriculumForApproval } = useAppData()
  const [view, setView] = useState<'topic' | 'week'>('topic')

  const ws = workspaceId ? workspaceById(data, workspaceId) : undefined
  const allowed =
    user?.role === 'teacher' &&
    ws &&
    (user.workspaceIds?.includes(ws.id) ?? false)

  if (!workspaceId || !ws || !allowed) {
    return <p className="text-sm text-muted-foreground">Workspace not found.</p>
  }

  const isDraft = ws.curriculumStatus === 'draft'

  return (
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
            <button
              type="button"
              onClick={() => submitCurriculumForApproval(ws.id)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Submit for approval
            </button>
          ) : null}
        </div>
      </div>

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
            'rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
            'rounded-md px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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
            <li key={t.id}>
              <Link
                to={`/app/teacher/workspaces/${ws.id}/topics/${t.id}`}
                className="block rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <p className="text-xs font-medium text-muted-foreground">
                  Topic {i + 1}
                </p>
                <p className="font-semibold text-foreground">{t.heading}</p>
                <p className="text-sm text-muted-foreground">{t.subHeading}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Weeks {t.targetWeeks.join(', ')}
                </p>
              </Link>
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
                const topics = ws.topics.filter((t) =>
                  t.targetWeeks.includes(week),
                )
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

      {isDraft ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Editing (add/reorder topics) is enabled in draft only — demo shows
          read-only structure.
        </p>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Curriculum is not editable in this status except via change request
          when locked (PRD §5.2).
        </p>
      )}
    </div>
  )
}
