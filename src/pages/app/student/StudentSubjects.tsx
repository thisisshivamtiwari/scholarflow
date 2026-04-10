import { Link } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { topicProgressLabel, workspaceById } from '@/lib/tms-helpers'

export const StudentSubjects = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const ids = user?.studentId ? data.studentWorkspaceIds[user.studentId] ?? [] : []

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-foreground">My subjects</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Approved curriculum and coverage (PRD §6.1)
      </p>
      <ul className="mt-8 space-y-4" role="list">
        {ids.map((wid) => {
          const ws = workspaceById(data, wid)
          if (!ws) return null
          const published = ws.curriculumStatus === 'locked'
          return (
            <li key={wid}>
              <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    {ws.subjectName}
                  </h2>
                  {!published ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-900">
                      Not yet published
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{ws.classLabel}</p>
                <ul className="mt-4 space-y-2 text-sm" role="list">
                  {ws.topics.map((t, i) => {
                    const label = published
                      ? topicProgressLabel(ws, i)
                      : ('Upcoming' as const)
                    return (
                      <li key={t.id} className="flex justify-between gap-2">
                        {published ? (
                          <Link
                            to={`/app/student/subjects/${wid}/topics/${t.id}`}
                            className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                          >
                            {t.heading}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">{t.heading}</span>
                        )}
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
