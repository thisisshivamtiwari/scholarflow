import type { ReactNode } from 'react'

type DashboardShellProps = {
  title: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export const DashboardShell = ({ title, subtitle, actions, children }: DashboardShellProps) => (
  <div className="mx-auto max-w-6xl space-y-8">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
    {children}
  </div>
)
