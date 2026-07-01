import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppData } from '@/context/AppDataContext'
import { useAuth } from '@/context/AuthContext'
import { useProfiles } from '@/hooks/queries/useTmsData'
import { studentName, workspaceById } from '@/lib/tms-helpers'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { LoadingButton } from '@/components/ui/LoadingButton'

type Variant = 'headmaster' | 'admin'

const SyllabusSection = ({
  data,
  variant,
  isFetching,
  approveSyllabus,
  rejectSyllabus,
}: {
  data: ReturnType<typeof useAppData>['data']
  variant: Variant
  isFetching: boolean
  approveSyllabus: (id: string) => void
  rejectSyllabus: (id: string, reason?: string) => void
}) => {
  const reviewBase = variant === 'admin' ? '/app/admin' : '/app/headmaster'

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground">Syllabi awaiting approval</h2>
      <ul className="mt-3 space-y-3" role="list">
        {data.syllabusPending.map((s) => {
          const ws = workspaceById(data, s.workspaceId)
          return (
            <li
              key={s.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-foreground">
                  {ws?.subjectName} · {ws?.classLabel}
                </p>
                <p className="text-xs text-muted-foreground">Submitted {s.submittedAt}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`${reviewBase}/syllabus/${s.workspaceId}`}
                  className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                >
                  Review
                </Link>
                <LoadingButton
                  type="button"
                  loading={isFetching}
                  loadingLabel="Approving…"
                  onClick={() => approveSyllabus(s.workspaceId)}
                  className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                >
                  Approve
                </LoadingButton>
                <LoadingButton
                  type="button"
                  loading={isFetching}
                  loadingLabel="Rejecting…"
                  onClick={() => {
                    const reason = window.prompt('Rejection reason (optional):') ?? ''
                    rejectSyllabus(s.workspaceId, reason || undefined)
                  }}
                  className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700"
                >
                  Reject
                </LoadingButton>
              </div>
            </li>
          )
        })}
        {data.syllabusPending.length === 0 ? (
          <li className="text-sm text-muted-foreground">None pending.</li>
        ) : null}
      </ul>
    </section>
  )
}

