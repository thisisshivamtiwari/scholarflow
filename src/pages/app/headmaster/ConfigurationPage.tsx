import { useAppData } from '@/context/AppDataContext'

export const ConfigurationPage = () => {
  const { data } = useAppData()
  const { school } = data

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">School configuration</h1>
      <p className="text-sm text-muted-foreground">PRD §8.8 — read-only demo fields.</p>
      <dl className="space-y-3 rounded-xl border border-border bg-card p-6 text-sm">
        <div>
          <dt className="text-muted-foreground">School</dt>
          <dd className="font-medium text-foreground">{school.name}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Academic year</dt>
          <dd className="font-medium">{school.academicYear}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Grade threshold (%)</dt>
          <dd className="font-medium">{school.gradeThresholdPercent}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Attendance threshold (%)</dt>
          <dd className="font-medium">{school.attendanceThresholdPercent}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Parent resource access</dt>
          <dd className="font-medium">{school.parentResourceAccess ? 'On' : 'Off'}</dd>
        </div>
      </dl>
    </div>
  )
}
