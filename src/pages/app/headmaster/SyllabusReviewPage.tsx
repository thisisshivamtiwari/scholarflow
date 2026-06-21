import { Link, Navigate, useParams } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceById } from '@/lib/tms-helpers'
import { LoadingButton } from '@/components/ui/LoadingButton'

export const SyllabusReviewPage = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>()
  const { user } = useAuth()
  const { data, approveSyllabus, rejectSyllabus, isFetching } = useAppData()

  if (user?.role !== 'headmaster') {
    return <Navigate to="/app" replace />
  }

  const ws = workspaceId ? workspaceById(data, workspaceId) : undefined
  if (!ws) return <p className="text-sm text-muted-foreground">Not found.</p>

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to="/app/headmaster/pending"
        className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
      >
        ← Pending tasks
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-foreground">
        Review syllabus · {ws.subjectName}
      </h1>
      <ul className="mt-6 space-y-2 text-sm" role="list">
        {ws.topics.map((t) => (
          <li key={t.id} className="rounded-lg border border-border p-3">
            <span className="font-medium">{t.heading}</span> — {t.subHeading}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-2">
        <LoadingButton
          type="button"
          loading={isFetching}
          loadingLabel="Approving…"
          onClick={() => approveSyllabus(ws.id)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Approve & lock
        </LoadingButton>
        <LoadingButton
          type="button"
          loading={isFetching}
          loadingLabel="Rejecting…"
          onClick={() => rejectSyllabus(ws.id)}
          className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Reject
        </LoadingButton>
      </div>
    </div>
  )
}
