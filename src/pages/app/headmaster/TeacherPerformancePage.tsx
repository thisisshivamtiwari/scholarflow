import { useAppData } from '@/context/AppDataContext'

export const TeacherPerformancePage = () => {
  const { data } = useAppData()

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">Teacher performance</h1>
      <p className="text-sm text-muted-foreground">
        Delivery rate, tracking completion, class averages (PRD §8.5).
      </p>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="font-medium text-foreground">Dr. Morgan Chen</p>
        <ul className="mt-3 list-inside list-disc text-sm text-muted-foreground">
          <li>Curriculum delivery: 2 workspaces active</li>
          <li>
            Behind plan flag:{' '}
            {data.teacherBehindIds.includes('u-teacher') ? 'Yes' : 'No'}
          </li>
          <li>Weekly tracking completion: sample 85%</li>
        </ul>
      </div>
    </div>
  )
}
