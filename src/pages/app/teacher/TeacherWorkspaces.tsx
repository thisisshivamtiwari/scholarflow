import { Link } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { workspaceForTeacher } from '@/lib/tms-helpers'
import { cn } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
  pending: 'bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100',
  locked: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100',
  change_requested: 'bg-violet-100 text-violet-900 dark:bg-violet-900/40 dark:text-violet-100',
  rejected: 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100',
}

export const TeacherWorkspaces = () => {
  const { user } = useAuth()
  const { data } = useAppData()
  const list = user ? workspaceForTeacher(data, user) : []

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-foreground">Workspaces</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Each subject/class pair is an independent curriculum workspace (PRD §5.1).
      </p>
      <ul className="mt-8 space-y-4" role="list">
        {list.map((w) => (
          <li key={w.id}>
            <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {w.subjectName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{w.classLabel}</p>
                </div>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
                    statusStyles[w.curriculumStatus] ?? 'bg-muted text-foreground',
                  )}
                >
                  {w.curriculumStatus.replace('_', ' ')}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to={`/app/teacher/workspaces/${w.id}/curriculum`}
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Curriculum
                </Link>
                <Link
                  to={`/app/teacher/workspaces/${w.id}/tracking`}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Weekly tracking
                </Link>
                <Link
                  to={`/app/teacher/workspaces/${w.id}/grades`}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Grades
                </Link>
                <Link
                  to={`/app/teacher/workspaces/${w.id}/attendance`}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Attendance
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  )
}
