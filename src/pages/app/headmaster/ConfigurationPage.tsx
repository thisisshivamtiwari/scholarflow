import { useState } from 'react'
import { useAppData } from '@/context/AppDataContext'
import { useSchoolConfig, useConfigMutations } from '@/hooks/queries/useTmsData'
import { AppDataLoading } from '@/components/app/AppDataLoading'

export const ConfigurationPage = () => {
  const { data } = useAppData()
  const { data: schoolRow } = useSchoolConfig()
  const { updateSchool } = useConfigMutations()
  const [form, setForm] = useState<Record<string, string | number | boolean>>({})

  const school = data.school
  const values = {
    academicYear: (form.academicYear as string) ?? school.academicYear,
    gradeThreshold: (form.gradeThreshold as number) ?? school.gradeThresholdPercent,
    attendanceThreshold: (form.attendanceThreshold as number) ?? school.attendanceThresholdPercent,
    parentResourceAccess: (form.parentResourceAccess as boolean) ?? school.parentResourceAccess,
    sessionTimeout: (form.sessionTimeout as number) ?? schoolRow?.session_timeout_minutes ?? 30,
  }

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-2xl space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">School configuration</h1>
        <p className="text-sm text-muted-foreground">PRD §8.8 — editable school settings.</p>
        <form
          className="space-y-4 rounded-xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault()
            if (!schoolRow) return
            updateSchool.mutate({
              id: schoolRow.id,
              academic_year: values.academicYear,
              grade_threshold_percent: Number(values.gradeThreshold),
              attendance_threshold_percent: Number(values.attendanceThreshold),
              parent_resource_access: values.parentResourceAccess,
              session_timeout_minutes: Number(values.sessionTimeout),
            })
          }}
        >
          <label className="block text-sm">
            <span className="text-muted-foreground">School</span>
            <p className="font-medium">{school.name}</p>
          </label>
          <label className="block text-sm">
            Academic year
            <input
              value={values.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Grade threshold (%)
            <input
              type="number"
              value={values.gradeThreshold}
              onChange={(e) => setForm({ ...form, gradeThreshold: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Attendance threshold (%)
            <input
              type="number"
              value={values.attendanceThreshold}
              onChange={(e) => setForm({ ...form, attendanceThreshold: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Session timeout (minutes)
            <input
              type="number"
              value={values.sessionTimeout}
              onChange={(e) => setForm({ ...form, sessionTimeout: Number(e.target.value) })}
              className="mt-1 w-full rounded-lg border border-border px-3 py-2"
            />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.parentResourceAccess}
              onChange={(e) => setForm({ ...form, parentResourceAccess: e.target.checked })}
            />
            Parent resource access
          </label>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Save configuration
          </button>
        </form>
      </div>
    </AppDataLoading>
  )
}
