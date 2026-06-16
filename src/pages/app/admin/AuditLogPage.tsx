import { useAuditLogs } from '@/hooks/queries/useTmsData'
import { AppDataLoading } from '@/components/app/AppDataLoading'

export const AuditLogPage = () => {
  const { data: logs, isLoading } = useAuditLogs()

  return (
    <AppDataLoading>
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Audit log</h1>
        <p className="text-sm text-muted-foreground">
          All data modifications (PRD §4.2 / §11) — retained for compliance review.
        </p>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading audit entries…</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-3">Time</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Table</th>
                  <th className="p-3">Record</th>
                </tr>
              </thead>
              <tbody>
                {(logs ?? []).map((log) => (
                  <tr key={log.id} className="border-t border-border">
                    <td className="p-3 text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-3 font-medium">{log.action}</td>
                    <td className="p-3">{log.table_name}</td>
                    <td className="p-3 font-mono text-xs">{log.record_id ?? '—'}</td>
                  </tr>
                ))}
                {(logs ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-muted-foreground">
                      No audit entries yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppDataLoading>
  )
}
