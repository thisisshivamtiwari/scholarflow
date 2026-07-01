import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  useAppData,
  useProfiles,
  useSchoolConfig,
  useTimetableMutations,
  useTimetableSlots,
} from '@/hooks/queries/useTmsData'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { QuerySkeleton } from '@/components/app/QuerySkeleton'
import { LoadingButton } from '@/components/ui/LoadingButton'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const
const PERIODS = ['09:00', '10:15', '11:30', '13:00', '14:15'] as const

type SlotRow = {
  id: string
  day: string
  start_time: string
  end_time: string
  subject_name: string
  class_label: string
  teacher_user_id: string | null
  teacher_name: string
  room: string
  workspace_id: string | null
}

const DraggableSlot = ({ slot, onRemove }: { slot: SlotRow; onRemove: () => void }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: slot.id,
    data: { slotId: slot.id },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`cursor-grab rounded border border-primary/30 bg-primary/5 p-2 text-xs ${isDragging ? 'opacity-50' : ''}`}
    >
      <p className="font-medium">{slot.subject_name}</p>
      <p className="text-muted-foreground">{slot.room}</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="mt-1 text-red-600 underline"
      >
        Remove
      </button>
    </div>
  )
}

const DroppableCell = ({
  id,
  slot,
  onRemove,
}: {
  id: string
  slot?: SlotRow
  onRemove: (id: string) => void
}) => {
  const { setNodeRef, isOver } = useDroppable({ id })
  return (
    <td
      ref={setNodeRef}
      className={`min-h-[60px] border-l border-border p-1 align-top ${isOver ? 'bg-primary/5' : ''}`}
    >
      {slot ? (
        <DraggableSlot slot={slot} onRemove={() => onRemove(slot.id)} />
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      )}
    </td>
  )
}