export const PendingTasksPage = ({ variant }: { variant: Variant }) => {
  const { user } = useAuth()
  const { data: profiles } = useProfiles()
  const {
    data,
    approveSyllabus,
    rejectSyllabus,
    approveChangeRequest,
    rejectChangeRequest,
    approveAccountRequest,
    rejectAccountRequest,
    approveSubjectRequest,
    rejectSubjectRequest,
    approveBehaviourRecord,
    rejectBehaviourRecord,
    isFetching,
  } = useAppData()

  const [rejectingId, setRejectingId] = useState<string | null>(null)

  const isHm = variant === 'headmaster' && user?.role === 'headmaster'
  const isAd = variant === 'admin' && user?.role === 'admin'

  if (!isHm && !isAd) {
    return <p className="text-sm text-muted-foreground">Access denied.</p>
  }

  const teacherName = (id: string) =>
    profiles?.find((p) => p.id === id)?.display_name ?? id

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-4xl space-y-10">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Pending tasks</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isHm
              ? 'Governance and school-wide actions'
              : 'Operational and curriculum approval tasks'}
          </p>
        </div>

        {isHm || isAd ? (
          <SyllabusSection
            data={data}
            variant={variant}
            isFetching={isFetching}
            approveSyllabus={approveSyllabus}
            rejectSyllabus={rejectSyllabus}
          />
        ) : null}

        {isHm || isAd ? (
          <section>
            <h2 className="text-lg font-semibold text-foreground">Subject requests</h2>
            <ul className="mt-3 space-y-3" role="list">
              {data.subjectRequests.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {s.subjectName} · {s.classLabel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {teacherName(s.teacherId)} · {s.requestedAt}
                    </p>
                    {s.notes ? (
                      <p className="mt-1 text-sm text-muted-foreground">{s.notes}</p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <LoadingButton
                      type="button"
                      loading={isFetching}
                      loadingLabel="Approving…"
                      onClick={() => approveSubjectRequest(s.id)}
                      className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                    >
                      Approve
                    </LoadingButton>
                    <LoadingButton
                      type="button"
                      loading={isFetching}
                      loadingLabel="Rejecting…"
                      onClick={() => rejectSubjectRequest(s.id)}
                      className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700"
                    >
                      Reject
                    </LoadingButton>
                  </div>
                </li>
              ))}
              {data.subjectRequests.length === 0 ? (
                <li className="text-sm text-muted-foreground">None pending.</li>
              ) : null}
            </ul>
          </section>
        ) : null}

        {isHm ? (
          <section>
            <h2 className="text-lg font-semibold text-foreground">Behaviour records</h2>
            <ul className="mt-3 space-y-3" role="list">
              {data.behaviourPending.map((b) => {
                const ws = workspaceById(data, b.workspaceId)
                return (
                  <li key={b.id} className="rounded-xl border border-border bg-card p-4">
                    <p className="font-medium text-foreground">
                      {studentName(data, b.studentId)} · {ws?.subjectName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Rating {b.rating}/5 · {b.date}
                    </p>
                    <p className="mt-1 text-sm">{b.remark}</p>
                    <div className="mt-3 flex gap-2">
                      <LoadingButton
                        type="button"
                        loading={isFetching}
                        loadingLabel="Approving…"
                        onClick={() => approveBehaviourRecord(b.id)}
                        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                      >
                        Approve
                      </LoadingButton>
                      <LoadingButton
                        type="button"
                        loading={isFetching}
                        loadingLabel="Rejecting…"
                        onClick={() => rejectBehaviourRecord(b.id)}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm"
                      >
                        Reject
                      </LoadingButton>
                    </div>
                  </li>
                )
              })}
              {data.behaviourPending.length === 0 ? (
                <p className="text-sm text-muted-foreground">None pending.</p>
              ) : null}
            </ul>
          </section>
        ) : null}

        {isHm ? (
          <section>
            <h2 className="text-lg font-semibold text-foreground">Change requests</h2>
            <ul className="mt-3 space-y-3" role="list">
              {data.changeRequests.map((c) => {
                const ws = workspaceById(data, c.workspaceId)
                return (
                  <li
                    key={c.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <p className="text-sm text-foreground">{c.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      {ws?.subjectName} · {c.requestedAt}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <LoadingButton
                        type="button"
                        loading={isFetching}
                        loadingLabel="Approving…"
                        onClick={() => approveChangeRequest(c.id)}
                        className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                      >
                        Approve
                      </LoadingButton>
                      <LoadingButton
                        type="button"
                        loading={isFetching}
                        loadingLabel="Rejecting…"
                        onClick={() => rejectChangeRequest(c.id)}
                        className="rounded-lg border border-border px-3 py-1.5 text-sm"
                      >
                        Reject
                      </LoadingButton>
                    </div>
                  </li>
                )
              })}
              {data.changeRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground">None.</p>
              ) : null}
            </ul>
          </section>
        ) : null}

        <section>
          <h2 className="text-lg font-semibold text-foreground">Account requests</h2>
          <ul className="mt-3 space-y-3" role="list">
            {data.accountRequests.map((a) => (
              <li
                key={a.id}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.email} · {a.requestedRole} · {a.requestedAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <LoadingButton
                    type="button"
                    loading={isFetching}
                    loadingLabel="Approving…"
                    onClick={() => approveAccountRequest(a.id)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
                  >
                    Approve
                  </LoadingButton>
                  <LoadingButton
                    type="button"
                    loading={isFetching || rejectingId === a.id}
                    loadingLabel="Rejecting…"
                    onClick={() => {
                      setRejectingId(a.id)
                      rejectAccountRequest(a.id)
                      setRejectingId(null)
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-sm"
                  >
                    Reject
                  </LoadingButton>
                </div>
              </li>
            ))}
            {data.accountRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground">None.</p>
            ) : null}
          </ul>
        </section>

        {isHm ? (
          <section>
            <h2 className="text-lg font-semibold text-foreground">Flags</h2>
            <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
              {data.flaggedStudents.map((f) => (
                <li key={f.studentId}>
                  {studentName(data, f.studentId)} — {f.reason}
                </li>
              ))}
              {data.teacherBehindIds.length > 0 ? (
                <li>Teachers behind plan: {data.teacherBehindIds.length} flagged</li>
              ) : null}
              {data.attendanceLowStudentIds.map((id) => (
                <li key={id}>Low attendance: {studentName(data, id)}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {isAd ? (
          <section>
            <h2 className="text-lg font-semibold text-foreground">Timetable & enrolment</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {data.timetableConflicts.map((t) => (
                <li key={t.id} className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                  {t.description}
                </li>
              ))}
              {data.enrolmentGaps.map((e) => (
                <li key={e.id} className="rounded-lg border border-border p-3">
                  {e.description}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </AppDataLoading>
  )
}
