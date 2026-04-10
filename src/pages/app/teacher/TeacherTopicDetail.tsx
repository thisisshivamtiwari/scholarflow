import { Link, useParams } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceById } from '@/lib/tms-helpers'

export const TeacherTopicDetail = () => {
  const { workspaceId, topicId } = useParams<{
    workspaceId: string
    topicId: string
  }>()
  const { user } = useAuth()
  const { data } = useAppData()

  const ws = workspaceId ? workspaceById(data, workspaceId) : undefined
  const topic = ws?.topics.find((t) => t.id === topicId)
  const allowed =
    user?.role === 'teacher' &&
    ws &&
    (user.workspaceIds?.includes(ws.id) ?? false)

  if (!ws || !topic || !allowed) {
    return <p className="text-sm text-muted-foreground">Topic not found.</p>
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={`/app/teacher/workspaces/${ws.id}/curriculum`}
        className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        ← Back to curriculum
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">{topic.heading}</h1>
      <p className="text-sm text-muted-foreground">{topic.subHeading}</p>
      <p className="mt-4 text-sm text-foreground">{topic.description}</p>
      <p className="mt-2 text-xs text-muted-foreground">
        Target weeks: {topic.targetWeeks.join(', ')}
      </p>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-foreground">Resources</h2>
        <ul className="mt-3 space-y-3" role="list">
          {topic.resources.length === 0 ? (
            <li className="text-sm text-muted-foreground">No resources yet.</li>
          ) : (
            topic.resources.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-border bg-card p-4 text-sm"
              >
                <span className="font-medium text-foreground">{r.title}</span>
                <span className="ml-2 text-xs uppercase text-muted-foreground">
                  {r.kind}
                </span>
                <p className="mt-1 truncate text-primary">
                  <a href={r.url} className="hover:underline" target="_blank" rel="noreferrer">
                    {r.url}
                  </a>
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {r.visibleToStudents
                    ? 'Visible to students'
                    : 'Teacher only'}
                </p>
              </li>
            ))
          )}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Add/remove files and visibility toggles — UI stub for demo.
        </p>
      </section>
    </div>
  )
}
