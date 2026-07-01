import { Link } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { visibleStudentTopics, workspaceById } from '@/lib/tms-helpers'

const visibilityLabel = {
  completed: 'Completed',
  current: 'Current topic',
  next: 'Up next',
} as const

export const StudentSubjects = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const ids = user?.studentId ? data.studentWorkspaceIds[user.studentId] ?? [] : []

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-foreground">My subjects</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Your current curriculum focus — completed, in progress, and upcoming topics.
      </p>
      <ul className="mt-8 space-y-4" role="list">
        {ids.map((wid) => {
          const ws = workspaceById(data, wid)
          if (!ws) return null
          const published = ws.curriculumStatus === 'locked'
          const topics = published ? visibleStudentTopics(ws) : []
          const resources = topics.flatMap((x) =>
            x.topic.resources.filter((r) => r.visibleToStudents),
          )

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
                {published ? (
                  <>
                    <ul className="mt-4 space-y-2 text-sm" role="list">
                      {topics.map(({ topic, visibility }) => (
                        <li key={topic.id} className="flex justify-between gap-2">
                          <Link
                            to={`/app/student/subjects/${wid}/topics/${topic.id}`}
                            className="font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                          >
                            {topic.heading}
                          </Link>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {visibilityLabel[visibility as keyof typeof visibilityLabel]}
                          </span>
                        </li>
                      ))}
                      {topics.length === 0 ? (
                        <li className="text-muted-foreground">No topics in view yet.</li>
                      ) : null}
                    </ul>
                    {resources.length > 0 ? (
                      <div className="mt-4 border-t border-border pt-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Resources
                        </p>
                        <ul className="mt-2 space-y-1 text-sm" role="list">
                          {resources.map((r) => (
                            <li key={r.id}>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary hover:underline"
                              >
                                {r.title} ({r.kind})
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Curriculum not published yet.
                  </p>
                )}
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
