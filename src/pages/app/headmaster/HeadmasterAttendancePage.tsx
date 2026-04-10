import { useAppData } from '@/context/AppDataContext'

export const HeadmasterAttendancePage = () => {
  const { data } = useAppData()
  const total = data.attendance.length
  const present = data.attendance.filter(
    (a) => a.presence === 'present' || a.presence === 'late',
  ).length
  const rate = total ? Math.round((present / total) * 100) : 0

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Attendance overview</h1>
      <p className="text-sm text-muted-foreground">School-wide rates (PRD §8.6)</p>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-3xl font-semibold text-foreground">{rate}%</p>
        <p className="text-sm text-muted-foreground">Sample aggregate across demo records</p>
      </div>
    </div>
  )
}