export const TimetableAdminPage = () => {
  const { data: appData } = useAppData()
  const { data: slots, isLoading } = useTimetableSlots()
  const { data: school } = useSchoolConfig()
  const { data: profiles } = useProfiles()
  const { create, update, remove } = useTimetableMutations()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState({
    subjectName: '',
    classLabel: 'Year 9A',
    teacherUserId: '',
    room: '',
    day: 'Mon' as (typeof DAYS)[number],
    startTime: '09:00',
    endTime: '10:00',
    workspaceId: '',
  })

  const teachers = (profiles ?? []).filter((p) =>
    ['teacher', 'headmaster'].includes(p.role),
  )
  const yearGroups = useMemo(() => {
    const labels = new Set<string>()
    for (const s of slots ?? []) labels.add(s.class_label)
    for (const w of appData?.workspaces ?? []) labels.add(w.classLabel)
    labels.add('Year 9A')
    return [...labels]
  }, [slots, appData?.workspaces])

  const workspaces = appData?.workspaces ?? []

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const conflicts = useMemo(() => {
    const list = slots ?? []
    const found: string[] = []
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i]
        const b = list[j]
        if (a.day === b.day && a.start_time === b.start_time) {
          if (a.room && a.room === b.room) found.push(`Room ${a.room} on ${a.day} ${a.start_time}`)
          if (a.teacher_user_id && a.teacher_user_id === b.teacher_user_id) {
            found.push(`Teacher double-booked ${a.day} ${a.start_time}`)
          }
        }
      }
    }
    return found
  }, [slots])

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
    const { active, over } = event
    if (!over || !active.data.current?.slotId) return
    const cell = String(over.id).split('|')
    if (cell.length !== 2) return
    const [day, startTime] = cell
    update.mutate(
      {
        id: active.data.current.slotId as string,
        patch: { day, start_time: `${startTime}:00` },
      },
      {
        onSuccess: () => {
          setMessage('Lesson rescheduled.')
          setTimeout(() => setMessage(null), 2500)
        },
      },
    )
  }

  const slotAt = (day: string, start: string) =>
    (slots ?? []).find((s) => s.day === day && s.start_time.startsWith(start))

  const teacherName = (id: string) =>
    teachers.find((t) => t.id === id)?.display_name ?? ''

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Timetable management</h1>
            <p className="text-sm text-muted-foreground">Drag lessons to reschedule.</p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Add lesson
          </button>
        </div>

        {message ? (
          <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800" role="status">
            {message}
          </p>
        ) : null}

        {conflicts.length > 0 ? (
          <ul className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 text-sm">
            {conflicts.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        ) : null}

        {showForm && school ? (
          <form
            className="grid gap-2 rounded-xl border border-border bg-card p-4 sm:grid-cols-3"
            onSubmit={(e) => {
              e.preventDefault()
              const ws = workspaces.find((w) => w.id === form.workspaceId)
              create.mutate(
                {
                  schoolId: school.id,
                  day: form.day,
                  startTime: `${form.startTime}:00`,
                  endTime: `${form.endTime}:00`,
                  subjectName: form.subjectName || ws?.subjectName || '',
                  classLabel: form.classLabel,
                  teacherUserId: form.teacherUserId || ws?.teacherUserId,
                  teacherName: teacherName(form.teacherUserId) || teacherName(ws?.teacherUserId ?? ''),
                  room: form.room,
                  workspaceId: form.workspaceId || ws?.id,
                },
                {
                  onSuccess: () => {
                    setShowForm(false)
                    setMessage('Lesson added.')
                    setTimeout(() => setMessage(null), 2500)
                  },
                },
              )
            }}
          >
            <select
              value={form.workspaceId}
              onChange={(e) => {
                const ws = workspaces.find((w) => w.id === e.target.value)
                setForm({
                  ...form,
                  workspaceId: e.target.value,
                  subjectName: ws?.subjectName ?? form.subjectName,
                  classLabel: ws?.classLabel ?? form.classLabel,
                  teacherUserId: ws?.teacherUserId ?? form.teacherUserId,
                })
              }}
              className="rounded border px-2 py-1 text-sm sm:col-span-3"
            >
              <option value="">Link workspace (optional)</option>
              {workspaces.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.subjectName} · {w.classLabel}
                </option>
              ))}
            </select>
            <input placeholder="Subject" value={form.subjectName} onChange={(e) => setForm({ ...form, subjectName: e.target.value })} className="rounded border px-2 py-1 text-sm" required />
            <select value={form.classLabel} onChange={(e) => setForm({ ...form, classLabel: e.target.value })} className="rounded border px-2 py-1 text-sm">
              {yearGroups.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select value={form.teacherUserId} onChange={(e) => setForm({ ...form, teacherUserId: e.target.value })} className="rounded border px-2 py-1 text-sm" required>
              <option value="">Select teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.display_name}</option>
              ))}
            </select>
            <input placeholder="Room" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="rounded border px-2 py-1 text-sm" />
            <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value as typeof form.day })} className="rounded border px-2 py-1 text-sm">
              {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <LoadingButton
              type="submit"
              loading={create.isPending}
              loadingLabel="Saving…"
              className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
            >
              Save
            </LoadingButton>
          </form>
        ) : null}

        <QuerySkeleton isLoading={isLoading} variant="timetable">
          <DndContext
            sensors={sensors}
            onDragStart={(e) => setActiveId(String(e.active.id))}
            onDragEnd={handleDragEnd}
          >
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-2">Time</th>
                    {DAYS.map((d) => (
                      <th key={d} className="p-2">{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PERIODS.map((period) => (
                    <tr key={period} className="border-t border-border">
                      <td className="p-2 font-medium">{period}</td>
                      {DAYS.map((day) => {
                        const slot = slotAt(day, period)
                        const cellId = `${day}|${period}`
                        return (
                          <DroppableCell
                            key={cellId}
                            id={cellId}
                            slot={slot}
                            onRemove={(id) => remove.mutate(id)}
                          />
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <DragOverlay>{activeId ? <div className="rounded bg-primary/20 p-2 text-xs">Moving…</div> : null}</DragOverlay>
          </DndContext>
        </QuerySkeleton>
      </div>
    </AppDataLoading>
  )
}
