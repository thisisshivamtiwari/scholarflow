import { usePlatformAccountRequests } from '@/hooks/queries/usePlatformData'

export const SuperadminAccountRequestsPage = () => {
  const { data: requests, isLoading } = usePlatformAccountRequests()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Account requests</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          All onboarding requests across customer schools. School admins approve within their tenant.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3">Submitted</th>
              <th className="p-3">School</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-4 text-muted-foreground">
                  Loading requests…
                </td>
              </tr>
            ) : (requests ?? []).length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-muted-foreground">
                  No account requests.
                </td>
              </tr>
            ) : (
              (requests ?? []).map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3 text-muted-foreground">
                    {new Date(r.requested_at).toLocaleString()}
                  </td>
                  <td className="p-3 font-mono text-xs">{r.school_external_id}</td>
                  <td className="p-3">{r.name}</td>
                  <td className="p-3">{r.email}</td>
                  <td className="p-3 capitalize">{r.requested_role}</td>
                  <td className="p-3 capitalize">{r.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
