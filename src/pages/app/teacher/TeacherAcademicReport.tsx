import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useAppData } from '@/context/AppDataContext'
import { workspaceForTeacher } from '@/lib/tms-helpers'
import { AppDataLoading } from '@/components/app/AppDataLoading'

export const TeacherAcademicReport = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const [params, setParams] = useSearchParams()

  const workspaces = user ? workspaceForTeacher(data, user) : []
  const workspaceId = params.get('workspace') ?? workspaces[0]?.id ?? ''
  const ws = workspaces.find((w) => w.id === workspaceId)

  const iframeSrc = useMemo(() => {
    if (!user || !ws) return ''
    const q = new URLSearchParams({
      'f-teacher': user.displayName,
      'f-name': ws.classLabel,
      'f-year': ws.classLabel.replace(/^Year\s*/i, '') || ws.classLabel,
      'f-acyear': data.school.academicYear,
    })
    return `/reports/gcse-mathematics-report.html?${q.toString()}`
  }, [user, ws, data.school.academicYear])

  return (
    <AppDataLoading>
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Academic report</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              GCSE Mathematics report builder — prefilled from your profile and class.
            </p>
          </div>
          {workspaces.length > 1 ? (
            <select
              value={workspaceId}
              onChange={(e) => setParams({ workspace: e.target.value })}
              className="rounded-lg border border-border px-3 py-2 text-sm"
            >
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.subjectName} · {w.classLabel}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        {iframeSrc ? (
          <iframe
            title="GCSE Mathematics academic report"
            src={iframeSrc}
            className="min-h-[80vh] w-full rounded-xl border border-border bg-white"
          />
        ) : (
          <p className="text-sm text-muted-foreground">Select a workspace to open the report.</p>
        )}
      </div>
    </AppDataLoading>
  )
}
