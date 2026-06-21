import { useState } from 'react'
import { useProfiles, useUserAdminMutations } from '@/hooks/queries/useTmsData'
import { AppDataLoading } from '@/components/app/AppDataLoading'
import { QuerySkeleton } from '@/components/app/QuerySkeleton'
import { LoadingButton } from '@/components/ui/LoadingButton'
import type { Role } from '@/types/tms'

export const UsersAdminPage = () => {
  const { data: profiles, isLoading } = useProfiles()
  const { create, deactivate, reactivate, resetPassword, updateRole, importStudents } =
    useUserAdminMutations()
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    email: '',
    role: 'teacher' as Role,
    password: 'ChangeMe123!',
    classLabel: '',
  })

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">User accounts</h1>
        <p className="text-sm text-muted-foreground">PRD §8.7 — create, deactivate, reset password.</p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Add user
          </button>
          <LoadingButton
            type="button"
            loading={importStudents.isPending}
            loadingLabel="Importing…"
            onClick={() => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = '.csv'
              input.onchange = () => {
                const file = input.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => importStudents.mutate(reader.result as string)
                reader.readAsText(file)
              }
              input.click()
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Import students CSV
          </LoadingButton>
        </div>

        {showCreate ? (
          <form
            className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault()
              create.mutate(form)
              setShowCreate(false)
            }}
          >
            <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" required />
            <input placeholder="Display name" value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" required />
            <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" required />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="rounded-lg border px-3 py-2 text-sm">
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="headmaster">Headmaster</option>
              <option value="admin">Admin</option>
            </select>
            <input placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
            <input placeholder="Class label (students)" value={form.classLabel} onChange={(e) => setForm({ ...form, classLabel: e.target.value })} className="rounded-lg border px-3 py-2 text-sm" />
            <LoadingButton
              type="submit"
              loading={create.isPending}
              loadingLabel="Creating…"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground sm:col-span-2"
            >
              Create user
            </LoadingButton>
          </form>
        ) : null}

        <QuerySkeleton isLoading={isLoading} variant="table" tableColumns={5}>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
                {(profiles ?? []).map((u) => (
                  <tr key={u.id} className="border-t border-border">
                    <td className="p-3">{u.display_name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                    <td className="p-3">{u.active ? 'Active' : 'Inactive'}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {u.active ? (
                          <button type="button" onClick={() => deactivate.mutate(u.id)} className="text-xs text-red-700 underline">Deactivate</button>
                        ) : (
                          <button type="button" onClick={() => reactivate.mutate(u.id)} className="text-xs text-primary underline">Reactivate</button>
                        )}
                        <button type="button" onClick={() => resetPassword.mutate(u.id)} className="text-xs underline">Reset pwd</button>
                        <select
                          defaultValue={u.role}
                          onChange={(e) => updateRole.mutate({ userId: u.id, role: e.target.value as Role })}
                          className="text-xs"
                        >
                          <option value="teacher">Teacher</option>
                          <option value="student">Student</option>
                          <option value="parent">Parent</option>
                          <option value="headmaster">Headmaster</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        </QuerySkeleton>
      </div>
    </AppDataLoading>
  )
}
