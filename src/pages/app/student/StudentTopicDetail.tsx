import { Link, useParams } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceById } from '@/lib/tms-helpers'

export const StudentTopicDetail = () => {
  const { workspaceId, topicId } = useParams<{
    workspaceId: string
    topicId: string
  }>()
  const { user } = useAuth()
  const { data } = useAppData()

  const ws = workspaceId ? workspaceById(data, workspaceId) : undefined
  const topic = ws?.topics.find((t) => t.id === topicId)
  const enrolled =
    user?.studentId &&
    (data.studentWorkspaceIds[user.studentId] ?? []).includes(workspaceId ?? '')

  if (!ws || !topic || !enrolled || ws.curriculumStatus !== 'locked') {
    return <p className="text-sm text-muted-foreground">Topic not available.</p>
  }

  const visible = topic.resources.filter((r) => r.visibleToStudents)

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/app/student/subjects"
        className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        ← My subjects
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">{topic.heading}</h1>
      <p className="text-sm text-muted-foreground">{topic.subHeading}</p>
      <p className="mt-4 text-sm">{topic.description}</p>

      <h2 className="mt-8 text-lg font-semibold">Resources</h2>
      <ul className="mt-2 space-y-2 text-sm" role="list">
        {visible.length === 0 ? (
          <li className="text-muted-foreground">No shared resources for this topic.</li>
        ) : (
          visible.map((r) => (
            <li key={r.id}>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary hover:underline"
              >
                {r.title}
              </a>
              <span className="ml-2 text-xs text-muted-foreground">({r.kind})</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
