import { Link, useParams } from 'react-router-dom'
import { useState } from 'react'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceById } from '@/lib/tms-helpers'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { useSchoolConfig } from '@/hooks/queries/useTmsData'

export const TeacherTopicDetail = () => {
  const { workspaceId, topicId } = useParams<{ workspaceId: string; topicId: string }>()
  const { user } = useAuth()
  const { data, addResource, toggleResourceVisibility, removeResource, uploadPaper } =
    useAppData()
  const { data: schoolRow } = useSchoolConfig()
  const [videoTitle, setVideoTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

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
    <AppDataLoading>
      <div className="mx-auto max-w-3xl">
        <Link
          to={`/app/teacher/workspaces/${ws.id}/curriculum`}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Back to curriculum
        </Link>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">{topic.heading}</h1>
        <p className="text-sm text-muted-foreground">{topic.subHeading}</p>
        <p className="mt-4 text-sm text-foreground">{topic.description}</p>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-foreground">Resources</h2>
          <ul className="mt-3 space-y-3" role="list">
            {topic.resources.map((r) => (
              <li key={r.id} className="rounded-lg border border-border bg-card p-4 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{r.title}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        toggleResourceVisibility({ id: r.id, visible: !r.visibleToStudents })
                      }
                      className="rounded border border-border px-2 py-1 text-xs"
                    >
                      {r.visibleToStudents ? 'Hide from students' : 'Show to students'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeResource(r.id)}
                      className="rounded border border-red-300 px-2 py-1 text-xs text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="mt-1 truncate text-primary">
                  <a href={r.url} target="_blank" rel="noreferrer">{r.url}</a>
                </p>
              </li>
            ))}
          </ul>

          <form
            className="mt-4 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              addResource({
                topicId: topic.id,
                kind: 'video',
                title: videoTitle,
                url: videoUrl,
                visible: true,
              })
              setVideoTitle('')
              setVideoUrl('')
            }}
          >
            <input
              placeholder="Video title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="rounded-lg border border-border px-3 py-2 text-sm"
              required
            />
            <input
              placeholder="YouTube URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm"
              required
            />
            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground">
              Add video
            </button>
          </form>

          <label className="mt-4 flex cursor-pointer flex-col gap-1 text-sm">
            <span className="font-medium">Upload question paper (PDF)</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file || !schoolRow) return
                uploadPaper({
                  schoolUuid: schoolRow.id,
                  topicId: topic.id,
                  file,
                  title: file.name,
                  visible: false,
                })
              }}
              className="text-muted-foreground"
            />
          </label>
        </section>
      </div>
    </AppDataLoading>
  )
}
