import { dummyUsers } from '@/data/dummyUsers'

export const UsersAdminPage = () => {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">User accounts</h1>
      <p className="text-sm text-muted-foreground">
        Create, deactivate, reset password, role reassignment (PRD §8.7) — demo list.
      </p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {dummyUsers.map((u) => (
              <tr key={u.id} className="border-t border-border">
                <td className="p-3">{u.displayName}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
      >
        Add user (stub)
      </button>
    </div>
  )
}
