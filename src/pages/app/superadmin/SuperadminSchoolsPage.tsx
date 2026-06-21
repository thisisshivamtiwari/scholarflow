import { useState, type FormEvent } from 'react'
import { LoadingButton } from '@/components/ui/LoadingButton'
import { PageSkeleton } from '@/components/ui/LoadingSkeletons'
import { useCreateSchool, usePlatformSchools } from '@/hooks/queries/usePlatformData'

export const SuperadminSchoolsPage = () => {
  const { data: schools, isLoading } = usePlatformSchools()
  const createSchool = useCreateSchool()
  const [externalId, setExternalId] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await createSchool.mutateAsync({ externalId, name })
      setExternalId('')
      setName('')
    } catch (err) {
      setError((err as Error).message)
    }
  }

  if (isLoading) {
    return <PageSkeleton variant="table" tableColumns={3} />
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Schools</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Create and view customer tenants. Each school gets an external ID used at login.
        </p>
      </div>

      <form
        onSubmit={(e) => void handleSubmit(e)}
        className="rounded-xl border border-border bg-card p-6 space-y-4"
      >
        <h2 className="text-sm font-semibold text-foreground">Add school</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="externalId" className="block text-sm font-medium">
              External ID
            </label>
            <input
              id="externalId"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
              placeholder="ACME01"
              required
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm uppercase"
            />
          </div>
          <div>
            <label htmlFor="schoolName" className="block text-sm font-medium">
              School name
            </label>
            <input
              id="schoolName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Academy"
              required
              className="mt-1.5 w-full rounded-lg border border-border px-3 py-2.5 text-sm"
            />
          </div>
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <LoadingButton
          type="submit"
          loading={createSchool.isPending}
          loadingLabel="Creating…"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Create school
        </LoadingButton>
      </form>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3">External ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Academic year</th>
            </tr>
          </thead>
          <tbody>
            {(schools ?? []).length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-muted-foreground">
                  No customer schools yet.
                </td>
              </tr>
            ) : (
              (schools ?? []).map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-3 font-mono text-xs">{s.external_id}</td>
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 text-muted-foreground">{s.academic_year}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
